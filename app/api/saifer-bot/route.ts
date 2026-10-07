import { NextRequest, NextResponse } from "next/server";
import { generateSingleCode } from "@/lib/unlockCodes";
import { recordUser } from "@/lib/botUsers";
import { grantAccess } from "@/lib/telegramUnlocks";
import { getProduct, SECTION_PRODUCTS, type Product } from "@/lib/salesProducts";
import {
  setPendingOrder,
  getPendingOrder,
  clearPendingOrder,
  grantQa5,
  getQa5Remaining,
  decrementQa5,
} from "@/lib/pendingOrders";
import { getChatReply, type ChatMessage } from "@/lib/openai";
import { getHistory, appendHistory } from "@/lib/chatHistory";

const BOT_TOKEN = process.env.SAIFER_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.SAIFER_BOT_WEBHOOK_SECRET;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const APP_URL = process.env.APP_URL ?? "https://courses-miniapp.vercel.app";
const KASPI_LINK = "https://pay.kaspi.kz/pay/pdpl8uef";
const AI_ENABLED = Boolean(process.env.OPENAI_API_KEY);

interface InlineButton {
  text: string;
  callback_data?: string;
  web_app?: { url: string };
  url?: string;
}

interface TelegramUpdate {
  message?: {
    chat: { id: number; username?: string; first_name?: string; last_name?: string };
    text?: string;
    photo?: { file_id: string }[];
    document?: { file_id: string; mime_type?: string };
  };
  callback_query?: {
    id: string;
    from: { id: number };
    message?: { chat: { id: number } };
    data?: string;
  };
  my_chat_member?: {
    chat: { id: number; title?: string; type: string };
    new_chat_member: { status: string };
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

function sendDocument(chatId: number, fileId: string, caption: string, buttons?: InlineButton[][]): Promise<void> {
  return tg("sendDocument", {
    chat_id: chatId,
    document: fileId,
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
  "Здравствуйте! Меня зовут Сайфер 🔮\n\n" +
  "Я расскажу, что вам подойдёт, и помогу оформить доступ к клубу «Точка Силы» — Матрице судьбы эксперта Анастасии Гафке.\n\n" +
  "Коротко по ценам:\n" +
  "• Разбор одного раздела Матрицы — от 5000₸\n" +
  "• Полный прогноз на год/месяц/день — 15000₸\n" +
  "• 5 вопросов по раскладам — 3000₸\n" +
  "• Личная консультация с Анастасией (60 мин) — 50000₸\n\n" +
  "Какая тема вас интересует? Выберите ниже 👇";

const CHANNEL_INTRO_POST =
  "🔮 Клуб «Точка Силы»\n\n" +
  "Рассчитайте свою личную Матрицу судьбы: предназначение, роковую ошибку, денежный и другие коды, прогнозы и совместимость — по авторской методике эксперта Анастасии Гафке.\n\n" +
  "Что внутри:\n" +
  "• Разборы по разделам Матрицы — от 5000₸\n" +
  "• Полный прогноз — 15000₸\n" +
  "• 5 вопросов по раскладам — 3000₸\n" +
  "• Личная консультация с Анастасией — 50000₸\n\n" +
  "Выбирайте, что вам ближе 👇";

function channelCtaButtons(): InlineButton[][] {
  return [
    [{ text: "💳 Купить доступ", url: "https://t.me/Saifer_taro_bot?start=buy" }],
    [{ text: "❓ Задать вопрос", url: "https://t.me/Saifer_taro_bot?start=ask" }],
    [{ text: "📱 Открыть приложение", url: APP_URL }],
  ];
}

const GREETING_RE = /^\s*(привет|здравствуй|здравствуйте|добрый день|добрый вечер|доброе утро|хай|хелло|hello|hi)\b/i;
const PRICE_RE = /цен|стоимост|сколько стоит|прайс|тариф/i;
const MATRIX_RE = /матриц/i;
const FORECAST_RE = /прогноз/i;
const QA_RE = /расклад|таро|вопрос/i;
const CONSULT_RE = /консультац/i;

const MATRIX_INFO =
  "Матрица судьбы — это ваш личный расчёт по дате рождения: 5 предназначений, роковая ошибка, кармические узлы, чакры и код души. Разбор одного раздела открывается сразу после оплаты, от 5000₸.\n\nКакой раздел интересует?";
const FORECAST_INFO =
  "Прогноз показывает, какая энергия действует на вас в конкретный год, месяц и день, плюс график жизненной энергии — считается на любую дату. 15000₸.";
const QA_INFO =
  "Можно задать до 5 вопросов по раскладам и получить ответы, основанные на материалах Анастасии — 3000₸ за комплект из 5 вопросов.";
const CONSULT_INFO =
  "Личная консультация с Анастасией — час живого разбора, где она отвечает на все ваши вопросы и разбирает Матрицу целиком. 50000₸.";

const SYSTEM_PROMPT = `Ты — Сайфер, бот-консультант клуба «Точка Силы» в Telegram (нумерология, расчёт Матрицы судьбы по авторской методике эксперта Анастасии Гафке).

Твоя роль — дружелюбно общаться с людьми, которые пишут боту, рассказывать об услугах и ценах, отвечать на организационные вопросы и вести к покупке. Общайся тепло, как живой консультант, короткими сообщениями (2–4 предложения), на русском языке.

Актуальные продукты и цены — используй ТОЛЬКО эти цифры, никогда не придумывай другие и не меняй их:
- Разбор одного раздела Матрицы судьбы — 5000₸. Разделы (id для функции present_product в скобках): Матрица судьбы/предназначения (matrix), Кармические узлы (karmic-knots), Сфера духовности (spiritual-sphere), Сфера отношений (relationships), Совместимость (compatibility), Денежный код (code-money), Код удачи (code-luck), Код отношений (code-relationships), Код здоровья (code-health), Код духовного пути (code-spiritual).
- Полный прогноз на год/месяц/день + график энергии — 15000₸ (id: forecast).
- 5 вопросов по раскладам — 3000₸ за комплект (id: qa5).
- Личная консультация с Анастасией, 60 минут — 50000₸ (id: consult).

Жёсткие правила:
1. Никогда сама не давай нумерологические трактовки и не придумывай значения арканов, кодов или прогнозов — ты консультант по продажам, а не эксперт по нумерологии. Если спрашивают конкретную расшифровку (что значит мой аркан, какой у меня код и т.д.) — объясни, что расчёт делается в приложении или на консультации с Анастасией, и предложи оформить нужный раздел.
2. Никогда не называй другие цены, кроме перечисленных выше, и не обещай скидок.
3. Когда человек явно готов перейти к оплате конкретного товара — вызови функцию present_product с нужным id. Саму цену и ссылку на оплату не пиши, это добавит система.
4. Если не понимаешь, что хочет человек — переспроси или предложи команду /menu.`;

function paymentInstructions(productLabel: string, price: number): string {
  return (
    `Отлично! «${productLabel}» — ${price.toLocaleString("ru-RU")}₸.\n\n` +
    `1. Оплатите по ссылке: ${KASPI_LINK}\n` +
    `2. Пришлите сюда скриншот чека\n\n` +
    `Как только чек придёт, доступ откроется сразу.`
  );
}

function returnToAppButton(product: Product): InlineButton[][] {
  const url = product.appPath ? `${APP_URL}${product.appPath}` : APP_URL;
  return [[{ text: "📱 Вернуться в приложение", web_app: { url } }]];
}

// No payment verification — a received screenshot or PDF is treated as proof of payment and
// the key is issued immediately, per an explicit decision to skip checking against Kaspi.
// Returns a short summary of exactly what was issued, so the admin forward can prove it happened.
async function fulfillOrder(chatId: number, productId: string): Promise<string> {
  const product = getProduct(productId);
  if (!product) return "Товар не найден — ничего не выдано.";

  let summary: string;

  if (product.kind === "section" && product.section) {
    // Grants it automatically for this Telegram account (checked via the Mini App's own
    // initData) and also hands out a one-time code as a fallback for opening outside Telegram.
    await grantAccess(chatId, product.section);
    const issued = await generateSingleCode(product.section);
    await sendMessage(
      chatId,
      `✅ Оплата получена!\n\nДоступ к разделу «${issued.label}» уже открыт — просто откройте приложение, и раздел будет разблокирован сам.\n\nЕсли открываете не через этого бота, код для ручного ввода: ${issued.code}`,
      returnToAppButton(product)
    );
    summary = `Доступ открыт автоматически (${issued.label}), резервный код: ${issued.code}`;
  } else if (product.kind === "consult") {
    await sendMessage(
      chatId,
      "✅ Оплата получена!\n\nАнастасия свяжется с вами напрямую, чтобы согласовать время консультации.",
      returnToAppButton(product)
    );
    summary = "Клиент уведомлён — нужно связаться и назначить время консультации.";
  } else if (product.kind === "qa5") {
    await grantQa5(chatId);
    await sendMessage(
      chatId,
      "✅ Оплата получена!\n\nМожете задать до 5 вопросов прямо здесь, сообщением — каждый вопрос будет передан Анастасии, ответ придёт вам сюда.",
      returnToAppButton(product)
    );
    summary = "Активированы 5 вопросов.";
  } else {
    summary = "Ничего не выдано (неизвестный тип товара).";
  }

  await clearPendingOrder(chatId);
  return summary;
}

// Returns true once it has sent a reply (success or a graceful AI-side refusal); false means
// the OpenAI call itself failed, so the caller should fall back to the rule-based reply.
async function handleAiChat(chatId: number, text: string): Promise<boolean> {
  await appendHistory(chatId, "user", text);
  const history = await getHistory(chatId);
  const messages: ChatMessage[] = [{ role: "system", content: SYSTEM_PROMPT }, ...history];

  const result = await getChatReply(messages);
  if (!result.text && !result.productId) return false;

  if (result.productId) {
    const product = getProduct(result.productId);
    if (product) {
      await setPendingOrder(chatId, product.id, product.price);
      const intro = result.text ? `${result.text}\n\n` : "";
      const reply = `${intro}${paymentInstructions(product.label, product.price)}`;
      await appendHistory(chatId, "assistant", reply);
      await sendMessage(chatId, reply);
      return true;
    }
  }

  if (result.text) {
    await appendHistory(chatId, "assistant", result.text);
    await sendMessage(chatId, result.text, mainMenu());
    return true;
  }

  return false;
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

  // Bot was just promoted to admin somewhere (e.g. a content channel) — publish the intro
  // post with the CTA buttons right away and let the admin know the chat id for reference.
  if (update.my_chat_member) {
    const { chat, new_chat_member } = update.my_chat_member;
    if (new_chat_member.status === "administrator" && chat.type !== "private") {
      await sendMessage(chat.id, CHANNEL_INTRO_POST, channelCtaButtons());
      if (ADMIN_CHAT_ID) {
        await sendMessage(
          Number(ADMIN_CHAT_ID),
          `✅ Бота добавили админом в «${chat.title ?? chat.id}» (id ${chat.id}) — пост с кнопками опубликован.`
        );
      }
    }
    return NextResponse.json({ ok: true });
  }

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
  const document = update.message?.document;
  const isPdfDocument = document && (document.mime_type ?? "").includes("pdf");

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

  // A screenshot or a PDF receipt (Kaspi lets you save either) — both count as a receipt.
  const receiptFileId = photo && photo.length > 0 ? photo[photo.length - 1].file_id : isPdfDocument ? document!.file_id : null;

  if (receiptFileId) {
    const pending = await getPendingOrder(chatId);
    if (!pending) {
      await sendMessage(chatId, "Не вижу активного заказа. Сначала выберите, что хотите приобрести:", mainMenu());
      return NextResponse.json({ ok: true });
    }
    const product = getProduct(pending.productId);
    const name = [chat?.first_name, chat?.last_name].filter(Boolean).join(" ") || "без имени";
    const handle = chat?.username ? `@${chat.username}` : "без username";

    const summary = await fulfillOrder(chatId, pending.productId);

    if (ADMIN_CHAT_ID) {
      const caption = `🧾 Чек получен\n\n${name} (${handle}), id ${chatId}\nТовар: ${product?.label ?? pending.productId}\nСумма: ${pending.price.toLocaleString("ru-RU")}₸\n\n${summary}`;
      if (photo && photo.length > 0) {
        await sendPhoto(Number(ADMIN_CHAT_ID), receiptFileId, caption);
      } else {
        await sendDocument(Number(ADMIN_CHAT_ID), receiptFileId, caption);
      }
    }
    return NextResponse.json({ ok: true });
  }

  if (text?.startsWith("/start")) {
    // Deep-link payload: t.me/<bot>?start=<productId>, e.g. ?start=ask, ?start=code-money —
    // used both by channel post buttons and by the app's own "get access" buttons.
    const payload = text.slice("/start".length).trim();
    const product = payload === "ask" ? getProduct("qa5") : getProduct(payload);
    if (product) {
      await setPendingOrder(chatId, product.id, product.price);
      await sendMessage(chatId, paymentInstructions(product.label, product.price));
    } else {
      await sendMessage(chatId, WELCOME, mainMenu());
    }
    return NextResponse.json({ ok: true });
  }

  if (text === "/menu" || text?.toLowerCase() === "меню") {
    await sendMessage(chatId, WELCOME, mainMenu());
    return NextResponse.json({ ok: true });
  }

  if (text) {
    // Paid question credits take priority over general chat — those messages go to Anastasia.
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

    if (AI_ENABLED) {
      const handled = await handleAiChat(chatId, text);
      if (handled) return NextResponse.json({ ok: true });
      // AI call failed (network/quota/etc.) — fall through to the rule-based reply below.
    }

    if (GREETING_RE.test(text) || PRICE_RE.test(text)) {
      await sendMessage(chatId, WELCOME, mainMenu());
      return NextResponse.json({ ok: true });
    }

    if (MATRIX_RE.test(text)) {
      await sendMessage(chatId, MATRIX_INFO, sectionsMenu());
      return NextResponse.json({ ok: true });
    }

    if (FORECAST_RE.test(text)) {
      await sendMessage(chatId, FORECAST_INFO, [[{ text: "📅 Оформить прогноз — 15000₸", callback_data: "buy:forecast" }]]);
      return NextResponse.json({ ok: true });
    }

    if (CONSULT_RE.test(text)) {
      await sendMessage(chatId, CONSULT_INFO, [[{ text: "💎 Записаться — 50000₸", callback_data: "buy:consult" }]]);
      return NextResponse.json({ ok: true });
    }

    if (QA_RE.test(text)) {
      await sendMessage(chatId, QA_INFO, [[{ text: "🗨 Задать вопросы — 3000₸", callback_data: "buy:qa5" }]]);
      return NextResponse.json({ ok: true });
    }

    await sendMessage(
      chatId,
      "Расскажите чуть подробнее, что вас интересует, или выберите готовый вариант ниже 👇",
      mainMenu()
    );
  }

  return NextResponse.json({ ok: true });
}
