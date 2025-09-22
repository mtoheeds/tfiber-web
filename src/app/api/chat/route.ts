import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { searchKb } from "@/lib/rag";

const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  const chunks = await searchKb(question, 6);
  const context = chunks.map((c,i)=>`[${i+1}] ${c.title || c.tag} — ${c.body}`).join("\n\n");

  const sys = `You are a T-Fiber sales trainer. Use ONLY the CONTEXT facts.
Answer clearly, then cite like [1], [2]. If info is missing, say what to check.`;
  const user = `QUESTION:\n${question}\n\nCONTEXT:\n${context}`;

  const r = await ai.responses.create({
    model: process.env.OPENAI_MODEL!,
    input: [{role:"system",content:sys},{role:"user",content:user}]
  });

  return NextResponse.json({
    answer: r.output_text,
    citations: chunks.map((c,i)=>({ref:i+1, title:c.title || c.tag}))
  });
}
