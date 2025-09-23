import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-app",
  display: "swap",
});

export const metadata = {
  title: "T-Fiber Sales Trainer",
  description: "ChatGPT-style trainer with voice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-[#0b0b0b] text-gray-100">{children}</body>
    </html>
  );
}
