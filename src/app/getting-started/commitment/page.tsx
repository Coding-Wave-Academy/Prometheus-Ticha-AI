"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fireConfettiBurst } from "@/lib/confetti";
import { hapticTap, hapticPress, hapticSuccess } from "@/lib/haptics";

const HOLD_DURATION_MS = 1800; // Apple-like deliberate hold duration (1.8s)

export default function CommitmentPage() {
  const router = useRouter();

  // Hold interaction state
  const [progress, setProgress] = useState(0); // 0 to 1
  const [isHolding, setIsHolding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Animation frame and timing refs
  const holdStartTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastHapticProgressRef = useRef(0);

  // Step 5 progress calculation (for top bar: 4 steps full + fraction of 5th step)
  const topBarStep5Width = Math.min(100, Math.max(0, progress * 100));

  // Reset or cancel hold
  const handleHoldEnd = useCallback(() => {
    if (isCompleted) return;
    setIsHolding(false);
    holdStartTimeRef.current = null;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    // Smooth spring decay back to 0
    const startProgress = progress;
    const decayStartTime = performance.now();
    const decayDuration = 280;

    const decayLoop = (now: number) => {
      const elapsed = now - decayStartTime;
      const t = Math.min(1, elapsed / decayDuration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const newProgress = Math.max(0, startProgress * (1 - eased));
      setProgress(newProgress);

      if (t < 1 && newProgress > 0) {
        animFrameRef.current = requestAnimationFrame(decayLoop);
      } else {
        setProgress(0);
        lastHapticProgressRef.current = 0;
      }
    };

    animFrameRef.current = requestAnimationFrame(decayLoop);
  }, [isCompleted, progress]);

  // Start holding
  const handleHoldStart = useCallback(() => {
    if (isCompleted) return;
    // Guard against duplicate start events (e.g. pointerdown followed by mousedown)
    if (holdStartTimeRef.current !== null) return;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    setIsHolding(true);
    hapticPress();
    holdStartTimeRef.current = performance.now();
    lastHapticProgressRef.current = 0;

    const holdLoop = (now: number) => {
      if (!holdStartTimeRef.current) return;
      const elapsed = now - holdStartTimeRef.current;
      const rawProgress = Math.min(1, elapsed / HOLD_DURATION_MS);
      setProgress(rawProgress);

      // Trigger subtle haptic ticks at 25%, 50%, 75%
      const currentQuarter = Math.floor(rawProgress * 4);
      if (currentQuarter > lastHapticProgressRef.current && rawProgress < 1) {
        lastHapticProgressRef.current = currentQuarter;
        hapticTap();
      }

      if (rawProgress >= 1) {
        // Commitment fulfilled!
        setIsCompleted(true);
        setIsHolding(false);
        hapticSuccess();
        fireConfettiBurst({ particleCount: 160, origin: { y: 0.7 } });

        // Save commitment timestamp locally
        if (typeof window !== "undefined") {
          localStorage.setItem("ticha_commitment_agreed_at", new Date().toISOString());
        }

        // Delay slightly for user to experience completion flash, then transition
        setTimeout(() => {
          router.push("/register");
        }, 850);
      } else {
        animFrameRef.current = requestAnimationFrame(holdLoop);
      }
    };

    animFrameRef.current = requestAnimationFrame(holdLoop);
  }, [isCompleted, router]);

  // Clean up animation frames on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // SVG Circular progress math (Radius = 66)
  const radius = 66;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="min-h-screen bg-[#FFF8F1] flex flex-col justify-between text-[#0A0A0F] relative overflow-hidden font-sans selection:bg-[#C8FF2A] select-none">
      {/* Decorative Polka Dots (Top Right) */}
      <div className="absolute top-0 right-0 w-36 h-36 pointer-events-none opacity-80 z-0">
        <Image
          src="/images/onboarding-icons/Orange Top Pokka Dots.svg"
          alt=""
          width={140}
          height={140}
          className="w-full h-full object-contain object-top-right"
        />
      </div>

      {/* Decorative Sparkle Star (Top Right) */}
      <div className="absolute top-16 right-9 pointer-events-none z-0">
        <Image
          src="/images/onboarding-icons/Orange Star.svg"
          alt=""
          width={28}
          height={28}
          className="animate-pulse"
        />
      </div>

      {/* Main Container */}
      <main className="w-full max-w-md mx-auto px-5 pt-6 pb-6 flex-1 flex flex-col justify-between relative z-10">
        <div>
          {/* Top Bar with 5-segment Progress Bar matching design */}
          <div className="flex items-center gap-3 mb-4">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              aria-label="Back"
              className="w-10 h-10 rounded-full bg-white border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer shrink-0"
            >
              <svg
                className="w-5 h-5 stroke-[2.5px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>

            {/* 5 Progress Segments: 4 Completed + 1 Active Filling */}
            <div className="flex-1 flex items-center gap-1.5">
              {/* Segments 1 to 4: Lime Green */}
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className="flex-1 h-2 rounded-full border-[1.5px] border-black bg-[#C8FF2A]"
                />
              ))}

              {/* Segment 5: Outlined + dynamic fill as user holds */}
              <div className="flex-1 h-2 rounded-full border-[1.5px] border-black bg-transparent overflow-hidden relative">
                <div
                  className="h-full bg-[#C8FF2A] transition-all duration-75"
                  style={{ width: `${topBarStep5Width}%` }}
                />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="mt-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A0A0F] leading-[1.15] tracking-tight font-heading">
              Make a{" "}
              <span className="relative inline-block text-[#FF5B7E]">
                Commitment
                {/* Hand-drawn organic pink underline matching design */}
                <span className="absolute -bottom-2 left-0 w-full pointer-events-none">
                  <svg
                    viewBox="0 0 160 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto text-[#FF5B7E]"
                  >
                    <path
                      d="M2 7C32 2.5 65 10 95 6.5C125 3 142 8 158 5.5"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>
            </h1>
            <p className="text-sm text-stone-600 font-medium mt-3.5 leading-snug">
              Take a moment to commit to your learning journey with Ticha AI.
            </p>
          </div>

          {/* "My Commitment" Card matching design image */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-6 p-5 md:p-6 rounded-3xl bg-[#FFF0F3] border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative"
          >
            <h2 className="text-xl md:text-2xl font-extrabold text-[#0A0A0F] font-heading tracking-tight">
              My Commitment
            </h2>
            <p className="text-xs md:text-sm text-stone-600 font-medium mt-1 mb-4">
              By placing my finger below, I commit to:
            </p>

            {/* Bullet List */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B7E] shrink-0 mt-1.5" />
                <span className="text-sm md:text-base font-bold text-[#0A0A0F] leading-snug">
                  Learn a little every day.
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B7E] shrink-0 mt-1.5" />
                <span className="text-sm md:text-base font-bold text-[#0A0A0F] leading-snug">
                  Stay consistent, even when it&apos;s hard.
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B7E] shrink-0 mt-1.5" />
                <span className="text-sm md:text-base font-bold text-[#0A0A0F] leading-snug">
                  Do my best and believe in my potential.
                </span>
              </div>
            </div>

            {/* Subtle Divider Line */}
            <div className="border-t border-[#FFD0D8] my-4" />

            {/* Motivational Quote */}
            <p className="italic text-xs md:text-sm text-stone-500 font-medium text-center">
              &ldquo;I am choosing a better future, one small step at a time.&rdquo;
            </p>
          </motion.div>
        </div>

        {/* Fingerprint Hold Section */}
        <div className="mt-8 mb-4 flex flex-col items-center justify-center relative">
          {/* 4 Viewfinder Framing Corner Brackets */}
          <div className="relative p-7 flex items-center justify-center">
            {/* Top-Left Bracket */}
            <span className="absolute top-1 left-1 w-6 h-6 border-t-[2.5px] border-l-[2.5px] border-stone-400 rounded-tl-lg pointer-events-none" />
            {/* Top-Right Bracket */}
            <span className="absolute top-1 right-1 w-6 h-6 border-t-[2.5px] border-r-[2.5px] border-stone-400 rounded-tr-lg pointer-events-none" />
            {/* Bottom-Left Bracket */}
            <span className="absolute bottom-1 left-1 w-6 h-6 border-b-[2.5px] border-l-[2.5px] border-stone-400 rounded-bl-lg pointer-events-none" />
            {/* Bottom-Right Bracket */}
            <span className="absolute bottom-1 right-1 w-6 h-6 border-b-[2.5px] border-r-[2.5px] border-stone-400 rounded-br-lg pointer-events-none" />

            {/* Interactive Hold Circle Container */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Hold fingerprint to commit"
              onPointerDown={(e) => {
                try {
                  e.currentTarget.setPointerCapture(e.pointerId);
                } catch {}
                handleHoldStart();
              }}
              onPointerUp={(e) => {
                try {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                } catch {}
                handleHoldEnd();
              }}
              onPointerLeave={handleHoldEnd}
              onPointerCancel={handleHoldEnd}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  if (!isHolding && !isCompleted) handleHoldStart();
                }
              }}
              onKeyUp={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  handleHoldEnd();
                }
              }}
              onContextMenu={(e) => e.preventDefault()}
              className="relative w-36 h-36 md:w-40 md:h-40 rounded-full flex items-center justify-center cursor-pointer select-none touch-none transition-transform"
              style={{
                WebkitUserSelect: "none",
                WebkitTouchCallout: "none",
                touchAction: "none",
              }}
            >
              {/* Outer Soft Pink Halo Ring */}
              <div
                className={`absolute inset-0 rounded-full bg-[#FFE4E8]/60 transition-transform duration-300 ${
                  isHolding ? "scale-105" : "scale-100"
                }`}
              />

              {/* Circular SVG Progress Ring */}
              <svg
                className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                viewBox="0 0 160 160"
              >
                {/* Background Track */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="#FFCCD5"
                  strokeWidth="5"
                  className="opacity-40"
                />
                {/* Progress Filling Stroke */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="#FF5B7E"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className={isHolding ? "transition-none" : "transition-[stroke-dashoffset] duration-200 ease-out"}
                />
              </svg>

              {/* Inner White Button with Concentric Ridges */}
              <motion.div
                animate={{
                  scale: isCompleted ? 1.08 : isHolding ? 0.95 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white border border-stone-100 shadow-[0_4px_16px_rgba(255,91,126,0.12)] flex items-center justify-center relative overflow-hidden z-10"
              >
                {/* Radial Expanding Color Fill on Hold */}
                <div
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FFE4E8] to-[#FFF0F3] pointer-events-none transition-opacity"
                  style={{
                    opacity: progress,
                    transform: `scale(${0.4 + progress * 0.7})`,
                  }}
                />

                {/* Authentic Biometric Fingerprint Icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className={`w-14 h-14 md:w-16 md:h-16 text-[#FF5B7E] relative z-10 transition-transform duration-200 ${
                    isHolding ? "scale-105 filter drop-shadow(0 0 8px rgba(255,91,126,0.45))" : ""
                  }`}
                >
                  <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 5.93 1.51.24.13.33.43.2.68-.08.18-.24.28-.42.28zm-3.05 16.59c-.19 0-.37-.09-.48-.27-.2-.33-.09-.76.24-.96 2.76-1.68 4.48-4.63 4.48-7.83 0-4.42-3.58-8-8-8s-8 3.58-8 8c0 2.21.9 4.3 2.47 5.82.26.25.26.67 0 .93-.25.26-.67.26-.93 0C2.55 16.89 1.5 14.53 1.5 12c0-5.24 4.26-9.5 9.5-9.5s9.5 4.26 9.5 9.5c0 3.8-2.04 7.3-5.32 9.29-.13.08-.27.12-.42.12zm-4.75-2.07c-.15 0-.31-.05-.44-.15-2.31-1.84-3.69-4.64-3.69-7.61 0-3.31 2.69-6 6-6s6 2.69 6 6c0 1.2-.36 2.37-1.04 3.38-.21.32-.64.41-.96.2-.32-.21-.41-.64-.2-.96.53-.78.8-1.69.8-2.62 0-2.48-2.02-4.5-4.5-4.5s-4.5 2.02-4.5 4.5c0 2.39 1.11 4.63 2.97 6.11.29.23.34.66.11.95-.15.19-.38.29-.6.29zm0 4.01c-.13 0-.26-.03-.38-.1-.4-.22-.55-.72-.33-1.12 1.34-2.45 2.05-5.21 2.05-8.01 0-.41.34-.75.75-.75s.75.34.75.75c0 3.09-.79 6.14-2.27 8.85-.14.26-.39.38-.67.38zm-1.85-6.03c-.23 0-.45-.11-.58-.31-.58-.87-.89-1.88-.89-2.93 0-1.65 1.35-3 3-3s3 1.35 3 3c0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5c0 .7.21 1.38.6 1.96.23.34.14.8-.2 1.03-.11.08-.24.12-.37.12z" />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Subtext indicator */}
          <p className="mt-3 text-xs md:text-sm font-bold tracking-wide uppercase transition-colors text-stone-500">
            {isCompleted
              ? "Commitment Sealed! ✨"
              : isHolding
              ? "Keep holding to seal..."
              : "Touch and hold to commit"}
          </p>
        </div>
      </main>

      {/* Apple-like Full-Screen Bottom-to-Top Brand Color Expansion Overlay */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 0.65,
              ease: [0.32, 0.72, 0, 1], // Apple-style smooth cubic bezier
            }}
            className="fixed inset-0 z-50 bg-[#C8FF2A] border-t-[4px] border-black flex flex-col items-center justify-center p-6 text-[#0A0A0F]"
          >
            {/* Morphing Completion Animation */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.35, type: "spring" }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-3xl font-black">
                ✓
              </div>
              <h2 className="text-3xl font-black font-heading tracking-tight">
                Commitment Sealed!
              </h2>
              <p className="text-sm font-bold text-stone-800 max-w-xs leading-snug">
                Building your personalized GCE study path...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
