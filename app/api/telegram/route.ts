import { NextRequest, NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/notifyAdmin";
import { generateCodeBatch } from "@/lib/unlockCodes";
import { recordUser, listUsers } from "@/lib/botUsers";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const APP_URL = process.env.APP_URL ?? "https://courses-miniapp.vercel.app";
// Telegram's in-app WebView caches a mini app by its exact URL, sometimes even across a full
// app restart. Appending the deploy's commit SHA busts that cache on every new release, since
// each deploy gets a different URL. VERCEL_GIT_COMMIT_SHA is set automatically by Vercel.
const APP_VERSION = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? "dev";
const VERSIONED_APP_URL = `${APP_URL}?v=${APP_VERSION}`;

interface TelegramUpdate {
  message?: {
    chat: { id: number; username?: string; first_name?: string; last_name?: string };
    text?: string;
  };
}

function isAdmin(chatId: number): boolean {
  return Boolean(ADMIN_CHAT_ID) && String(chatId) === ADMIN_CHAT_ID;
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
  const chat = update.message?.chat;
  const chatId = chat?.id;
  const text = update.message?.text?.trim();

  if (chat) {
    try {
      await recordUser(chat);
    } catch {
      // Redis not configured or unreachable — don't block replying to the user over this.
    }
  }

  if (chatId && text === "/id") {
    await sendTelegramMessage(chatId, `ID этого чата: ${chatId}`);
    return NextResponse.json({ ok: true });
  }

  if (chatId && text === "/newcode") {
    if (!isAdmin(chatId)) {
      return NextResponse.json({ ok: true });
    }
    try {
      const batch = await generateCodeBatch();
      const lines = batch.map((item) => `${item.label}: ${item.code}`).join("\n");
      await sendTelegramMessage(
        chatId,
        `🔑 Новый набор кодов для клиента:\n\n${lines}\n\nКаждый код одноразовый и открывает только свой раздел. Отправьте клиенту нужные коды в WhatsApp.`
      );
    } catch {
      await sendTelegramMessage(chatId, "Не удалось создать коды — проверьте настройку базы данных (Upstash).");
    }
    return NextResponse.json({ ok: true });
  }

  if (chatId && text === "/users") {
    if (!isAdmin(chatId)) {
      return NextResponse.json({ ok: true });
    }
    try {
      const users = await listUsers();
      if (users.length === 0) {
        await sendTelegramMessage(chatId, "Пока никто не писал боту.");
      } else {
        const lines = users.map((u) => {
          const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || "без имени";
          const handle = u.username ? `@${u.username}` : "без username";
          const lastSeen = new Date(u.lastSeen).toLocaleString("ru-RU", { timeZone: "Asia/Almaty" });
          return `${name} (${handle}) — id ${u.chatId}, был(а) ${lastSeen}`;
        });
        await sendTelegramMessage(chatId, `👥 Пользователи бота (${users.length}):\n\n${lines.join("\n")}`);
      }
    } catch {
      await sendTelegramMessage(chatId, "Не удалось получить список — проверьте настройку базы данных (Upstash).");
    }
    return NextResponse.json({ ok: true });
  }

  if (chatId) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "Добро пожаловать в клуб «Код Красоты» 👋\n\nЗдесь — ваша личная Матрица судьбы: предназначения, прогнозы, совместимость и разборы по нумерологии.",
        reply_markup: {
          inline_keyboard: [[{ text: "Открыть клуб", web_app: { url: VERSIONED_APP_URL } }]],
        },
      }),
    });
  }

  return NextResponse.json({ ok: true });
}
