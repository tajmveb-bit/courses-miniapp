import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/telegramAuth";
import { notifyAdmin, formatUserLine } from "@/lib/notifyAdmin";

interface RequestBody {
  topic?: string;
  message?: string;
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body: RequestBody = await req.json().catch(() => ({}));
  const message = (body.message ?? "").trim();
  if (!message) {
    return NextResponse.json({ error: "empty_message" }, { status: 400 });
  }

  const text =
    `❓ <b>Вопрос специалисту</b>\n\n` +
    `${formatUserLine(auth.user)}\n` +
    `Тема: ${body.topic ?? "другое"}\n\n` +
    `${message}`;

  await notifyAdmin(text);

  return NextResponse.json({ ok: true });
}
