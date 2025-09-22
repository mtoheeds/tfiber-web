"use client";

import { useState } from "react";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<string[]>([]);

  async function send() {
    const q = input.trim();
    if (!q) return;
    setLines(l => [...l, `user: ${q}`]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const data = await res.json();
      if (data?.text) setLines(l => [...l, `assistant: ${data.text}`]);
      else setLines(l => [...l, `assistant: Error`]);
    } catch (e) {
      setLines(l => [...l, `assistant: Error`]);
    }
  }

  return (
    <div className="space-y-2">
      <div className="min-h-[240px] rounded border p-3 font-mono whitespace-pre-wrap">
        {lines.join("\n")}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Ask: How do I beat Spectrum Ultra?"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
        />
        <button className="px-4 py-2 rounded bg-black text-white" onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
}
