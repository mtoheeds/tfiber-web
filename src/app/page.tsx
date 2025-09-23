"use client";
import dynamic from "next/dynamic";

const ChatMobile = dynamic(() => import("@/components/ChatMobile"), { ssr: false });

export default function Page() {
  return <ChatMobile />;
}
