// src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { salesContent } from "@/lib/salesContent";

export const runtime = "edge";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildSystemPrompt() {
  const { pitch, playbook } = salesContent;
  const cards = playbook
    .map((c, i) => `Card ${i + 1} — ${c.title}: ${c.body}`)
    .join("\n\n");

  return `You are the T-Fiber Sales Coach. Be concise and tactical.

--- PITCH ---
${pitch}

--- TACTICAL CARDS ---
${cards}

Rules:
- Keep answers short and action-oriented.
- Use bullet points for steps or objections.
- Don’t invent pricing; use positioning.
- Use shared vs dedicated, upload parity, and peak-hour consistency to beat cable.`;
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json().catch(() => ({}));
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing 'message' string in body." }, { status: 400 });
    }
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not set." }, { status: 500 });
    }

    const system = buildSystemPrompt();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: message },
      ],
      temperature: 0.3,
    });

    const text =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn’t generate a response.";

    return NextResponse.json({ text });
  } catch (err: any) {
    console.error("CHAT_ROUTE_ERROR:", err?.message || err);
    return NextResponse.json({ error: err?.message || "Unknown server error" }, { status: 500 });
  }
}
