"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import OnboardingProgressBar from "@/components/onboarding/OnboardingProgressBar";

interface EducationOption {
  id: string;
  title: string;
  subtitle: string;
  iconEmoji: string;
  iconBg: string;
  iconBorder: string;
}

const EDUCATION_OPTIONS: EducationOption[] = [
  {
    id: "ol",
    title: "GCE O Level",
    subtitle: "Secondary School",
    iconEmoji: "📘",
    iconBg: "bg-[#E0F2FE]",
    iconBorder: "border-[#BAE6FD]",
  },
  {
    id: "al",
    title: "GCE A Level",
    subtitle: "High School",
    iconEmoji: "📙",
    iconBg: "bg-[#FFEDD5]",
    iconBorder: "border-[#FED7AA]",
  },
  {
    id: "technical",
    title: "Technical",
    subtitle: "Vocational Studies",
    iconEmoji: "🛠️",
    iconBg: "bg-[#CCFBF1]",
    iconBorder: "border-[#99F6E4]",
  },
  {
    id: "university",
    title: "University Student",
    subtitle: "Undergraduate",
    iconEmoji: "🎓",
    iconBg: "bg-[#F3E8FF]",
    iconBorder: "border-[#E9D5FF]",
  },
];

export default function EducationLevelPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string>("al");

  useEffect(() => {
    const saved = localStorage.getItem("ticha_onboarding_education");
    if (saved) {
      setSelectedLevel(saved);
    }
  }, []);

  const handleSelect = (id: string) => {
    setSelectedLevel(id);
    localStorage.setItem("ticha_onboarding_education", id);
  };

  const handleContinue = () => {
    localStorage.setItem("ticha_onboarding_education", selectedLevel);
    router.push("/getting-started/struggles");
  };

  return (
    <div className="min-h-screen bg-[#FFF8F1] flex flex-col justify-between text-[#0A0A0F] relative overflow-hidden font-sans selection:bg-[#C8FF2A]">
      {/* Decorative Polka Dots (Top Right) */}
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-80 z-0">
        <Image
          src="/images/onboarding-icons/Orange Top Pokka Dots.svg"
          alt=""
          width={120}
          height={120}
          className="w-full h-full object-contain object-top-right"
        />
      </div>

      {/* Decorative Lime Star Sparkle */}
      <div className="absolute top-16 right-8 pointer-events-none z-0">
        <Image
          src="/images/onboarding-icons/Lime Star.svg"
          alt=""
          width={28}
          height={28}
          className="animate-pulse"
        />
      </div>

      {/* Main Container */}
      <main className="w-full max-w-md mx-auto px-5 pt-6 pb-4 flex-1 flex flex-col justify-between relative z-10">
        <div>
          {/* Shared Progress Bar (Step 3 of 4) */}
          <OnboardingProgressBar currentStep={3} totalSteps={4} />

          {/* Heading */}
          <div className="mt-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A0A0F] leading-[1.15] tracking-tight">
              Your{" "}
              <span className="relative inline-block text-[#84CC16]">
                Education
                <span className="absolute -bottom-2.5 left-0 w-full pointer-events-none">
                  <Image
                    src="/images/onboarding-icons/Lime Line.svg"
                    alt=""
                    width={140}
                    height={25}
                    className="w-full h-auto"
                  />
                </span>
              </span>
              <br />
              Level 🎓
            </h1>
            <p className="text-sm text-stone-600 font-medium mt-2.5 leading-snug">
              Tell us where you are in your journey so Ticha AI can tailor the lessons for you.
            </p>
          </div>

          {/* 4 Education Level Option Cards */}
          <div className="mt-5 space-y-3">
            {EDUCATION_OPTIONS.map((option) => {
              const isSelected = selectedLevel === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={`w-full p-3.5 rounded-3xl flex items-center justify-between text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#EBFFA8] border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                      : "bg-white border-[2px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-2xl ${option.iconBg} border ${option.iconBorder} flex items-center justify-center text-xl shadow-inner`}>
                      {option.iconEmoji}
                    </div>
                    <div>
                      <div className="font-bold text-sm md:text-base text-[#0A0A0F] leading-tight font-heading">
                        {option.title}
                      </div>
                      <div className="text-xs text-stone-500 font-medium mt-0.5">
                        {option.subtitle}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-[#0A0A0F] text-white text-[10px] font-black"
                        : "border-[1.5px] border-stone-300 bg-white"
                    }`}
                  >
                    {isSelected && "✓"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button & Bottom Doodle */}
        <div className="mt-6">
          <button
            onClick={handleContinue}
            className="w-full py-3.5 px-6 rounded-2xl border-[2.5px] border-black bg-[#C8FF2A] hover:bg-[#b8f01c] text-[#0A0A0F] font-bold text-base md:text-lg flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer font-heading uppercase tracking-wider"
          >
            <span>CONTINUE</span>
            <svg className="w-5 h-5 stroke-[2.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}
