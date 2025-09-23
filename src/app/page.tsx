"use client";

import dynamic from "next/dynamic";

const ChatBox = dynamic(() => import("@/components/ChatBox"), { ssr: false });
const VoiceAgent = dynamic(() => import("@/components/VoiceAgent"), { ssr: false });

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">T-Fiber Sales Trainer</h1>
        <p className="text-sm text-gray-600">
          Type in chat, or hold the mic to talk—answers are grounded in your pitch and tactical cards.
        </p>
      </header>

      {/* Chat */}
      <section className="rounded-xl border p-4 bg-white">
        <h2 className="font-semibold mb-2">💬 Chat</h2>
        <ChatBox />
      </section>

      {/* Voice */}
      <section>
        <VoiceAgent />
      </section>

      <footer className="text-xs text-gray-500">
        Tips: Ask “Do a 30-second door-pitch for a Spectrum Ultra customer”, or say it using the mic.
      </footer>
    </main>
  );
}
