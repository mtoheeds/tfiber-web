"use client";

import { useEffect, useRef, useState } from "react";

export function useVoice() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recog = useRef<any>(null);

  useEffect(() => {
    const SR: any =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return setSupported(false);
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = true;
    r.continuous = false;

    r.onresult = (e: any) => {
      let t = "";
      for (const res of e.results) t += res[0].transcript;
      setTranscript(t.trim());
    };
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);

    recog.current = r;
    setSupported(true);
  }, []);

  function startOnce() {
    if (recog.current && !listening) {
      setTranscript("");
      recog.current.start();
    }
  }
  function stopListen() {
    if (recog.current && listening) recog.current.stop();
  }

  function speak(text: string, onEnd?: () => void) {
    if (!("speechSynthesis" in window)) return onEnd?.();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1;
    u.onstart = () => setSpeaking(true);
    u.onend = () => {
      setSpeaking(false);
      onEnd?.();
    };
    window.speechSynthesis.speak(u);
  }
  function stopSpeak() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }

  return {
    supported,
    listening,
    speaking,
    transcript,
    setTranscript,
    startOnce,
    stopListen,
    speak,
    stopSpeak,
  };
}
