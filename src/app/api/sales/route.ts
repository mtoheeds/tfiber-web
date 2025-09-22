// src/app/api/sales/route.ts
import { NextResponse } from "next/server";
import { pitch, playbook } from "@/lib/salesContent";

export async function GET() {
  return NextResponse.json({
    ok: true,
    count: playbook.length + (pitch ? 1 : 0),
    pitch,
    playbook,
  });
}
