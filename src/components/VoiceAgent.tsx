"use client";

import { useEffect, useRef, useState } from "react";

type AgentState = "idle" | "recording" | "thinking" | "speaking";

export default function VoiceAgent({
  onTranscript,
  onAssistantText,
}: {
  onTranscript?: (text: string) => void;
  onAssistantText?: (text: string) => void;
}) {
  const [state, setState] = useState<AgentState>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  async function start() {
    if (state !== "idle") return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    chunksRef.current = [];
    mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
    mr.onstop = async () => {
      setState("thinking");
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const form = new FormData();
      form.append("audio", blob, "voice.webm");
      const stt = await fetch("/api/stt", { method: "POST", body: form });
      const sttData = await stt.json();
      const userText = (sttData?.text || "").trim();
      if (userText) onTranscript?.(userText);

      const chat = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const chatData = await chat.json();
      const answer = (chatData?.text || "").trim();
      if (answer) onAssistantText?.(answer);

      const tts = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: answer, voice: "alloy", format: "mp3" }),
      });
      const buf = await tts.arrayBuffer();
      const url = URL.createObjectURL(new Blob([buf], { type: "audio/mp3" }));

      if (audioRef.current) {
        setState("speaking");
        audioRef.current.src = url;
        audioRef.current.onended = () => setState("idle");
        audioRef.current.play();
      } else {
        setState("idle");
      }
    };

    mediaRecorderRef.current = mr;
    mr.start();
    setState("recording");
  }

  function stop() {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }

  const isIdle = state === "idle";
  const isRec = state === "recording";
  const isThinking = state === "thinking";
  const isSpeaking = state === "speaking";

  return (
    <div className="flex items-center gap-3">
      <button
        onMouseDown={start}
        onMouseUp={stop}
        onTouchStart={start}
        onTouchEnd={stop}
        className={`h-12 w-12 rounded-full grid place-items-center transition-colors
          ${isRec ? "bg-red-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-800"}
        `}
        title={isRec ? "Release to stop" : "Hold to talk"}
      >
        {isRec ? "●" : "🎤"}
      </button>
      <div className="text-sm text-zinc-400">
        {isIdle && "Hold to talk"}
        {isRec && "Listening… release to send"}
        {isThinking && "Thinking…"}
        {isSpeaking && "Speaking…"}
      </div>
    </div>
  );
}
