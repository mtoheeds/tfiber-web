import { NextResponse } from "next/server";
import OpenAI from "openai";

const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function GET() {
  try {
    const qe = await ai.embeddings.create({
      model: process.env.EMBED_MODEL || "text-embedding-3-large",
      input: "test",
    });
    return NextResponse.json({ ok: true, dims: qe.data[0].embedding.length });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message });
  }
}
