"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import "@/lib/i18n"; // Import i18n instance

export default function WelcomePage() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleGetStarted = () => {
    router.push("/getting-started/language");
  };

  return (
    <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center p-4 antialiased font-sans selection:bg-[#FFB040]">
      {/* PWA Mobile-First Wrapper Container */}
      <main className="w-full max-w-md min-h-[85vh] flex flex-col justify-between py-4 md:py-8 px-6 text-black items-center">
        
        {/* Top Illustration Area */}
        <div className="relative w-52 h-52 md:w-64 md:h-64 my-auto flex items-center justify-center select-none scale-90 md:scale-100">
          {/* Main Tilted Orange Box */}
          <div className="absolute w-40 h-40 md:w-48 md:h-48 bg-[#FFB040] border-[3.5px] border-black rounded-[2rem] rotate-[-4deg] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-visible">
            {/* White Character Face */}
            <div className="w-28 h-28 md:w-36 md:h-36 bg-white border-[3.5px] border-black rounded-full flex flex-col items-center justify-center p-2">
              {/* Eyes */}
              <div className="flex justify-between w-16 px-1 mb-3">
                <div className="w-4 h-4 bg-black rounded-full relative">
                  <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                </div>
                <div className="w-4 h-4 bg-black rounded-full relative">
                  <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                </div>
              </div>
              {/* Neutral Mouth Line */}
              <div className="w-8 h-[3.5px] bg-black rounded-full"></div>
            </div>
          </div>

          {/* "Bonsoir!" Tilted Green Badge (Top Right) */}
          <div className="absolute top-2 right-2 bg-[#426B1F] text-[#E5F9D3] border-[3.5px] border-black px-4 py-1.5 rounded-xl font-black text-sm uppercase tracking-wide rotate-[8deg] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            Bonsoir!
          </div>

          {/* "Welcome" Tilted Blue/Gray Badge (Bottom Left) */}
          <div className="absolute bottom-2 left-0 bg-[#A6B7CE] text-[#5C3A1A] border-[3.5px] border-black px-4 py-2 rounded-xl font-black text-lg tracking-wide rotate-[-12deg] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            Welcome
          </div>
        </div>

        {/* Text & Social Proof Area */}
        <div className="w-full text-center space-y-6 mb-8">
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-tight max-w-[280px] mx-auto text-[#1A1A1A]">
            {isMounted ? t("welcome.title") : "Ready to improve 1% every day?"}
          </h1>

          {/* Social Proof Avatar Stack */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex -space-x-3.5">
              {/* Avatar 1 - Pattern Placeholder */}
              <div className="w-10 h-10 rounded-full border-[2.5px] border-black bg-stone-200 bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:6px_6px]"></div>
              {/* Avatar 2 - Blue */}
              <div className="w-10 h-10 rounded-full border-[2.5px] border-black bg-[#A6B7CE]"></div>
              {/* Avatar 3 - Cream */}
              <div className="w-10 h-10 rounded-full border-[2.5px] border-black bg-[#FFE5C4]"></div>
              {/* Avatar Count Badge */}
              <div className="w-10 h-10 rounded-full border-[2.5px] border-black bg-[#E2E4D9] flex items-center justify-center font-bold text-[11px]">
                +10k
              </div>
            </div>
            
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-stone-500">
              Trusted by 10,000+ Cameroonian Students
            </p>
          </div>
        </div>

        {/* Action Button & Login Link */}
        <footer className="w-full space-y-5">
          <button
            onClick={handleGetStarted}
            className="w-full bg-[#FFB040] border-[3.5px] border-black rounded-xl py-4 px-4 font-black text-lg uppercase tracking-wide flex items-center justify-center gap-2 transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ffa326]"
          >
            <span>{isMounted ? t("welcome.getStarted") : "Get Started"}</span>
            <svg 
              className="w-5 h-5 stroke-[3.5px]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

          <p className="text-center text-stone-700 font-medium text-[15px]">
            {isMounted ? t("welcome.hasAccount") : "Already have an account?"}{" "}
            <Link
              href="/login"
              className="text-black font-bold underline decoration-2 underline-offset-2 hover:text-stone-800 transition-colors"
            >
              {isMounted ? t("welcome.login") : "Log in"}
            </Link>
          </p>
        </footer>

      </main>
    </div>
  );
}
