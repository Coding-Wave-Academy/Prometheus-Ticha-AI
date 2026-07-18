import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Ticha AI",
  description: "Improving 1% every day.",
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
        {children}
        
        {/* Floating Sitemap Shortcut - Dev Mode Only */}
        {process.env.NODE_ENV !== "production" && (
          <div className="fixed bottom-4 right-4 z-50">
            <Link
              href="/sitemap"
              className="bg-[#B6FF00] border-[2.5px] border-black rounded-full px-3.5 py-2 font-bold text-xs uppercase tracking-widest shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#a3e600] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1.5 transition-all text-black"
            >
              <span>🗺️</span> Sitemap
            </Link>
          </div>
        )}
      </body>
    </html>
  );
}
