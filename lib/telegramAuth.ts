import crypto from "crypto";
import { NextRequest } from "next/server";

export interface TelegramAuthUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface TelegramAuth {
  user: TelegramAuthUser;
  authDate: number;
}

const MAX_AUTH_AGE_SECONDS = 24 * 60 * 60;

export function validateInitData(initData: string, botToken: string): TelegramAuth | null {
  if (!initData || !botToken) return null;

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const computedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  if (computedHash !== hash) return null;

  const authDate = Number(params.get("auth_date") ?? 0);
  if (!authDate || Date.now() / 1000 - authDate > MAX_AUTH_AGE_SECONDS) return null;

  const userRaw = params.get("user");
  if (!userRaw) return null;

  try {
    const user = JSON.parse(userRaw) as TelegramAuthUser;
    if (!user?.id) return null;
    return { user, authDate };
  } catch {
    return null;
  }
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export function getAuthFromRequest(req: NextRequest): TelegramAuth | null {
  const initData = req.headers.get("x-telegram-init-data");
  if (!initData || !BOT_TOKEN) return null;
  return validateInitData(initData, BOT_TOKEN);
}
