import { NextResponse } from "next/server";
import OpenAI from "openai";
import { pg } from "@/lib/db";

const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function GET() {
  try {
    const db = await pg();

    // Get all rows that don't have embeddings
    const { rows } = await db.query("select id, body from kb where embedding is null");

    let updated = 0;
    for (const row of rows) {
      const qe = await ai.embeddings.create({
        model: process.env.EMBED_MODEL || "text-embedding-3-large",
        input: row.body,
      });

      const emb = `[${qe.data[0].embedding.join(",")}]`;
      await db.query("update kb set embedding = $1 where id = $2", [emb, row.id]);
      updated++;
    }

    await db.end();
    return NextResponse.json({ ok: true, updated });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message });
  }
}
