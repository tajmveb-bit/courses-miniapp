import { NextRequest, NextResponse } from "next/server";
import { generateSingleCode } from "@/lib/unlockCodes";
import { recordUser } from "@/lib/botUsers";
import { getProduct, SECTION_PRODUCTS } from "@/lib/salesProducts";
import {
  setPendingOrder,
  getPendingOrder,
  clearPendingOrder,
  grantQa5,
  getQa5Remaining,
  decrementQa5,
} from "@/lib/pendingOrders";

const BOT_TOKEN = process.env.SAIFER_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.SAIFER_BOT_WEBHOOK_SECRET;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const APP_URL = process.env.APP_URL ?? "https://courses-miniapp.vercel.app";
const KASPI_LINK = "https://pay.kaspi.kz/pay/pdpl8uef";

interface InlineButton {
  text: string;
  callback_data?: string;
  web_app?: { url: string };
}

interface TelegramUpdate {
  message?: {
    chat: { id: number; username?: string; first_name?: string; last_name?: string };
    text?: string;
    photo?: { file_id: string }[];
  };
  callback_query?: {
    id: string;
    from: { id: number };
    message?: { chat: { id: number } };
    data?: string;
  };
}

async function tg(method: string, body: Record<string, unknown>): Promise<void> {
  if (!BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function sendMessage(chatId: number, text: string, buttons?: InlineButton[][]): Promise<void> {
  return tg("sendMessage", {
    chat_id: chatId,
    text,
    reply_markup: buttons ? { inline_keyboard: buttons } : undefined,
  });
}

function sendPhoto(chatId: number, fileId: string, caption: string, buttons?: InlineButton[][]): Promise<void> {
  return tg("sendPhoto", {
    chat_id: chatId,
    photo: fileId,
    caption,
    reply_markup: buttons ? { inline_keyboard: buttons } : undefined,
  });
}

function answerCallback(callbackQueryId: string, text?: string): Promise<void> {
  return tg("answerCallbackQuery", { callback_query_id: callbackQueryId, text, show_alert: false });
}

function mainMenu(): InlineButton[][] {
  return [
    [{ text: "🔮 Разделы Матрицы — от 5000₸", callback_data: "cat:sections" }],
    [{ text: "📅 Полный прогноз — 15000₸", callback_data: "buy:forecast" }],
    [{ text: "🗨 5 вопросов по раскладам — 3000₸", callback_data: "buy:qa5" }],
    [{ text: "💎 Консультация с Анастасией (60 мин) — 50000₸", callback_data: "buy:consult" }],
    [{ text: "📱 Открыть приложение", web_app: { url: APP_URL } }],
  ];
}

function sectionsMenu(): InlineButton[][] {
  const rows = SECTION_PRODUCTS.map((p) => [
    { text: `${p.label} — ${p.price.toLocaleString("ru-RU")}₸`, callback_data: `buy:${p.id}` },
  ]);
  rows.push([{ text: "⬅️ Назад", callback_data: "cat:main" }]);
  return rows;
}

const WELCOME =
  "Привет! Я бот Сайфер 🔮\n\n" +
  "Здесь можно получить доступ к клубу «Точка Силы» — расчёт Матрицы судьбы, разборы по датам рождения и консультации с экспертом Анастасией Гафке.\n\n" +
  "Выберите, что вас интересует 👇";

function paymentInstructions(productLabel: string, price: number): string {
  return (
    `Отлично! «${productLabel}» — ${price.toLocaleString("ru-RU")}₸.\n\n` +
    `1. Оплатите по ссылке: ${KASPI_LINK}\n` +
    `2. Пришлите сюда скриншот чека\n\n` +
    `Как только чек придёт, доступ откроется сразу.`
  );
}

// No payment verification — a received screenshot is treated as proof of payment and the
// key is issued immediately, per an explicit decision to skip checking against Kaspi.
async function fulfillOrder(chatId: number, productId: string): Promise<void> {
  const product = getProduct(productId);
  if (!product) return;

  if (product.kind === "section" && product.section) {
    const issued = await generateSingleCode(product.section);
    await sendMessage(
      chatId,
      `✅ Оплата получена!\n\nКод доступа к разделу «${issued.label}»: ${issued.code}\n\nВведите его в приложении в этом разделе, чтобы открыть полный разбор.`
    );
  } else if (product.kind === "consult") {
    await sendMessage(
      chatId,
      "✅ Оплата получена!\n\nАнастасия свяжется с вами напрямую, чтобы согласовать время консультации."
    );
  } else if (product.kind === "qa5") {
    await grantQa5(chatId);
    await sendMessage(
      chatId,
      "✅ Оплата получена!\n\nМожете задать до 5 вопросов прямо здесь, сообщением — каждый вопрос будет передан Анастасии, ответ придёт вам сюда."
    );
  }
  await clearPendingOrder(chatId);
}

export async function POST(req: NextRequest) {
  if (!BOT_TOKEN) {
    return NextResponse.json({ error: "Bot token not configured" }, { status: 500 });
  }

  if (WEBHOOK_SECRET) {
    const incomingSecret = req.headers.get("x-telegram-bot-api-secret-token");
    if (incomingSecret !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const update: TelegramUpdate = await req.json();

  // Button taps.
  if (update.callback_query) {
    const cq = update.callback_query;
    const data = cq.data ?? "";
    const chatId = cq.message?.chat.id;

    if (!chatId) {
      await answerCallback(cq.id);
      return NextResponse.json({ ok: true });
    }

    if (data === "cat:sections") {
      await sendMessage(chatId, "Выберите раздел:", sectionsMenu());
      await answerCallback(cq.id);
      return NextResponse.json({ ok: true });
    }

    if (data === "cat:main") {
      await sendMessage(chatId, "Выберите, что вас интересует:", mainMenu());
      await answerCallback(cq.id);
      return NextResponse.json({ ok: true });
    }

    if (data.startsWith("buy:")) {
      const productId = data.slice("buy:".length);
      const product = getProduct(productId);
      if (!product) {
        await answerCallback(cq.id);
        return NextResponse.json({ ok: true });
      }
      await setPendingOrder(chatId, product.id, product.price);
      await sendMessage(chatId, paymentInstructions(product.label, product.price));
      await answerCallback(cq.id);
      return NextResponse.json({ ok: true });
    }

    await answerCallback(cq.id);
    return NextResponse.json({ ok: true });
  }

  // Regular messages.
  const chat = update.message?.chat;
  const chatId = chat?.id;
  const text = update.message?.text?.trim();
  const photo = update.message?.photo;

  if (chat) {
    try {
      await recordUser(chat);
    } catch {
      // Redis not configured or unreachable — don't block replying over this.
    }
  }

  if (!chatId) {
    return NextResponse.json({ ok: true });
  }

  if (photo && photo.length > 0) {
    const pending = await getPendingOrder(chatId);
    if (!pending) {
      await sendMessage(chatId, "Не вижу активного заказа. Сначала выберите, что хотите приобрести:", mainMenu());
      return NextResponse.json({ ok: true });
    }
    const product = getProduct(pending.productId);
    const fileId = photo[photo.length - 1].file_id;
    const name = [chat?.first_name, chat?.last_name].filter(Boolean).join(" ") || "без имени";
    const handle = chat?.username ? `@${chat.username}` : "без username";

    await fulfillOrder(chatId, pending.productId);

    if (ADMIN_CHAT_ID) {
      await sendPhoto(
        Number(ADMIN_CHAT_ID),
        fileId,
        `🧾 Чек получен, ключ выдан автоматически\n\n${name} (${handle}), id ${chatId}\nТовар: ${product?.label ?? pending.productId}\nСумма: ${pending.price.toLocaleString("ru-RU")}₸`
      );
    }
    return NextResponse.json({ ok: true });
  }

  if (text === "/start" || text === "/menu" || text?.toLowerCase() === "меню") {
    await sendMessage(chatId, WELCOME, mainMenu());
    return NextResponse.json({ ok: true });
  }

  if (text) {
    const remaining = await getQa5Remaining(chatId);
    if (remaining > 0) {
      const left = await decrementQa5(chatId);
      const name = [chat?.first_name, chat?.last_name].filter(Boolean).join(" ") || "без имени";
      const handle = chat?.username ? `@${chat.username}` : "без username";
      if (ADMIN_CHAT_ID) {
        await sendMessage(
          Number(ADMIN_CHAT_ID),
          `❓ Вопрос от ${name} (${handle}), id ${chatId}, осталось ${left}/5:\n\n${text}`
        );
      }
      await sendMessage(chatId, `Вопрос передан Анастасии, ответ придёт сюда. Осталось вопросов: ${left}`);
      return NextResponse.json({ ok: true });
    }

    await sendMessage(chatId, "Не совсем поняла 🙂 Выберите, что вас интересует:", mainMenu());
  }

  return NextResponse.json({ ok: true });
}
