import { NextResponse } from "next/server";
import { pg } from "@/lib/db";                 // your existing pg() helper
import { salesContent } from "@/lib/salesContent"; // we'll create this next

export async function GET() {
  return NextResponse.json({ ok: true, hint: "POST to seed content" });
}

export async function POST() {
  const db = await pg();
  try {
    const values = salesContent.map(s => [
      s.tag ?? "sales",
      null,                 // region (remove if your table doesn't have it)
      s.title,
      s.body,
    ]);

    await db.query(
      `
      INSERT INTO public.kb (tag, region, title, body)
      VALUES ${values.map((_, i) =>
        `($${i*4+1}, $${i*4+2}, $${i*4+3}, $${i*4+4})`
      ).join(",")}
      ON CONFLICT (title)
      DO UPDATE SET
        tag   = EXCLUDED.tag,
        region= EXCLUDED.region,
        body  = EXCLUDED.body
      `,
      values.flat()
    );

    return NextResponse.json({ ok: true, inserted: values.length });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 });
  } finally {
    await db.end();
  }
}
