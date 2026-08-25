"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useIsMounted } from "@/hooks/useIsMounted";
import "@/lib/i18n";

interface EducationOption {
  id: string;
  titleKey: string;
  subtitleKey: string;
  iconBg: string;
  emoji: string;
}

export default function EducationLevelPage() {
  const { t } = useTranslation();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ticha_onboarding_education") || "al";
    }
    return "al";
  });
  const isMounted = useIsMounted();
  const router = useRouter();

  const levels: EducationOption[] = [
    {
      id: "ol",
      titleKey: "education.ol.title",
      subtitleKey: "education.ol.subtitle",
      iconBg: "bg-[#DBEAFE]",
      emoji: "📘",
    },
    {
      id: "al",
      titleKey: "education.al.title",
      subtitleKey: "education.al.subtitle",
      iconBg: "bg-[#FEF3C7]",
      emoji: "📙",
    },
    {
      id: "technical",
      titleKey: "education.technical.title",
      subtitleKey: "education.technical.subtitle",
      iconBg: "bg-[#CCFBF1]",
      emoji: "🛠️",
    },
    {
      id: "university",
      titleKey: "education.university.title",
      subtitleKey: "education.university.subtitle",
      iconBg: "bg-[#F3E8FF]",
      emoji: "🎓",
    },
  ];

  const handleBack = () => {
    router.push("/getting-started/goal");
  };

  const handleContinue = () => {
    if (!selectedLevel) return;
    localStorage.setItem("ticha_onboarding_education", selectedLevel);
    router.push("/getting-started/struggles");
  };

  return (
    <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center p-4 antialiased font-sans selection:bg-[#C8FF2A]">
      <main className="w-full max-w-md min-h-[90vh] flex flex-col justify-between py-6 px-4 md:px-6 text-[#0A0A0F]">
        {/* Top Navigation Bar & Progress Dots */}
        <div>
          <motion.header
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between w-full mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="w-10 h-10 bg-white border-[2.5px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex-shrink-0"
              aria-label="Go back"
            >
              <svg
                className="w-5 h-5 stroke-[3px]"
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
            </motion.button>

            {/* 4-Step Progress Dots (Step 3 active) */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]" />
              <div className="w-7 h-2.5 rounded-full bg-[#C8FF2A] border-[1.5px] border-black" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]" />
            </div>

            {/* Placeholder to balance header alignment */}
            <div className="w-10 h-10" />
          </motion.header>

          {/* Heading & Subtitle */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-left mb-6"
          >
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#0A0A0F]">
                {isMounted ? t("education.title") : "Your Education Level"}
              </h1>
              <span className="text-2xl" role="img" aria-label="grad-cap">
                🎓
              </span>
            </div>
            <p className="text-sm text-stone-600 font-medium mt-2 leading-relaxed">
              {isMounted
                ? t("education.subtitle")
                : "Tell us where you are in your journey so Ticha AI can tailor the lessons for you."}
            </p>
          </motion.div>

          {/* Education Level Option Cards */}
          <div className="space-y-3.5 w-full">
            {levels.map((level, idx) => {
              const isSelected = selectedLevel === level.id;
              return (
                <motion.button
                  key={level.id}
                  type="button"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.12 + idx * 0.06,
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`w-full p-3.5 md:p-4 rounded-2xl border-[3px] border-black flex items-center gap-4 text-left transition-all ${
                    isSelected
                      ? "bg-[#C8FF2A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]"
                      : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl border-[2px] border-black flex items-center justify-center text-xl shrink-0 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${level.iconBg}`}
                  >
                    <span>{level.emoji}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="font-extrabold text-base md:text-lg text-[#0A0A0F] tracking-tight">
                      {isMounted ? t(level.titleKey) : level.titleKey}
                    </h2>
                    <p className="text-xs md:text-sm text-stone-600 font-medium mt-0.5 truncate">
                      {isMounted ? t(level.subtitleKey) : level.subtitleKey}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Footer Continue Button */}
        <motion.footer
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="w-full mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            disabled={!selectedLevel}
            className="w-full bg-[#0A0A0F] hover:bg-[#1A1A24] text-white font-bold text-base md:text-lg py-4 px-6 rounded-full flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isMounted ? t("education.continue") : "Continue"}</span>
            <svg
              className="w-5 h-5 stroke-[2.5px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </motion.button>
        </motion.footer>
      </main>
    </div>
  );
}
