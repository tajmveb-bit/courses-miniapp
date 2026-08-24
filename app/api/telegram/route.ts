import { NextRequest, NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/notifyAdmin";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
const APP_URL = process.env.APP_URL ?? "https://courses-miniapp.vercel.app";

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    text?: string;
  };
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
  const chatId = update.message?.chat.id;
  const text = update.message?.text?.trim();

  if (chatId && text === "/id") {
    await sendTelegramMessage(chatId, `ID этого чата: ${chatId}`);
    return NextResponse.json({ ok: true });
  }

  if (chatId) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "Добро пожаловать в клуб «Красота без рабства» 👋\n\nЗдесь — спокойная система ухода за кожей и волосами для женщин 35+.",
        reply_markup: {
          inline_keyboard: [[{ text: "Открыть клуб", web_app: { url: APP_URL } }]],
        },
      }),
    });
  }

  return NextResponse.json({ ok: true });
}
