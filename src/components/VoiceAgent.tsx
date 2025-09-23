// src/components/VoiceAgent.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type AgentState = "idle" | "recording" | "thinking" | "speaking" | "error";

export default function VoiceAgent({
  onTranscript,
  onAssistantText,
}: {
  onTranscript?: (text: string) => void;
  onAssistantText?: (text: string) => void;
}) {
  const [state, setState] = useState<AgentState>("idle");
  const [hint, setHint] = useState<string>("Hold mic to talk");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  async function startRecording() {
    try {
      if (state !== "idle") return;
      setHint("Listening… release to send");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = handleStop;
      mediaRecorderRef.current = mr;
      mr.start();
      setState("recording");
    } catch (err: any) {
      setState("error");
      setHint(err?.message || "Mic permission denied");
    }
  }

  async function handleStop() {
    try {
      if (!chunksRef.current.length) { setState("idle"); setHint("Hold mic to talk"); return; }
      setState("thinking"); setHint("Transcribing…");

      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const form = new FormData();
      form.append("audio", blob, "voice.webm");

      const sttRes = await fetch("/api/stt", { method: "POST", body: form });
      const stt = await sttRes.json();
      const userText = (stt?.text || "").trim();
      if (!userText) { setState("idle"); setHint("No speech detected — hold to try again"); return; }
      onTranscript?.(userText);

      setHint("Thinking…");
      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const chat = await chatRes.json();
      const answer = (chat?.text || "").trim();
      onAssistantText?.(answer);

      setHint("Speaking…");
      const ttsRes = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: answer, voice: "alloy", format: "mp3" }),
      });
      if (!ttsRes.ok) { setState("idle"); setHint("TTS failed — check API key / model"); return; }

      const buf = await ttsRes.arrayBuffer();
      const url = URL.createObjectURL(new Blob([buf], { type: "audio/mp3" }));

      if (audioRef.current) {
        setState("speaking");
        audioRef.current.src = url;
        audioRef.current.onended = () => { setState("idle"); setHint("Hold mic to talk"); };
        await audioRef.current.play();
      } else {
        setState("idle"); setHint("Hold mic to talk");
      }
    } catch (err: any) {
      setState("error");
      setHint(err?.message || "Voice flow error");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
  }

  const isRec = state === "recording";
  const label =
    state === "recording" ? "Listening… release to send" :
    state === "thinking"  ? "Thinking…" :
    state === "speaking"  ? "Speaking…" :
    state === "error"     ? `Error: ${hint}` :
                            hint;

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="text-sm text-neutral-400">{label}</div>
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        className={`h-11 w-11 rounded-full grid place-items-center transition
          ${isRec ? "bg-red-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-800"}`}
        title={isRec ? "Release to send" : "Hold to talk"}
      >
        {isRec ? "●" : "🎤"}
      </button>
    </div>
  );
}
