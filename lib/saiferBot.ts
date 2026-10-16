const BOT_TOKEN = process.env.SAIFER_BOT_TOKEN;
const KASPI_LINK = "https://pay.kaspi.kz/pay/pdpl8uef";

// Sends a message directly via the Bot API, bypassing Telegram's deep-link (?start=) mechanism
// entirely. Telegram only delivers a deep link's start payload the first time a user ever opens
// a given bot — for anyone who already has a chat with it, tapping the link just switches to the
// existing chat with nothing sent. A direct sendMessage call has no such limitation as long as
// the chat already exists (the person has messaged the bot before), which is exactly the case
// this is for. Returns false if the call fails (e.g. the chat doesn't exist yet), so the caller
// can fall back to the deep link.
export async function sendSaiferMessage(chatId: number, text: string): Promise<boolean> {
  if (!BOT_TOKEN) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data?.ok);
  } catch {
    return false;
  }
}

export function paymentInstructionsText(productLabel: string, price: number): string {
  return (
    `Отлично! «${productLabel}» — ${price.toLocaleString("ru-RU")}₸.\n\n` +
    `1. Оплатите по ссылке: ${KASPI_LINK}\n` +
    `2. Пришлите сюда скриншот чека\n\n` +
    `Как только чек придёт, доступ откроется сразу.`
  );
}
