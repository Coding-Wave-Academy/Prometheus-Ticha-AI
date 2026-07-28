"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { hapticTap } from "@/lib/haptics";

export interface DeviceGateProps {
  children: React.ReactNode;
}

export default function DeviceGate({ children }: DeviceGateProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [simulateMobile, setSimulateMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkViewport = () => {
      // 640px is standard mobile breakpoint limit
      const isWide = window.innerWidth >= 640;
      setIsDesktop(isWide);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  if (!isMounted) {
    return <>{children}</>;
  }

  // If on wide screen and not simulating mobile frame, render Device Gate Overlay
  if (isDesktop && !simulateMobile) {
    return (
      <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center p-6 antialiased font-sans text-black select-none">
        <div className="max-w-md w-full bg-white border-[3.5px] border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center space-y-6 relative overflow-hidden animate-spring-slide-up">
          
          {/* Mobile Illustration Frame Badge */}
          <div className="w-20 h-20 bg-[#B6FF00] border-[3.5px] border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto rotate-[-3deg]">
            <svg
              className="w-10 h-10 text-black fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
            </svg>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span className="inline-block bg-[#FFB040] border-[2.5px] border-black rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Mobile Only PWA
            </span>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight text-[#1A1A1A]">
              Designed for Mobile Phones
            </h1>
            <p className="text-sm font-medium text-stone-600 leading-relaxed">
              Ticha AI is engineered specifically for smartphone viewports to deliver the best daily micro-learning experience.
            </p>
          </div>

          {/* Device Tip Box */}
          <div className="bg-[#FAF7EC] border-[2.5px] border-black rounded-xl p-4 text-left space-y-2">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#965A18]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span className="font-extrabold text-xs uppercase tracking-wider">How to Access:</span>
            </div>
            <ul className="text-xs font-bold text-stone-700 space-y-1 list-disc list-inside pl-1">
              <li>Open this page on your mobile phone browser.</li>
              <li>Or resize your browser window below 640px width.</li>
            </ul>
          </div>

          {/* Developer / Testing Override Button */}
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => {
                hapticTap();
                setSimulateMobile(true);
              }}
            >
              Simulate Mobile Frame 📱
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If simulating mobile frame on desktop, wrap content inside a phone container frame
  if (isDesktop && simulateMobile) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4 antialiased font-sans">
        {/* Top Control Bar */}
        <div className="w-full max-w-[410px] mb-3 flex items-center justify-between text-white">
          <span className="text-xs font-black uppercase tracking-wider text-[#B6FF00]">
            📱 Mobile Simulation Mode
          </span>
          <button
            onClick={() => {
              hapticTap();
              setSimulateMobile(false);
            }}
            className="text-xs font-bold bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded-lg px-3 py-1 text-white transition-colors"
          >
            Exit Frame ✕
          </button>
        </div>

        {/* Smartphone Shell Frame */}
        <div className="w-full max-w-[390px] h-[844px] bg-[#FAF7EC] border-[6px] border-black rounded-[40px] shadow-[0px_20px_50px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col">
          {/* Dynamic Island / Speaker notch */}
          <div className="w-28 h-4 bg-black rounded-b-xl mx-auto z-50 shrink-0 mb-1"></div>

          {/* Scrollable Mobile Viewport Content */}
          <div className="flex-1 overflow-y-auto w-full relative">
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Mobile device standard render
  return <>{children}</>;
}
