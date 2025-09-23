"use client";

import { useEffect, useRef, useState } from "react";

type SR =
  | (typeof window extends any ? (window & { webkitSpeechRecognition?: any })["SpeechRecognition"] : any)
  | any;

/**
 * Simple push-to-talk voice agent:
 * - Uses Web Speech API for mic input (Chrome/Edge: webkitSpeechRecognition)
 * - Sends transcript to /api/chat
 * - Speaks the assistant reply with speechSynthesis
 */
export default function VoiceAgent() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [busy, setBusy] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastReply, setLastReply] = useState("");
  const recogRef = useRef<any>(null);

  useEffect(() => {
    const SR: any =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const r = new SR();
      r.lang = "en-US";
      r.interimResults = true;
      r.continuous = false;

      r.onresult = (e: SpeechRecognitionEvent) => {
        let t = "";
        for (const res of e.results as any) {
          t += res[0].transcript;
        }
        setTranscript(t.trim());
      };

      r.onend = () => setListening(false);
      r.onerror = () => setListening(false);

      recogRef.current = r;
      setSupported(true);
    } else {
      setSupported(false);
    }
  }, []);

  async function ask(q: string) {
    if (!q) return;
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const data = await res.json();
      const text = data?.text || "Sorry, I couldn’t generate a response.";
      setLastReply(text);

      // Speak it
      if ("speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1;
        u.pitch = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      }
    } catch (e) {
      setLastReply("Error contacting the server.");
    } finally {
      setBusy(false);
    }
  }

  function start() {
    setTranscript("");
    if (recogRef.current && !listening) {
      setListening(true);
      recogRef.current.start();
    }
  }

  function stop() {
    if (recogRef.current && listening) {
      recogRef.current.stop();
    }
  }

  return (
    <div className="rounded-xl border p-4 space-y-3 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">🎙️ Voice Trainer</h3>
        {!supported && (
          <span className="text-xs text-red-600">
            Your browser doesn’t support speech recognition (use Chrome/Edge).
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onMouseDown={start}
          onMouseUp={stop}
          onTouchStart={start}
          onTouchEnd={stop}
          disabled={!supported || busy}
          className={`px-4 py-2 rounded text-white ${listening ? "bg-red-600" : "bg-black"} disabled:opacity-50`}
          title="Hold to talk"
        >
          {listening ? "Listening… release to stop" : "Hold to talk"}
        </button>

        <button
          onClick={() => ask(transcript)}
          disabled={!transcript || busy}
          className="px-4 py-2 rounded border"
        >
          Ask transcript
        </button>

        <button
          onClick={() => window.speechSynthesis?.cancel()}
          className="px-4 py-2 rounded border"
        >
          Stop speaking
        </button>
      </div>

      <div className="text-sm">
        <div className="text-gray-500">Transcript</div>
        <div className="rounded border p-2 min-h-[44px]">{transcript || "—"}</div>
      </div>

      <div className="text-sm">
        <div className="text-gray-500">Assistant</div>
        <div className="rounded border p-2 min-h-[44px] whitespace-pre-wrap">
          {busy ? "Thinking…" : lastReply || "—"}
        </div>
      </div>
    </div>
  );
}
