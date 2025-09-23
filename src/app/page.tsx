"use client";
import dynamic from "next/dynamic";

// Client-only: uses Web Speech APIs
const ChatMobile = dynamic(() => import("@/components/ChatMobile"), { ssr: false });

export default function Page() {
  return <ChatMobile />;
}
