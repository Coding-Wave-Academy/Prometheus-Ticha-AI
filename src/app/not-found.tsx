"use client";

import React from "react";
import Link from "next/link";

/**
 * Custom 404 Not Found Page.
 * Styled in Ticha AI neobrutalist design system with a clean visual fallback
 * to return back to the application hub safely.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center p-6 antialiased font-sans">
      {/* Container Card */}
      <main className="w-full max-w-md bg-white border-[4px] border-black rounded-2xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center space-y-6 animate-page-in">
        
        {/* Massive 404 Graphic badge */}
        <div className="w-24 h-24 bg-[#FFB040] border-[4px] border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto relative overflow-hidden">
          <span className="text-4xl select-none font-black text-black">
            🛸
          </span>
        </div>

        {/* Warning Badge */}
        <div className="inline-flex bg-[#FF9494] border-[2.5px] border-black rounded-xl px-4 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black text-xs uppercase tracking-widest text-black">
          ⚠️ Lost in the Wave
        </div>

        {/* Messaging */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tight text-black leading-none">
            Page Not Found
          </h1>
          <p className="text-sm font-bold text-stone-600 max-w-xs mx-auto leading-relaxed">
            The page you are looking for does not exist or hasn&apos;t been developed yet. Don&apos;t worry, Ticha AI is on the case!
          </p>
        </div>

        {/* Separation line */}
        <div className="h-[3px] bg-black w-full my-2"></div>

        {/* Action Button */}
        <Link
          href="/dashboard"
          className="w-full bg-[#B6FF00] hover:bg-[#a3e600] border-[3.5px] border-black rounded-xl py-4 font-black uppercase text-base tracking-wider shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all block text-center text-black"
        >
          🏠 Go Back Home
        </Link>
      </main>
    </div>
  );
}
