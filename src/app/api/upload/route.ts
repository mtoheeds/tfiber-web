import { NextRequest, NextResponse } from "next/server";
import { pg } from "@/lib/db";
import { embed } from "@/lib/embeddings";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const data = await req.json(); // {tag, region?, title, body}
  const db = await pg();
  const e = await embed(data.body);
  const { rows } = await db.query(
    `insert into kb(tag, region, title, body, embedding)
     values ($1,$2,$3,$4,$5) returning id`,
    [data.tag, data.region ?? "US", data.title, data.body, e]
  );
  await db.end();
  return NextResponse.json({ ok: true, id: rows[0].id });
}
