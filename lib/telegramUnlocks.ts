import { redis } from "@/lib/redis";
import type { Section } from "@/lib/unlockCodes";

// Lets the sales bot unlock a section for a buyer directly, keyed by their Telegram user id,
// so opening the app through Telegram shows it unlocked with no code to type.
const key = (tgUserId: number | string, section: Section) => `tg-unlock:${tgUserId}:${section}`;

export async function grantAccess(tgUserId: number, section: Section): Promise<void> {
  await redis.set(key(tgUserId, section), "1");
}

export async function hasAccess(tgUserId: number, section: Section): Promise<boolean> {
  const value = await redis.get(key(tgUserId, section));
  return value === "1";
}
