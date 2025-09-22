import { NextResponse } from "next/server";
import { pitch, playbook } from "@/lib/salesContent";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const TAVILY_API_KEY = process.env.TAVILY_API_KEY ?? "";

type Msg = { role: "system"|"user"|"assistant"|"tool"; content: string; name?: string };

async function webSearch(q: string) {
  if (!TAVILY_API_KEY) return { disabled: true, query: q, results: [] };
  const r = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Tavily-Api-Key": TAVILY_API_KEY },
    body: JSON.stringify({
      query: q,
      search_depth: "basic",
      max_results: 5,
      include_domains: [
        "fiber.t-mobile.com",
        "t-mobile.com",
        "support.t-mobile.com",
        "newsroom.t-mobile.com"
      ],
    }),
  });
  return r.json();
}

const COACH_STYLE = `
You are T-Fiber’s door-to-door sales trainer and role-play coach.
Use the PITCH and CARDS below as primary knowledge.
Use web_search only when the user requests proof/current info.
Format every answer:
1) Opening (1–2 lines)
2) Talk Track (bullets, 20–90s)
3) Why it works (2–4 bullets, buyer psychology)
4) Objections (2–4 bullets)
5) Close ask (1 line)
6) Optional quick role-play (coach asks next question)
Be concise, practical, and never invent exact pricing. Prefer “typical” and advise to confirm in order tool.
`;

const SYSTEM = `
PITCH:
${pitch}

TACTICAL CARDS:
${playbook.map((c,i)=>`[${i+1}] ${c.title}\n${c.body}`).join("\n\n")}

${COACH_STYLE}
`;

async function openai(messages: Msg[]) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OPENAI_MODEL, // your gpt-4.1
      temperature: 0.4,
      messages,
      tools: [
        {
          type: "function",
          function: {
            name: "web_search",
            description: "Search web for current/official T-Mobile Fiber info.",
            parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] }
          }
        }
      ],
    }),
  });
  if (!r.ok) throw new Error(`OpenAI ${r.status}: ${await r.text()}`);
  return r.json();
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing 'message' string in body." }, { status: 400 });
    }
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY missing." }, { status: 500 });
    }

    const msgs: Msg[] = [
      { role: "system", content: SYSTEM },
      { role: "user", content: message },
    ];

    let res = await openai(msgs);
    let choice = res.choices?.[0];

    if (choice?.finish_reason === "tool_calls" && choice.message?.tool_calls?.length) {
      for (const call of choice.message.tool_calls) {
        if (call.function?.name === "web_search") {
          const args = JSON.parse(call.function.arguments ?? "{}");
          const web = await webSearch(args.query ?? message);
          msgs.push({ role: "tool", name: "web_search", content: JSON.stringify(web) });
        }
      }
      // ask model to finalize with tool results
      msgs.push({ role: "assistant", content: "" });
      res = await openai(msgs);
      choice = res.choices?.[0];
    }

    const text = choice?.message?.content?.trim() || "I couldn’t generate an answer.";
    return NextResponse.json({ ok: true, text });
  } catch (e: any) {
    console.error("CHAT_API_ERR:", e?.message || e);
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}
