import { redis } from "@/lib/redis";

export interface PendingOrder {
  productId: string;
  price: number;
  createdAt: string;
}

const key = (chatId: number | string) => `pending:${chatId}`;

export async function setPendingOrder(chatId: number, productId: string, price: number): Promise<void> {
  const order: PendingOrder = { productId, price, createdAt: new Date().toISOString() };
  await redis.set(key(chatId), JSON.stringify(order));
}

export async function getPendingOrder(chatId: number): Promise<PendingOrder | null> {
  const raw = await redis.get(key(chatId));
  return raw ? (JSON.parse(raw) as PendingOrder) : null;
}

export async function clearPendingOrder(chatId: number): Promise<void> {
  await redis.set(key(chatId), "");
}

const qa5Key = (chatId: number | string) => `qa5:${chatId}`;

export async function grantQa5(chatId: number): Promise<void> {
  await redis.set(qa5Key(chatId), "5");
}

export async function getQa5Remaining(chatId: number): Promise<number> {
  const raw = await redis.get(qa5Key(chatId));
  return raw ? Number(raw) : 0;
}

export async function decrementQa5(chatId: number): Promise<number> {
  const remaining = Math.max(0, (await getQa5Remaining(chatId)) - 1);
  await redis.set(qa5Key(chatId), String(remaining));
  return remaining;
}
