"use client";

import dynamic from "next/dynamic";

const ChatPane = dynamic(() => import("@/components/ChatPane"), { ssr: false });

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">T-Fiber Sales Trainer</h1>
        <p className="text-sm text-gray-600">
          ChatGPT-style coaching with hands-free voice role-play.
        </p>
      </header>

      <ChatPane />

      <footer className="text-xs text-gray-500 text-center">
        Tip: Try “Handle: My internet is fine” or enable voice to role-play continuously.
      </footer>
    </main>
  );
}
