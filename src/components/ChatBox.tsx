// src/components/ChatBox.tsx
"use client";
import { useState } from "react";
import { useSales, PlaybookCard } from "@/hooks/useSales";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatBox() {
  const { data } = useSales(); // loads pitch + cards once
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);

  async function send() {
    if (!input.trim()) return;

    // Naive card selection: grab a few high-signal cards
    const chosen: PlaybookCard[] =
      data?.playbook
        .filter((c) =>
          /price|lock|trial|shared|upload|speed|copper|fiber|military|router/i.test(
            c.title + " " + c.body
          )
        )
        .slice(0, 3) ?? [];

    const system = [
      "You are a fiber-sales coach. Use pitch + selected cards when helpful.",
      data ? `PITCH:\n${data.pitch}` : "",
      chosen.length
        ? `CARDS:\n${chosen.map((c) => `- ${c.title}: ${c.body}`).join("\n")}`
        : "",
      "Be concise. Give talk tracks + discovery questions.",
    ]
      .filter(Boolean)
      .join("\n\n");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: system },
          ...messages,
          { role: "user", content: input },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      setMessages((m) => [
        ...m,
        { role: "user", content: input },
        { role: "assistant", content: `Error: ${text}` },
      ]);
      setInput("");
      return;
    }

    const { reply } = await res.json(); // your /api/chat should return { reply }
    setMessages((m) => [
      ...m,
      { role: "user", content: input },
      { role: "assistant", content: reply },
    ]);
    setInput("");
  }

  return (
    <div className="p-4 space-y-3">
      <div className="border rounded p-3 h-64 overflow-auto text-sm">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "assistant" ? "text-purple-700" : ""}>
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask: How do I beat Spectrum Ultra?"
        />
        <button onClick={send} className="bg-black text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
