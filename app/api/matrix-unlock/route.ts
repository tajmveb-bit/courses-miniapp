import { NextRequest, NextResponse } from "next/server";
import { isSection, redeemCode } from "@/lib/unlockCodes";

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
