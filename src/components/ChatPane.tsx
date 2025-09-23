"use client";

import { useEffect, useRef, useState } from "react";
import { useVoice } from "./useVoice";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Give me a 30-sec door pitch for Spectrum Ultra",
  "Handle: 'My internet is fine'",
  "Handle: 'I don’t want to switch'",
  "How do I pitch price lock vs promo pricing?",
];

function Bubble({ role, content }: Msg) {
  const isUser = role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-black text-white grid place-items-center text-xs">AI</div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 whitespace-pre-wrap ${
          isUser
            ? "bg-[#0ea5e9] text-white rounded-br-sm"
            : "bg-white border rounded-bl-sm"
        }`}
      >
        {content}
      </div>
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-sky-500 text-white grid place-items-center text-xs">U</div>
      )}
    </div>
  );
}

export default function ChatPane() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hey! Ask me for a pitch, an objection handle, or turn on Voice Mode to role-play hands-free." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  // voice
  const {
    supported,
    listening,
    speaking,
    transcript,
    setTranscript,
    startOnce,
    stop,
    speak,
    stopSpeaking,
  } = useVoice();

  // autoscroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, listening, speaking]);

  async function sendText(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    setInput("");
    setLoading(true);
    setMessages((m) => [...m, { role: "user", content: q }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const data = await res.json();
      const reply = data?.text || "Sorry, I couldn’t generate a response.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);

      // if voice mode is on, speak and then resume listening
      if (voiceMode) {
        speak(reply, () => {
          // after speaking, resume listening for next user turn
          startOnce();
        });
      }
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Error reaching the server." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Voice Mode loop: when we get a final transcript, send it
  useEffect(() => {
    if (!voiceMode) return;
    // If not speaking and we have a transcript (i.e., finished utterance), send it
    if (!listening && !speaking && transcript) {
      const t = transcript;
      setTranscript(""); // clear so we don't send twice
      sendText(t);
    }
  }, [voiceMode, listening, speaking, transcript]); // eslint-disable-line

  function toggleVoiceMode() {
    if (!supported) return;
    const next = !voiceMode;
    setVoiceMode(next);
    setTranscript("");
    stopSpeaking();
    stop();
    if (next) {
      // start the first listen
      startOnce();
    }
  }

  return (
    <div className="grid grid-rows-[1fr_auto] h-[calc(100vh-160px)] rounded-xl border bg-gray-50">
      {/* Messages */}
      <div className="overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role} content={m.content} />
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400" />
            Thinking…
          </div>
        )}

        {voiceMode && (
          <div className="text-xs text-gray-500">
            {listening ? "🎤 Listening…" : speaking ? "🗣️ Speaking…" : "…"}
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input area */}
      <div className="border-t bg-white p-3 space-y-2">
        {/* Suggestions */}
        <div className="flex gap-2 flex-wrap">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendText(s)}
              className="text-xs px-2 py-1 rounded-full border bg-white hover:bg-gray-50"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-end gap-2">
          {/* Text input */}
          <textarea
            className="flex-1 rounded-lg border px-3 py-2 max-h-40 min-h-[44px] focus:outline-none"
            placeholder="Type your message… (Enter to send, Shift+Enter for newline)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendText(input);
              }
            }}
          />

          {/* Mic (push to talk) */}
          <button
            className={`h-11 w-11 rounded-lg border grid place-items-center ${
              listening ? "bg-red-600 text-white border-red-600" : "bg-white"
            }`}
            title="Push to talk (hold)"
            onMouseDown={() => {
              if (supported && !voiceMode) {
                stopSpeaking();
                startOnce();
              }
            }}
            onMouseUp={() => {
              if (supported && !voiceMode) stop();
            }}
            onTouchStart={() => {
              if (supported && !voiceMode) {
                stopSpeaking();
                startOnce();
              }
            }}
            onTouchEnd={() => {
              if (supported && !voiceMode) stop();
            }}
          >
            🎙️
          </button>

          {/* Send */}
          <button
            onClick={() => sendText(input)}
            className="h-11 px-4 rounded-lg bg-black text-white disabled:opacity-60"
            disabled={loading}
          >
            Send
          </button>
        </div>

        {/* Voice mode toggle */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={voiceMode}
              onChange={toggleVoiceMode}
              disabled={!supported}
            />
            <span>
              Hands-free voice dialog {supported ? "" : "(not supported in this browser)"}
            </span>
          </label>
          {voiceMode && (
            <button
              onClick={() => {
                setVoiceMode(false);
                stop();
                stopSpeaking();
              }}
              className="px-2 py-1 border rounded"
            >
              Stop voice
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
