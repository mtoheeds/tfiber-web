// src/app/api/sales/route.ts
import { NextResponse } from "next/server";
import { pitch, playbook, salesContent } from "@/lib/salesContent";

export async function GET() {
  return NextResponse.json({
    ok: true,
    count: salesContent.length,
    pitch,
    playbook
  });
}
