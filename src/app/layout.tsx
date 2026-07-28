import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      </body>
    </html>
  );
}
