import { getTelegramWebApp } from "@/lib/telegram";

export async function postWithAuth<T = unknown>(url: string, body: unknown): Promise<T> {
  const initData = getTelegramWebApp()?.initData ?? "";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-telegram-init-data": initData,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Request to ${url} failed with ${res.status}`);
  }

  return res.json();
}
