"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import OnboardingProgressBar from "@/components/onboarding/OnboardingProgressBar";
import "@/lib/i18n";

export default function LanguageSelectionPage() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<"en" | "fr">("en");

  useEffect(() => {
    const saved = localStorage.getItem("ticha_lang") as "en" | "fr" | null;
    if (saved === "en" || saved === "fr") {
      setSelectedLang(saved);
    }
  }, []);

  const handleSelectLanguage = (lang: "en" | "fr") => {
    setSelectedLang(lang);
    localStorage.setItem("ticha_lang", lang);
    if (i18n.changeLanguage) {
      i18n.changeLanguage(lang);
    }
  };

  const handleContinue = () => {
    localStorage.setItem("ticha_lang", selectedLang);
    router.push("/getting-started/goal");
  };

  return (
    <div className="min-h-screen bg-[#FFF8F1] flex flex-col justify-between text-[#0A0A0F] relative overflow-hidden font-sans selection:bg-[#C8FF2A]">
      {/* Decorative Sparkle Star */}
      <div className="absolute top-14 right-6 pointer-events-none z-0">
        <Image
          src="/images/onboarding-icons/Lime Star.svg"
          alt=""
          width={26}
          height={26}
          className="animate-pulse"
        />
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-md mx-auto px-5 pt-6 pb-4 flex-1 flex flex-col justify-between relative z-10">
        <div>
          {/* Shared Progress Bar (Step 1 of 4) */}
          <OnboardingProgressBar currentStep={1} totalSteps={4} />


          {/* Heading */}
          <div className="mt-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A0A0F] leading-[1.15] tracking-tight">
              What{" "}
              <span className="relative inline-block text-[#84CC16]">
                language
                <span className="absolute -bottom-2.5 left-0 w-full pointer-events-none">
                  <Image
                    src="/images/onboarding-icons/Lime Line.svg"
                    alt=""
                    width={130}
                    height={25}
                    className="w-full h-auto"
                  />
                </span>
              </span>
              <br />
              do you prefer?
            </h1>
            <p className="text-sm text-stone-600 font-medium mt-2 leading-snug">
              Select your preferred language to get started.
            </p>
          </div>
        </div>

        {/* Center Illustration - Large & Crisp */}
        <div className="my-2 flex items-center justify-center">
          <Image
            src="/images/onboarding-icons/Language Character.svg"
            alt="Bilingual students"
            width={380}
            height={300}
            priority
            className="w-full max-w-[340px] md:max-w-[380px] h-auto object-contain drop-shadow-sm"
          />
        </div>


        {/* Language Selection Buttons */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* English Card */}
            <button
              type="button"
              onClick={() => handleSelectLanguage("en")}
              className={`p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer font-heading ${
                selectedLang === "en"
                  ? "bg-[#EBFFA8] border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                  : "bg-white border-[2px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#C8FF2A] border-[1.5px] border-black flex items-center justify-center text-xs">
                  🌐
                </div>
                <span className="font-extrabold text-sm md:text-base text-[#0A0A0F] tracking-wide">
                  ENGLISH
                </span>
              </div>
              {selectedLang === "en" && (
                <div className="w-5 h-5 rounded-full bg-[#0A0A0F] text-white flex items-center justify-center text-[10px] font-black">
                  ✓
                </div>
              )}
            </button>

            {/* Français Card */}
            <button
              type="button"
              onClick={() => handleSelectLanguage("fr")}
              className={`p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer font-heading ${
                selectedLang === "fr"
                  ? "bg-[#EBFFA8] border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                  : "bg-white border-[2px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white border-[1.5px] border-black flex items-center justify-center text-xs">
                  🌐
                </div>
                <span className="font-extrabold text-sm md:text-base text-[#0A0A0F] tracking-wide">
                  FRANÇAIS
                </span>
              </div>
              {selectedLang === "fr" && (
                <div className="w-5 h-5 rounded-full bg-[#0A0A0F] text-white flex items-center justify-center text-[10px] font-black">
                  ✓
                </div>
              )}
            </button>
          </div>

          {/* Info pill */}
          <div className="w-full py-2.5 px-4 rounded-xl bg-[#F4EFE6] border border-black/10 flex items-center justify-center gap-2 text-xs font-semibold text-stone-700">
            <span className="text-[#84CC16]">⚙️</span>
            <span>
              You can change this in <strong className="text-[#84CC16] font-bold">settings</strong> anytime
            </span>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full py-3.5 px-6 rounded-2xl border-[2.5px] border-black bg-[#C8FF2A] hover:bg-[#b8f01c] text-[#0A0A0F] font-bold text-base md:text-lg flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer font-heading uppercase tracking-wider"
          >
            <span>CONTINUE</span>
            <svg
              className="w-5 h-5 stroke-[2.5px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </main>

      {/* Subtle Bottom Wave Accent */}
      <footer className="w-full py-2 bg-[#F2FAD4] rounded-t-3xl border-t border-black/10 flex items-center justify-center gap-1">
        <Image
          src="/images/onboarding-icons/Lime Star.svg"
          alt=""
          width={14}
          height={14}
        />
      </footer>
    </div>
  );
}
