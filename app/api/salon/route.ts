import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/telegramAuth";
import { notifyAdmin, formatUserLine } from "@/lib/notifyAdmin";

interface RequestBody {
  name?: string;
  city?: string;
  contact?: string;
  topic?: string;
  format?: string;
  time?: string;
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body: RequestBody = await req.json().catch(() => ({}));
  if (!body.contact?.trim()) {
    return NextResponse.json({ error: "missing_contact" }, { status: 400 });
  }

  const text =
    `💼 <b>Заявка на запись в салон</b>\n\n` +
    `${formatUserLine(auth.user)}\n` +
    `Имя: ${body.name || "—"}\n` +
    `Город: ${body.city || "—"}\n` +
    `Контакт: ${body.contact}\n` +
    `Задача: ${body.topic || "—"}\n` +
    `Формат: ${body.format || "—"}\n` +
    `Удобное время: ${body.time || "—"}`;

  await notifyAdmin(text);

  return NextResponse.json({ ok: true });
}
