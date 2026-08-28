import type { Metadata } from "next";
import { Baloo_2, Plus_Jakarta_Sans } from "next/font/google";
import DeviceGate from "@/components/layout/DeviceGate";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const baloo2 = Baloo_2({
  variable: "--font-baloo-2",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ticha AI - 1% Better Everyday",
  description: "Improving 1% every day with AI tutoring.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
      { url: "/images/ticha-logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/images/ticha-logo.png", sizes: "180x180", type: "image/png" },
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
      className={`${baloo2.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative selection:bg-[#C8FF2A] font-sans">
        <DeviceGate>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </DeviceGate>
        <Analytics />
      </body>
    </html>
  );
}

