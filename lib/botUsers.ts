import { redis } from "@/lib/redis";

const USERS_SET_KEY = "users:all";

export interface BotUser {
  chatId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  firstSeen: string;
  lastSeen: string;
}

interface TelegramChat {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

// Called on every incoming message so we build up a list of who has talked to the bot —
// there's no other record of this (Telegram doesn't expose a "list all users" API).
export async function recordUser(chat: TelegramChat): Promise<void> {
  const key = `user:${chat.id}`;
  const now = new Date().toISOString();
  const existingRaw = await redis.get(key);
  const existing = existingRaw ? (JSON.parse(existingRaw) as BotUser) : null;

  const user: BotUser = {
    chatId: chat.id,
    username: chat.username,
    firstName: chat.first_name,
    lastName: chat.last_name,
    firstSeen: existing?.firstSeen ?? now,
    lastSeen: now,
  };

  await redis.set(key, JSON.stringify(user));
  await redis.sadd(USERS_SET_KEY, String(chat.id));
}

export async function listUsers(): Promise<BotUser[]> {
  const ids = await redis.smembers(USERS_SET_KEY);
  const users: BotUser[] = [];
  for (const id of ids) {
    const raw = await redis.get(`user:${id}`);
    if (raw) users.push(JSON.parse(raw) as BotUser);
  }
  users.sort((a, b) => b.lastSeen.localeCompare(a.lastSeen));
  return users;
}
