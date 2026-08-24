import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/telegramAuth";
import { notifyAdmin, formatUserLine } from "@/lib/notifyAdmin";
import { medicalServices } from "@/data/club";

interface RequestBody {
  serviceId?: string;
  note?: string;
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body: RequestBody = await req.json().catch(() => ({}));
  const service = medicalServices.find((s) => s.id === body.serviceId);

  const text =
    `🩺 <b>Заявка в медицинскую поддержку</b>\n\n` +
    `${formatUserLine(auth.user)}\n` +
    `Услуга: ${service?.title ?? "не указана"}\n` +
    `Комментарий: ${body.note?.trim() || "—"}\n\n` +
    `Напоминание: это образовательный/навигационный запрос, ответ и трактовку результатов даёт врач или медицинский партнёр.`;

  await notifyAdmin(text);

  return NextResponse.json({ ok: true });
}
