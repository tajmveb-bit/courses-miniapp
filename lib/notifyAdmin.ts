const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

export async function sendTelegramMessage(chatId: string | number, text: string): Promise<void> {
  if (!BOT_TOKEN) return;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

export async function notifyAdmin(text: string): Promise<void> {
  if (!ADMIN_CHAT_ID) return;
  await sendTelegramMessage(ADMIN_CHAT_ID, text);
}

export function formatUserLine(user: { id: number; first_name: string; username?: string }): string {
  return `${user.first_name}${user.username ? ` (@${user.username})` : ""} · id ${user.id}`;
}
