// src/app/api/stt/route.ts
import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const MODEL = process.env.WHISPER_MODEL ?? "whisper-1";

export const runtime = "nodejs"; // ensure Node runtime for FormData stream

export async function POST(req: Request) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY missing" }, { status: 500 });
    }

    const inForm = await req.formData();
    const file = inForm.get("audio") as File | null;
    if (!file) return NextResponse.json({ error: "Missing 'audio' file" }, { status: 400 });

    const form = new FormData();
    form.append("file", file, file.name || "audio.webm");
    form.append("model", MODEL);
    // Optional: form.append("temperature", "0");

    const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: form,
    });

    if (!r.ok) {
      return NextResponse.json({ error: await r.text() }, { status: 500 });
    }

    const data = await r.json();
    // OpenAI returns { text: "..." }
    return NextResponse.json({ text: data.text || "" });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "STT error" }, { status: 500 });
  }
}
