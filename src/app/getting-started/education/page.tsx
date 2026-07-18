"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

interface EducationOption {
  id: string;
  titleKey: string;
  subtitleKey: string;
  // Using an emoji representation of the character graphics for the local setup
  emojiGraphic: string; 
}

export default function EducationLevelPage() {
  const { t } = useTranslation();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const levels: EducationOption[] = [
    {
      id: "ol",
      titleKey: "education.ol.title",
      subtitleKey: "education.ol.subtitle",
      emojiGraphic: "🧑‍🎓",
    },
    {
      id: "al",
      titleKey: "education.al.title",
      subtitleKey: "education.al.subtitle",
      emojiGraphic: "🧑‍🎓",
    },
    {
      id: "university",
      titleKey: "education.university.title",
      subtitleKey: "education.university.subtitle",
      emojiGraphic: "🎓",
    },
  ];

  const handleBack = () => {
    router.push("/getting-started/goal");
  };

  const handleContinue = () => {
    if (!selectedLevel) return;
    console.log(`Education level chosen: ${selectedLevel}`);
    localStorage.setItem("ticha_onboarding_education", selectedLevel);
    router.push("/getting-started/struggles");
  };

  return (
    <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center p-4 antialiased font-sans">
      {/* PWA Mobile-First Wrapper Container */}
      <main className="w-full max-w-md min-h-[85vh] flex flex-col justify-between py-6 px-6 text-black animate-page-in">
        
        {/* Navigation & Progress Header */}
        <header className="flex items-center gap-4 w-full">
          <button 
            onClick={handleBack}
            className="w-11 h-11 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex-shrink-0"
            aria-label="Go back"
          >
            <svg className="w-6 h-6 stroke-[3.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>

          {/* Progress Tracker (Step 3 of 5 Active) */}
          <div className="flex gap-1.5 w-full items-center">
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-transparent border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-transparent border-[1.5px] border-black rounded-full flex-1"></div>
          </div>
        </header>

        {/* Heading Section */}
        <div className="text-center mt-8 mb-4">
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">
            {isMounted ? t("education.title") : "Your Education Level"}
          </h1>
        </div>

        {/* Cards Stack */}
        <div className="space-y-5 my-auto w-full">
          {levels.map((level) => {
            const isSelected = selectedLevel === level.id;
            return (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`w-full py-6 px-4 rounded-2xl border-[3.5px] border-black flex flex-col items-center justify-center text-center transition-all ${
                  isSelected
                    ? "bg-[#B6FF00] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]"
                    : "bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
                }`}
              >
                {/* Character Graphic Spacer/Placeholder */}
                <div className="text-2xl mb-2 select-none filter drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                  {level.emojiGraphic}
                </div>

                <h2 className="font-black text-lg text-[#1A1A1A] tracking-tight">
                  {isMounted ? t(level.titleKey) : level.titleKey}
                </h2>
                <p className="text-sm text-stone-600 font-medium mt-0.5">
                  {isMounted ? t(level.subtitleKey) : level.subtitleKey}
                </p>
              </button>
            );
          })}
        </div>

        {/* Footer Action Bar */}
        <footer className="w-full mt-6">
          <button
            onClick={handleContinue}
            disabled={!selectedLevel}
            className={`w-full border-[3.5px] border-black rounded-xl py-4 px-4 font-black text-lg uppercase tracking-wider transition-all shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${
              selectedLevel
                ? "bg-[#B6FF00] hover:bg-[#a3e600] text-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                : "bg-[#E8E6DA] text-stone-400 cursor-not-allowed opacity-80 shadow-none border-stone-400"
            }`}
          >
            {isMounted ? t("education.continue") : "Continue"}
          </button>
        </footer>

      </main>
    </div>
  );
}
