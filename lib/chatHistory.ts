import { redis } from "@/lib/redis";
import type { ChatMessage } from "@/lib/openai";

const key = (chatId: number) => `chathist:${chatId}`;
// Keeps the OpenAI prompt small — recent context is enough for a sales conversation.
const MAX_MESSAGES = 12;

export async function getHistory(chatId: number): Promise<ChatMessage[]> {
  const raw = await redis.get(key(chatId));
  return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
}

export async function appendHistory(chatId: number, role: "user" | "assistant", content: string): Promise<void> {
  const history = await getHistory(chatId);
  history.push({ role, content });
  await redis.set(key(chatId), JSON.stringify(history.slice(-MAX_MESSAGES)));
}
