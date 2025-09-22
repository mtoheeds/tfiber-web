import { NextResponse } from "next/server";
import { pg } from "@/lib/db";

export async function GET() {
  try {
    const db = await pg();
    const { rows } = await db.query("select count(*) from kb");
    await db.end();

    return NextResponse.json({ ok: true, kb_total: rows[0].count });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message });
  }
}
