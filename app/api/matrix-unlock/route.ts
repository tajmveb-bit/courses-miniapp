import { NextRequest, NextResponse } from "next/server";
import { isSection, redeemCode } from "@/lib/unlockCodes";
import { hasAccess } from "@/lib/telegramUnlocks";

// Checked on mount by the Mini App so a section the sales bot already granted (by Telegram
// user id) shows unlocked immediately, with no code to type.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tgUserId = searchParams.get("tgUserId");
  const section = searchParams.get("section") ?? "";

  if (!tgUserId || !isSection(section)) {
    return NextResponse.json({ unlocked: false }, { status: 400 });
  }

  try {
    const unlocked = await hasAccess(Number(tgUserId), section);
    return NextResponse.json({ unlocked });
  } catch {
    return NextResponse.json({ unlocked: false }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code : "";
  const section = typeof body?.section === "string" ? body.section : "";

  if (!code || !isSection(section)) {
    return NextResponse.json({ valid: false, error: "bad_request" }, { status: 400 });
  }

  try {
    const valid = await redeemCode(code, section);
    return NextResponse.json({ valid });
  } catch {
    return NextResponse.json({ valid: false, error: "not_configured" }, { status: 500 });
  }
}
