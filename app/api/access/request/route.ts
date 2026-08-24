import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/telegramAuth";
import { notifyAdmin, formatUserLine } from "@/lib/notifyAdmin";
import { getTariffById } from "@/data/club";

interface RequestBody {
  tariffId?: string;
  contact?: string;
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body: RequestBody = await req.json().catch(() => ({}));
  const tariff = body.tariffId ? getTariffById(body.tariffId) : undefined;
  const contact = (body.contact ?? "").trim();

  const text =
    `🆕 <b>Заявка на тариф</b>\n\n` +
    `${formatUserLine(auth.user)}\n` +
    `Тариф: ${tariff?.title ?? "не указан"}\n` +
    `Контакт: ${contact || "не указан"}`;

  await notifyAdmin(text);

  return NextResponse.json({ ok: true });
}
