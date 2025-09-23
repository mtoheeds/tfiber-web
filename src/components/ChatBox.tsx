"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; text: string };

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [pending, setPending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // keep the view scrolled to the last message
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, pending]);

  async function send() {
    const q = input.trim();
    if (!q || pending) return;

    // add user message optimistically
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });

      // Try to parse JSON; handle non-2xx and non-JSON gracefully
      let assistantText = "";
      try {
        const data = await res.json();
        assistantText =
          (data?.text as string) ||
          (data?.answer as string) ||
          (data?.message as string) ||
          (data?.error as string) ||
          "";
      } catch {
        // If the server didn't return JSON, fall back to generic message
        assistantText = "";
      }

      if (!res.ok) {
        const reason = assistantText || `HTTP ${res.status}`;
        setMsgs((m) => [
          ...m,
          {
            role: "assistant",
            text: `Sorry—something went wrong processing that. (${reason})`,
          },
        ]);
      } else if (assistantText) {
        setMsgs((m) => [...m, { role: "assistant", text: assistantText }]);
      } else {
        setMsgs((m) => [
          ...m,
          {
            role: "assistant",
            text:
              "I couldn't generate a response. Please try rephrasing your question (e.g., “How do I position fiber vs Spectrum Ultra during peak hours?”).",
          },
        ]);
      }
    } catch (err: any) {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          text: `Network error. Please check your connection and try again.${
            err?.message ? ` (${err.message})` : ""
          }`,
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Enter sends; Shift+Enter makes a newline (for multiline <textarea>, but we’re using <input>)
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="space-y-3">
      <div
        ref={listRef}
        className="min-h-[260px] max-h-[420px] overflow-y-auto rounded border p-3 bg-white"
      >
        {msgs.length === 0 && (
          <div className="text-gray-500">
            Try: <em>“How do I sell the T-Fiber Founders Club?”</em> or{" "}
            <em>“Give me the opener for Spectrum users.”</em>
          </div>
        )}

        <div className="space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className="leading-relaxed">
              <span
                className={
                  m.role === "user" ? "font-semibold text-sky-700" : "font-semibold text-fuchsia-700"
                }
              >
                {m.role}:
              </span>{" "}
              <span className="whitespace-pre-wrap break-words">{m.text}</span>
            </div>
          ))}

          {pending && (
            <div>
              <span className="font-semibold text-fuchsia-700">assistant:</span>{" "}
              <span className="text-gray-500">Typing…</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Ask: How do I beat Spectrum Ultra?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={pending}
        />
        <button
          className={`px-4 py-2 rounded text-white ${
            pending ? "bg-gray-400 cursor-not-allowed" : "bg-black"
          }`}
          onClick={send}
          disabled={pending}
        >
          {pending ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}
