import ChatBox from "@/components/ChatBox";

// Prevent static prerender errors while you're wiring APIs
export const dynamic = "force-dynamic";
// (Optional) If you previously used edge runtime and don't need it:
export const runtime = "nodejs";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">T-Fiber Sales Trainer</h1>
      <ChatBox />
    </main>
  );
}
