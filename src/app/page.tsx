// src/app/page.tsx
import dynamic from "next/dynamic";

const ChatBox = dynamic(() => import("@/components/ChatBox"), { ssr: false });

export default function Home() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">T-Fiber Sales Trainer</h1>
      <ChatBox />
    </main>
  );
}
