import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/salesProducts";
import { setPendingOrder } from "@/lib/pendingOrders";
import { sendSaiferMessage, paymentInstructionsText } from "@/lib/saiferBot";

// Called by the app (not Telegram) when someone taps "Получить доступ в Telegram" for a
// second/third item. A ?start= deep link only delivers its payload the first time a person ever
// opens the bot — for a returning buyer it just switches to the existing chat with nothing sent.
// This sends the payment instructions directly via the Bot API instead, which works for anyone
// who has already messaged the bot once (true for anyone buying a second item).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const tgUserId = Number(body?.tgUserId);
  const productId = typeof body?.productId === "string" ? body.productId : "";

  if (!tgUserId || !productId) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const product = getProduct(productId);
  if (!product) {
    return NextResponse.json({ ok: false, error: "unknown_product" }, { status: 400 });
  }

  try {
    await setPendingOrder(tgUserId, product.id, product.price);
    const sent = await sendSaiferMessage(tgUserId, paymentInstructionsText(product.label, product.price));
    return NextResponse.json({ ok: sent });
  } catch {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
