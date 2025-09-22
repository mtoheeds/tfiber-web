// src/app/page.tsx
"use client";
import ChatBox from "@/components/ChatBox";

export default function Home() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">T-Fiber Sales Trainer</h1>
      <ChatBox />
    </main>
  );
}
