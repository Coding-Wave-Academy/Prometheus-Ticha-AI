import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Authentication | Ticha AI",
  description:
    "Sign in or create your Ticha AI account to save your GCE exam preparation progress, daily streaks, and personalized study roadmaps.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center p-4 antialiased font-sans selection:bg-[#B6FF00]">
      <div className="w-full max-w-md flex flex-col justify-center min-h-[85vh] py-3 md:py-8 text-black">
        {children}
      </div>
    </div>
  );
}
