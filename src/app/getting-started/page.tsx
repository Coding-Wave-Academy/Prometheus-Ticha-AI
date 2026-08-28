"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ui/Toast";

interface SlideData {
  id: number;
  badgeNumber: string;
  titlePrefix: string;
  highlightText: string;
  lineSvg: string;
  subtitle: string;
  accentColor: string;
  starIcon: string;
  dotsIcon: string;
  characterSvg: string;
  buttonBg: string;
  buttonText: string;
  linkColor: string;
  waveBg: string;
  characterWidthClass: string;
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    badgeNumber: "01",
    titlePrefix: "Learn a Little ",
    highlightText: "Every Day",
    lineSvg: "/images/onboarding-icons/Lime Line.svg",
    subtitle: "Bite-sized daily lessons that build knowledge, not pressure.",
    accentColor: "#84CC16",
    starIcon: "/images/onboarding-icons/Lime Star.svg",
    dotsIcon: "/images/onboarding-icons/Orange Top Pokka Dots.svg",
    characterSvg: "/images/onboarding-icons/Character 1.svg",
    buttonBg: "bg-[#C8FF2A] hover:bg-[#b8f01c]",
    buttonText: "text-[#0A0A0F]",
    linkColor: "#84CC16",
    waveBg: "bg-[#F2FAD4]",
    characterWidthClass: "max-w-[440px] md:max-w-[480px]",
  },
  {
    id: 2,
    badgeNumber: "02",
    titlePrefix: "Understand ",
    highlightText: "with AI Tutor",
    lineSvg: "/images/onboarding-icons/Orange line.svg",
    subtitle: "Get clear explanations, anytime you need help.",
    accentColor: "#FF882E",
    starIcon: "/images/onboarding-icons/Orange Star.svg",
    dotsIcon: "/images/onboarding-icons/Orange Top Pokka Dots.svg",
    characterSvg: "/images/onboarding-icons/Character 2.svg",
    buttonBg: "bg-[#FF882E] hover:bg-[#e07520]",
    buttonText: "text-white",
    linkColor: "#FF882E",
    waveBg: "bg-[#FFEED9]",
    characterWidthClass: "max-w-[400px] md:max-w-[440px]",
  },
  {
    id: 3,
    badgeNumber: "03",
    titlePrefix: "Practice to ",
    highlightText: "Master",
    lineSvg: "/images/onboarding-icons/Purple Line.svg",
    subtitle: "Quizzes, past questions and smart feedback to track growth.",
    accentColor: "#9333EA",
    starIcon: "/images/onboarding-icons/Purple Star.svg",
    dotsIcon: "/images/onboarding-icons/Purple Top Pokka Dots.svg",
    characterSvg: "/images/onboarding-icons/Character 3.svg",
    buttonBg: "bg-[#9333EA] hover:bg-[#7e22ce]",
    buttonText: "text-white",
    linkColor: "#9333EA",
    waveBg: "bg-[#F0E8FF]",
    characterWidthClass: "max-w-[400px] md:max-w-[440px]",
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    if (isPaused) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused]);

  const currentSlide = SLIDES[activeSlide];

  const handleGetStarted = () => {
    router.push("/getting-started/language");
  };

  return (
    <div className="min-h-screen bg-[#FFF8F1] flex flex-col justify-between text-[#0A0A0F] relative overflow-hidden font-sans selection:bg-[#C8FF2A]">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Decorative Pokka Dots (Top Right) */}
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-80 z-0">
        <Image
          src={currentSlide.dotsIcon}
          alt=""
          width={120}
          height={120}
          className="w-full h-full object-contain object-top-right transition-all duration-300"
        />
      </div>

      {/* Main Content Container */}
      <main
        className="w-full max-w-md mx-auto px-5 pt-4 pb-2 flex-1 flex flex-col justify-between relative z-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="flex items-center justify-between">
            {/* Logo: App Icon + Typography */}
            <div className="flex items-center gap-2">
              <Image
                src="/images/Ticha AI - App Icon White.png"
                alt="1% Ticha AI"
                width={48}
                height={48}
                priority
                className="w-10 h-10 md:w-11 md:h-11 object-contain mix-blend-multiply"
              />
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1 leading-none">
                  <span className="font-extrabold text-xl md:text-[22px] text-[#0A0A0F] font-heading tracking-tight">
                    Ticha
                  </span>
                  <span
                    className="font-extrabold text-xl md:text-[22px] font-heading transition-colors"
                    style={{ color: currentSlide.accentColor }}
                  >
                    AI
                  </span>
                </div>
              </div>
            </div>

            {/* Sparkle Star */}
            <div className="mr-2">
              <Image
                src={currentSlide.starIcon}
                alt=""
                width={26}
                height={26}
                className="animate-pulse transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Carousel Slide with Smooth Transition */}
        <div className="my-auto py-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="flex flex-col items-center w-full"
            >
              {/* Dynamic Slide Heading */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A0A0F] leading-[1.15] tracking-tight text-left w-full">
                {currentSlide.titlePrefix}
                <span className="relative inline-block">
                  <span style={{ color: currentSlide.accentColor }}>{currentSlide.highlightText}</span>
                  <span className="absolute -bottom-2.5 left-0 w-full pointer-events-none">
                    <Image
                      src={currentSlide.lineSvg}
                      alt=""
                      width={140}
                      height={25}
                      className="w-full h-auto"
                    />
                  </span>
                </span>
              </h1>

              {/* Dynamic Slide Sub-heading */}
              <p className="text-sm md:text-[15px] text-stone-600 font-medium mt-1.5 leading-snug text-left w-full">
                {currentSlide.subtitle}
              </p>

              {/* Large Character Illustration fitting the canvas with no unnecessary whitespace */}
              <div className="my-2 flex items-center justify-center w-full min-h-[310px] md:min-h-[350px]">
                <Image
                  src={currentSlide.characterSvg}
                  alt={currentSlide.highlightText}
                  width={460}
                  height={380}
                  priority
                  className={`w-full ${currentSlide.characterWidthClass} h-auto object-contain transition-all duration-300 drop-shadow-sm`}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-1 mb-1">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all cursor-pointer rounded-full ${
                  activeSlide === idx
                    ? "w-3.5 h-3.5 bg-[#0A0A0F]"
                    : "w-3.5 h-3.5 bg-transparent border-[1.5px] border-stone-400 hover:border-black"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Action Button & Navigation */}
        <div className="space-y-2.5 pt-1 pb-1">
          {/* Primary Get Started CTA */}
          <button
            onClick={handleGetStarted}
            className={`w-full py-4 px-6 rounded-2xl border-[2.5px] border-black ${currentSlide.buttonBg} ${currentSlide.buttonText} font-bold text-lg md:text-xl flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer font-heading`}
          >
            <span>Get Started</span>
            <svg
              className="w-5 h-5 stroke-[2.5px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

          {/* Already have an account */}
          <div className="text-center">
            <span className="text-xs text-stone-600 font-medium">Already have an account? </span>
            <Link
              href="/login"
              className="text-xs font-extrabold underline decoration-2 underline-offset-2 hover:opacity-80 transition-opacity"
              style={{ color: currentSlide.linkColor }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>

     
    </div>
  );
}
