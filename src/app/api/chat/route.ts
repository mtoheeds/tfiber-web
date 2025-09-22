// src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import { pitch, playbook } from "@/lib/salesContent";

const SYSTEM_PROMPT = `You are T-Fiber’s sales trainer. Use ONLY this pitch and cards unless the user provides new facts.

PITCH:
${pitch}

TACTICAL CARDS:
${playbook.map((c, i) => `• [${i + 1}] ${c.title}: ${c.body}`).join("\n")}

Rules:
- Be concise and actionable.
- Prefer checklists, bullets, and talk tracks.
- If the user asks about founder’s club, price locks, or Spectrum matchups, pull from the relevant card content.
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Replace this mock with your real LLM call.
    // Example: call OpenAI / Responses API with SYSTEM_PROMPT + message.
    const text =
      `SYSTEM CONTEXT LOADED (${playbook.length + 1} notes). You asked: "${message}".` +
      `\n\nStarter guidance:\n- Use the door pitch opener.\n- If Spectrum is mentioned, play Card 2 + Card 9.`;

    return NextResponse.json({ ok: true, text });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
