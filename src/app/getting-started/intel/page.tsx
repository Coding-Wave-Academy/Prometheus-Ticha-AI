"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "@/lib/i18n";

export default function ExamIntelPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/getting-started/struggles");
  };

  const handleContinue = () => {
    // Go to register step next to save progress and finish onboarding
    router.push("/register");
  };

  return (
    <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center p-4 antialiased font-sans selection:bg-[#B6FF00]">
      {/* PWA Mobile-First Wrapper Container */}
      <main className="w-full max-w-md min-h-[85vh] flex flex-col justify-between py-6 px-6 text-black items-center space-y-6">
        
        {/* Top Header: Back Button + Completed Progress Bar */}
        <header className="flex items-center gap-4 w-full">
          {/* Back Circular Button */}
          <button
            onClick={handleBack}
            className="w-11 h-11 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all shrink-0"
            aria-label="Go back"
          >
            <svg className="w-6 h-6 stroke-[3.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>

          {/* Progress Tracker (All 5 steps complete / active) */}
          <div className="flex gap-1.5 w-full items-center">
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1"></div>
          </div>
        </header>

        {/* Heading Section */}
        <div className="text-left w-full space-y-2 px-1">
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">
            Your Personalized Exam Intel
          </h1>
          <p className="text-[14px] text-stone-600 font-bold leading-tight">
            Based on your goals and challenges, here&apos;s what the data says.
          </p>
        </div>

        {/* Dynamic Cards Stack */}
        <div className="space-y-6 w-full">
          
          {/* Card 1: THE BIG IDEA (Pink Card) */}
          <section className="bg-[#FFD9E0] border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col gap-4">
            <div className="flex items-center gap-1.5 font-black text-sm uppercase text-black">
              <span>⭐</span> The Big Idea
            </div>

            {/* Content Box */}
            <div className="bg-white border-[2.5px] border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-left">
              <p className="text-sm font-bold text-[#1A1A1A] leading-snug">
                Particles can pass through barriers that <span className="underline decoration-2 decoration-red-500 underline-offset-2">should</span> be impossible to cross.
              </p>
              <p className="text-sm font-bold text-[#1A1A1A] mt-2.5 leading-snug">
                Not magic. Just quantum physics. ✨
              </p>
            </div>

            {/* Diagram Area with Blown-up Bubble */}
            <div className="bg-white border-[2.5px] border-black rounded-xl p-4 relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {/* Tooltip speech bubble */}
              <div className="absolute top-2 right-2 bg-black text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-[1.5px_1.5px_0px_0px_#B6FF00]">
                Mind = blown!
              </div>

              {/* Quantum Tunneling custom SVG diagram */}
              <div className="w-full h-32 flex items-center justify-center bg-stone-50 rounded-lg border border-stone-200 mt-2">
                <svg className="w-full h-full p-2" viewBox="0 0 200 80">
                  {/* Grid Lines */}
                  <line x1="10" y1="60" x2="190" y2="60" stroke="#bbb" strokeWidth="1" />
                  <line x1="90" y1="20" x2="90" y2="70" stroke="#bbb" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="110" y1="20" x2="110" y2="70" stroke="#bbb" strokeWidth="1" strokeDasharray="2,2" />
                  
                  {/* Barrier Box */}
                  <rect x="90" y="20" width="20" height="40" fill="#D3E2FF" stroke="black" strokeWidth="1.5" />
                  
                  {/* Wave Packets (Sine Waves fading out) */}
                  {/* Left incident wave */}
                  <path d="M 15 60 Q 25 40 35 60 T 55 60 T 75 60 T 90 60" fill="none" stroke="blue" strokeWidth="1.5" />
                  {/* Reflected wave */}
                  <path d="M 50 60 Q 60 70 70 60 T 90 60" fill="none" stroke="red" strokeWidth="1" strokeDasharray="2,1" />
                  {/* Tunneling / Transmitted wave (smaller amplitude) */}
                  <path d="M 110 60 Q 120 50 130 60 T 150 60 T 170 60" fill="none" stroke="blue" strokeWidth="1.2" />

                  {/* Labels */}
                  <text x="50" y="15" fontSize="6" fontWeight="bold" textAnchor="middle">1. Incident</text>
                  <text x="100" y="15" fontSize="6" fontWeight="bold" textAnchor="middle">2. Tunneling</text>
                  <text x="145" y="15" fontSize="6" fontWeight="bold" textAnchor="middle">3. Transmission</text>
                  <text x="100" y="45" fontSize="5" fontWeight="black" textAnchor="middle">Barrier</text>
                </svg>
              </div>
            </div>
          </section>

          {/* Card 2: THE STORY (Blue Card) */}
          <section className="bg-[#D3E2FF] border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
            <div className="flex items-center gap-1.5 font-black text-sm uppercase text-black">
              <span>▶</span> The Story
            </div>

            <div className="bg-white border-[2.5px] border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-left">
              <p className="text-sm font-bold text-[#1A1A1A] leading-snug">
                Imagine a tiny ball rolling toward a hill. It doesn&apos;t have enough energy to climb over it.
              </p>
              <p className="text-sm font-black text-stone-700 mt-2">
                Classically, it stops.
              </p>
            </div>

            {/* Hill Roll diagram */}
            <div className="bg-white border-[2.5px] border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center h-32 bg-stone-50 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 200 80">
                {/* Ground */}
                <line x1="10" y1="70" x2="190" y2="70" stroke="black" strokeWidth="2" />
                {/* Hill profile */}
                <path d="M 10 70 Q 70 70 100 30 T 150 70 L 190 70" fill="none" stroke="black" strokeWidth="2" />
                {/* Ball on left */}
                <circle cx="35" cy="65" r="5" fill="red" stroke="black" strokeWidth="1.5" />
                <path d="M 45 65 L 60 65" stroke="black" strokeWidth="1" markerEnd="url(#arrow)" />
                {/* Stop flag/X mark on hill */}
                <path d="M 97 37 L 103 43 M 103 37 L 97 43" stroke="red" strokeWidth="2" />
                
                {/* Labels */}
                <text x="35" y="55" fontSize="6" fontWeight="bold" textAnchor="middle">Initial Velocity</text>
                <text x="100" y="22" fontSize="6" fontWeight="black" textAnchor="middle">Peak Height</text>
                <text x="100" y="50" fontSize="5" fontWeight="bold" textAnchor="middle" fill="red">Classic Stop</text>
              </svg>
            </div>
          </section>

          {/* Card 3: THE REALITY (Purple Card) */}
          <section className="bg-[#E5E5FF] border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
            <div className="flex items-center gap-1.5 font-black text-sm uppercase text-black">
              <span>⚡</span> The Reality (Quantum)
            </div>

            {/* Quantum Tunneling Illustration */}
            <div className="bg-white border-[2.5px] border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] h-32 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 200 80">
                {/* Wave interference glow */}
                <defs>
                  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#B6FF00" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#B6FF00" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="100" cy="40" r="30" fill="url(#glow)" />
                {/* Thin vertical barrier bar */}
                <rect x="95" y="10" width="10" height="60" fill="#FFB040" stroke="black" strokeWidth="1.5" />
                {/* Sine waves transitioning through */}
                <path d="M 20 40 Q 40 10 60 40 T 95 40" fill="none" stroke="#B6FF00" strokeWidth="2.5" />
                <path d="M 105 40 Q 120 30 135 40 T 180 40" fill="none" stroke="#B6FF00" strokeWidth="1.5" opacity="0.6" />
                <text x="100" y="55" fontSize="5" fontWeight="black" fill="white" textAnchor="middle">Barrier</text>
              </svg>
            </div>

            <div className="bg-white border-[2.5px] border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-left">
              <p className="text-sm font-bold text-[#1A1A1A] leading-snug">
                In quantum physics, the ball has a small chance of popping through the hill instead of stopping.
              </p>
              <p className="text-sm font-black text-stone-900 mt-2">
                It tunnels through.
              </p>
            </div>
          </section>

          {/* Card 4: WHY IT MATTERS (Teal Card) */}
          <section className="bg-[#9EEAD8] border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
            <div className="flex items-center gap-1.5 font-black text-sm uppercase text-black">
              <span>✅</span> Why It Matters
            </div>

            {/* List */}
            <div className="bg-white border-[2.5px] border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-left space-y-3">
              <div className="flex items-start gap-2 text-sm font-bold text-[#1A1A1A]">
                <span>✓</span>
                <span>Powers electronics (like your phone)</span>
              </div>
              <div className="flex items-start gap-2 text-sm font-bold text-[#1A1A1A]">
                <span>✓</span>
                <span>Helps stars shine and cells function</span>
              </div>
              <div className="flex items-start gap-2 text-sm font-bold text-[#1A1A1A]">
                <span>✓</span>
                <span>The basis of quantum computers</span>
              </div>
            </div>

            {/* Aha Moment Box */}
            <div className="bg-[#FFE5C4] border-[2.5px] border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-left">
              <span className="text-[10px] font-black uppercase text-[#965A18] tracking-widest block mb-1">
                💡 Aha Moment
              </span>
              <p className="text-sm font-black text-[#1A1A1A] leading-snug">
                So, particles aren&apos;t just following the rules—they&apos;re <span className="underline decoration-wavy decoration-[#965A18] underline-offset-4">rewriting</span> them.
              </p>
            </div>
          </section>

          {/* Card 5: PRO TIP */}
          <section className="bg-white border-[3px] border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3 text-left">
            <span className="text-xl shrink-0" role="img" aria-label="warning alert">⚠️</span>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-red-600 tracking-wider block">
                Pro Tip 📌
              </span>
              <p className="text-xs font-bold text-stone-700 leading-snug">
                90% of students miss this mark on the wavefunction. Don&apos;t be that student!
              </p>
            </div>
          </section>

        </div>

        {/* Continue Action Button */}
        <footer className="w-full mt-8">
          <button
            onClick={handleContinue}
            className="w-full bg-[#B6FF00] hover:bg-[#a3e600] border-[3.5px] border-black rounded-xl py-4 px-4 font-black text-lg uppercase tracking-wider transition-all shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2"
          >
            <span>Continue to Dashboard</span>
            <svg className="w-5 h-5 stroke-[3.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </footer>

      </main>
    </div>
  );
}
