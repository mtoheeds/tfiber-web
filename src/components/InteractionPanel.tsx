// src/components/InteractionPanel.tsx
"use client";

import dynamic from "next/dynamic";
import ChatBox from "@/components/ChatBox";

// ✅ Dynamic import with ssr:false is OK here because this is a CLIENT component
const VoiceAgent = dynamic(() => import("@/components/VoiceAgent"), { ssr: false });

export default function InteractionPanel() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950 shadow-xl">
      <div className="flex items-center justify-between border-b border-neutral-900 px-4 py-3">
        <div className="text-sm font-medium">Assistant</div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="rounded-full bg-neutral-800 px-2 py-0.5">💬 Chat</span>
          <span className="rounded-full bg-neutral-800 px-2 py-0.5">🎙️ Voice</span>
        </div>
      </div>

      <div className="h-[540px]">
        <ChatBox />
      </div>

      <div className="border-t border-neutral-900">
        <VoiceAgent />
      </div>
    </div>
  );
}
