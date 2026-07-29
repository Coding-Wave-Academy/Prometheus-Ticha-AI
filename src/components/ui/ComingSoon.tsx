"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export interface ComingSoonProps {
  title?: string;
  description?: string;
  showBackHome?: boolean;
}

export default function ComingSoon({
  title = "Screen Coming Soon",
  description = "Our engineering team is actively building this experience for Cameroonian students. Check back soon for updates!",
  showBackHome = true,
}: ComingSoonProps) {
  return (
    <div className="min-h-[80vh] flex flex-col justify-between items-center px-4 py-8 text-black antialiased font-sans max-w-md mx-auto w-full">
      {/* Hero Badge & Vector Illustration */}
      <div className="w-full text-center space-y-6 my-auto">
        <div className="relative w-28 h-28 bg-[#B6FF00] border-[3.5px] border-black rounded-3xl flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mx-auto rotate-[-3deg] animate-spring-pop">
          <svg className="w-14 h-14 text-black fill-current" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
          </svg>
          <span className="absolute -top-3 -right-3 bg-[#FFB040] border-[2.5px] border-black rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            In Dev
          </span>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#965A18]">
            Upcoming Module
          </span>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#1A1A1A]">
            {title}
          </h1>
          <p className="text-sm font-medium text-stone-600 max-w-xs mx-auto leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      {showBackHome && (
        <footer className="w-full pt-4">
          <Link href="/dashboard" className="block w-full">
            <Button variant="secondary" size="lg" className="w-full">
              ← Return to Dashboard
            </Button>
          </Link>
        </footer>
      )}
    </div>
  );
}
