import { NextRequest, NextResponse } from "next/server";

const VALID_CODE = process.env.MATRIX_UNLOCK_CODE;

export async function POST(req: NextRequest) {
  if (!VALID_CODE) {
    return NextResponse.json({ valid: false, error: "not_configured" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.trim().toUpperCase() : "";

  const valid = code.length > 0 && code === VALID_CODE.trim().toUpperCase();
  return NextResponse.json({ valid });
}
