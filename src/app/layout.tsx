import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import DeviceGate from "@/components/layout/DeviceGate";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ticha AI — Mobile Learning PWA",
  description: "Improving 1% every day with AI tutoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <DeviceGate>{children}</DeviceGate>
        
        {/* Floating Sitemap Shortcut */}
        <div className="fixed bottom-4 right-4 z-40">
          <Link
            href="/sitemap"
            className="bg-[#B6FF00] border-[2.5px] border-black rounded-full px-3.5 py-2 font-extrabold text-xs uppercase tracking-widest shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#a3e600] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1.5 transition-all text-black"
          >
            <svg
              className="w-3.5 h-3.5 fill-current text-black"
              viewBox="0 0 24 24"
            >
              <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
            </svg>
            <span>Sitemap</span>
          </Link>
        </div>
      </body>
    </html>
  );
}
