"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useIsMounted } from "@/hooks/useIsMounted";
import "@/lib/i18n";

interface EducationOption {
  id: string;
  titleKey: string;
  subtitleKey: string;
  icon: React.ReactNode;
}

export default function EducationLevelPage() {
  const { t } = useTranslation();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const isMounted = useIsMounted();
  const router = useRouter();

  const levels: EducationOption[] = [
    {
      id: "ol",
      titleKey: "education.ol.title",
      subtitleKey: "education.ol.subtitle",
      icon: (
        <svg className="w-8 h-8 text-black fill-current" viewBox="0 0 24 24">
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
        </svg>
      ),
    },
    {
      id: "al",
      titleKey: "education.al.title",
      subtitleKey: "education.al.subtitle",
      icon: (
        <svg className="w-8 h-8 text-black fill-current" viewBox="0 0 24 24">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM3.88 12.88L12 17.3l8.12-4.42L12 8.46l-8.12 4.42z" />
        </svg>
      ),
    },
    {
      id: "university",
      titleKey: "education.university.title",
      subtitleKey: "education.university.subtitle",
      icon: (
        <svg className="w-8 h-8 text-black fill-current" viewBox="0 0 24 24">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 8.7L5.3 8 12 4.3 18.7 8 12 11.7z" />
        </svg>
      ),
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
    <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center p-4 antialiased font-sans selection:bg-[#B6FF00]">
      <main className="w-full max-w-md min-h-[85vh] flex flex-col justify-between py-6 px-6 text-black">
        {/* Animated Header & Progress */}
        <motion.header
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-4 w-full"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="w-11 h-11 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex-shrink-0"
            aria-label="Go back"
          >
            <svg
              className="w-6 h-6 stroke-[3.5px]"
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

          <div className="flex gap-1.5 w-full items-center">
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1" />
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1" />
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1" />
            <div className="h-2 bg-transparent border-[1.5px] border-black rounded-full flex-1" />
            <div className="h-2 bg-transparent border-[1.5px] border-black rounded-full flex-1" />
          </div>
        </motion.header>

        {/* Title Area */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-center mt-8 mb-4"
        >
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">
            {isMounted ? t("education.title") : "Your Education Level"}
          </h1>
        </motion.div>

        {/* Animated Staggered Education Level Options */}
        <div className="space-y-5 my-auto w-full">
          {levels.map((level, idx) => {
            const isSelected = selectedLevel === level.id;
            return (
              <motion.button
                key={level.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.15 + idx * 0.08,
                  type: "spring",
                  stiffness: 300,
                  damping: 24,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedLevel(level.id)}
                className={`w-full py-5 px-4 rounded-2xl border-[3.5px] border-black flex flex-col items-center justify-center text-center transition-all ${
                  isSelected
                    ? "bg-[#B6FF00] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]"
                    : "bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
                }`}
              >
                <div className="w-12 h-12 bg-white border-[2.5px] border-black rounded-xl flex items-center justify-center mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {level.icon}
                </div>

                <h2 className="font-black text-lg text-[#1A1A1A] tracking-tight">
                  {isMounted ? t(level.titleKey) : level.titleKey}
                </h2>
                <p className="text-sm text-stone-600 font-medium mt-0.5">
                  {isMounted ? t(level.subtitleKey) : level.subtitleKey}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Footer Continue Button */}
        <motion.footer
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="w-full mt-6"
        >
          <motion.button
            whileHover={selectedLevel ? { scale: 1.02 } : {}}
            whileTap={selectedLevel ? { scale: 0.97 } : {}}
            onClick={handleContinue}
            disabled={!selectedLevel}
            className={`w-full border-[3.5px] border-black rounded-xl py-4 px-4 font-black text-lg uppercase tracking-wider transition-all shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${
              selectedLevel
                ? "bg-[#B6FF00] hover:bg-[#a3e600] text-black cursor-pointer shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
                : "bg-[#E8E6DA] text-stone-400 cursor-not-allowed opacity-80 shadow-none border-stone-400"
            }`}
          >
            {isMounted ? t("education.continue") : "Continue"}
          </motion.button>
        </motion.footer>
      </main>
    </div>
  );
}
