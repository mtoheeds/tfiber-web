"use client";
import { useState } from "react";

export default function Page(){
  const [q,setQ] = useState("");
  const [a,setA] = useState("");
  const [busy,setBusy] = useState(false);

  async function ask(){
    setBusy(true); setA("");
    const r = await fetch("/api/chat", {
      method:"POST",
      body: JSON.stringify({ question: q })
    });
    const j = await r.json();
    setA(j.answer);
    setBusy(false);
  }

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-2">T-Fiber Sales Trainer</h1>
      <textarea
        className="w-full border p-2 rounded"
        rows={3}
        placeholder="Ask about promos, pricing, or rebuttals..."
        value={q}
        onChange={e=>setQ(e.target.value)}
      />
      <button
        onClick={ask}
        disabled={busy || !q.trim()}
        className="mt-2 w-full p-3 bg-black text-white rounded"
      >
        {busy ? "Thinking..." : "Ask"}
      </button>
      {a && (
        <article className="mt-4 whitespace-pre-wrap border p-3 rounded">
          {a}
        </article>
      )}
    </main>
  );
}
