"use client";

import { useEffect, useRef, useState } from "react";
import { useVoice } from "./useVoice";

type Msg = { role: "user" | "assistant"; content: string };

function ActionRow() {
  return (
    <div className="flex gap-4 text-gray-400 text-[15px] pt-2">
      <button title="Copy">📋</button>
      <button title="Regenerate">🔁</button>
      <button title="Thumbs up">👍</button>
      <button title="Thumbs down">👎</button>
      <button title="Share">🔗</button>
    </div>
  );
}

function Bubble({ m }: { m: Msg }) {
  const isUser = m.role === "user";
  return (
    <div className={`px-4 ${isUser ? "text-right" : "text-left"}`}>
      {isUser ? (
        <div className="inline-block max-w-[85%] bg-[#1f1f1f] text-gray-100 px-4 py-3 rounded-3xl rounded-tr-sm">
          {m.content}
        </div>
      ) : (
        <div className="max-w-[95%]">
          <p className="leading-relaxed">{m.content}</p>
          <ActionRow />
        </div>
      )}
    </div>
  );
}

export default function ChatMobile() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "I’m doing well, thanks for asking! How are you doing?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, loading]);

  // Voice
  const {
    supported,
    listening,
    speaking,
    transcript,
    setTranscript,
    startOnce,
    stopListen,
    speak,
    stopSpeak,
  } = useVoice();
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [handsFree, setHandsFree] = useState(true);

  function openVoice() {
    setVoiceOpen(true);
    stopSpeak();
    setTranscript("");
    startOnce();
  }
  function closeVoice() {
    setVoiceOpen(false);
    stopListen();
    stopSpeak();
    setTranscript("");
  }

  async function send(message: string) {
    const q = message.trim();
    if (!q || loading) return;

    setLoading(true);
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const data = await res.json();
      const text = data?.text || "Sorry, I couldn’t generate a response.";
      setMessages((m) => [...m, { role: "assistant", content: text }]);

      if (voiceOpen && supported) {
        speak(text, () => {
          if (handsFree) startOnce();
        });
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Error contacting the server." }]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!voiceOpen) return;
    if (!listening && !speaking && transcript) {
      const t = transcript;
      setTranscript("");
      send(t);
    }
  }, [voiceOpen, listening, speaking, transcript]); // eslint-disable-line

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <button title="Menu" className="text-gray-300">≡</button>
          <span className="font-semibold">ChatGPT 5</span>
        </div>
        <button title="New" className="text-gray-300">✎</button>
      </header>

      {/* Messages */}
      <main className="overflow-y-auto space-y-6 pb-2">
        {messages.map((m, i) => (
          <Bubble key={i} m={m} />
        ))}
        {loading && <div className="px-4 text-gray-400">…</div>}
        <div ref={endRef} />
      </main>

      {/* Composer */}
      <div className="px-3 pb-4">
        <div className="flex items-center gap-2">
          <button
            className="h-10 w-10 rounded-full bg-[#1a1a1a] text-gray-200 grid place-items-center text-xl"
            title="More"
          >
            +
          </button>

          <input
            className="flex-1 h-12 rounded-full bg-[#1a1a1a] text-gray-100 placeholder-gray-500 px-4 focus:outline-none"
            placeholder="Ask anything"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
          />

          <button
            onClick={() => (supported ? openVoice() : alert("Voice not supported in this browser"))}
            className={`h-10 w-10 rounded-full grid place-items-center text-xl ${
              listening ? "bg-rose-600 text-white" : "bg-[#1a1a1a] text-gray-200"
            }`}
            title="Voice"
          >
            🎙️
          </button>
        </div>
      </div>

      {/* Voice bubble */}
      {voiceOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md pointer-events-auto">
            <div className="rounded-3xl bg-[#111111] border border-white/10 p-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-300">
                  {listening ? "Listening…" : speaking ? "Speaking…" : "Ready"}
                </div>
                <button onClick={closeVoice} className="text-gray-300 hover:text-white text-sm" title="Close">✕</button>
              </div>

              <div className="py-4 flex items-center gap-3">
                <div className="relative h-10 w-10">
                  <span className={`absolute inset-0 rounded-full ${listening ? "animate-ping bg-emerald-500/40" : "bg-transparent"}`} />
                  <div className="relative h-10 w-10 rounded-full grid place-items-center bg-[#1f1f1f]">🎤</div>
                </div>
                <div className="flex-1 text-gray-200 text-sm min-h-[2.25rem]">
                  {transcript || (speaking ? "Playing assistant reply…" : "Say something…")}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-gray-400">
                  <input type="checkbox" checked={handsFree} onChange={() => setHandsFree((v) => !v)} />
                  Hands-free
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => { stopSpeak(); startOnce(); }}
                    className="px-3 py-1.5 rounded-full bg-[#1a1a1a] text-gray-200 text-sm"
                  >
                    Listen
                  </button>
                  <button
                    onClick={() => { stopListen(); stopSpeak(); }}
                    className="px-3 py-1.5 rounded-full bg-rose-600 text-white text-sm"
                  >
                    Stop
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
