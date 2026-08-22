import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import DeviceGate from "@/components/layout/DeviceGate";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
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
      <body className="min-h-full flex flex-col relative selection:bg-[#B6FF00]">
        <DeviceGate>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </DeviceGate>
        <Analytics/>
      </body>
    </html>
  );
}
