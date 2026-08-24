import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/telegramAuth";
import { notifyAdmin, formatUserLine } from "@/lib/notifyAdmin";

interface RequestBody {
  topic?: string;
  details?: string;
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body: RequestBody = await req.json().catch(() => ({}));
  const details = (body.details ?? "").trim();
  if (!details) {
    return NextResponse.json({ error: "empty_details" }, { status: 400 });
  }

  const text =
    `🧴 <b>Разбор косметики</b>\n\n` +
    `${formatUserLine(auth.user)}\n` +
    `Тема: ${body.topic || "не указана"}\n\n` +
    `${details}`;

  await notifyAdmin(text);

  return NextResponse.json({ ok: true });
}
