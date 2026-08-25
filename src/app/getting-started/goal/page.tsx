"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useIsMounted } from "@/hooks/useIsMounted";
import "@/lib/i18n";

interface GoalItem {
  id: string;
  titleKey: string;
  subtitleKey: string;
  emoji: string;
  iconBg?: string;
}

export default function GoalSelectionPage() {
  const { t } = useTranslation();
  const isMounted = useIsMounted();
  const router = useRouter();

  // Multi-select state
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const storedArray = localStorage.getItem("ticha_onboarding_goals");
      if (storedArray) {
        try {
          const parsed = JSON.parse(storedArray);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return new Set(parsed);
          }
        } catch {
          /* ignore */
        }
      }
      const stored = localStorage.getItem("ticha_onboarding_goal");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return new Set(parsed);
          }
        } catch {
          if (stored.includes(",")) {
            return new Set(stored.split(",").map((s) => s.trim()));
          }
          return new Set([stored]);
        }
      }
    }
    return new Set(["pass_al", "build_confidence"]);
  });

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) {
          next.delete(id);
        }
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const topRowGoals: GoalItem[] = [
    {
      id: "pass_ol",
      titleKey: "goal.passOl.title",
      subtitleKey: "goal.passOl.subtitle",
      emoji: "📚",
    },
    {
      id: "pass_al",
      titleKey: "goal.passAl.title",
      subtitleKey: "goal.passAl.subtitle",
      emoji: "🎓",
    },
  ];

  const middleGoal: GoalItem = {
    id: "excel_uni",
    titleKey: "goal.excelUni.title",
    subtitleKey: "goal.excelUni.subtitle",
    emoji: "🏛️",
    iconBg: "bg-[#CCFBF1]",
  };

  const bottomRowGoals: GoalItem[] = [
    {
      id: "deep_understanding",
      titleKey: "goal.deepUnderstanding.title",
      subtitleKey: "goal.deepUnderstanding.subtitle",
      emoji: "🧠",
    },
    {
      id: "build_confidence",
      titleKey: "goal.buildConfidence.title",
      subtitleKey: "goal.buildConfidence.subtitle",
      emoji: "💪",
    },
  ];

  const handleBack = () => {
    router.push("/getting-started/language");
  };

  const handleContinue = () => {
    if (selectedGoals.size === 0) return;
    const goalsArray = Array.from(selectedGoals);
    localStorage.setItem("ticha_onboarding_goal", goalsArray.join(","));
    localStorage.setItem("ticha_onboarding_goals", JSON.stringify(goalsArray));
    router.push("/getting-started/education");
  };

  const renderCheckbox = (isSelected: boolean) => (
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${
        isSelected
          ? "bg-[#0A0A0F] text-white"
          : "border-2 border-[#CBD5E1] bg-white"
      }`}
    >
      {isSelected && (
        <svg
          className="w-3.5 h-3.5 stroke-[3px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      )}
    </div>
  );

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

            {/* 4-Step Progress Dots (Step 2 active) */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]" />
              <div className="w-7 h-2.5 rounded-full bg-[#C8FF2A] border-[1.5px] border-black" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]" />
            </div>

            {/* Spacer */}
            <div className="w-10 h-10" />
          </motion.header>

          {/* Heading with Decorative Highlight Underline */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-left mb-6"
          >
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#0A0A0F] leading-tight">
              <span>What&apos;s Your </span>
              <span className="relative inline-block">
                <span>Main Goal?</span>
                <span
                  className="absolute left-0 -bottom-1 w-full h-2.5 bg-[#C8FF2A] -z-10 rounded-sm opacity-90"
                  aria-hidden="true"
                />
              </span>
            </h1>
            <p className="text-sm text-stone-600 font-medium mt-2 leading-relaxed">
              {isMounted
                ? t("goal.subtitle")
                : "Select one or more — we'll tailor your experience to help you succeed."}
            </p>
          </motion.div>

          {/* Goal Cards Grid / List */}
          <div className="space-y-3 w-full">
            {/* Top Row: 2 Grid Cards */}
            <div className="grid grid-cols-2 gap-3">
              {topRowGoals.map((goal, idx) => {
                const isSelected = selectedGoals.has(goal.id);
                return (
                  <motion.button
                    key={goal.id}
                    type="button"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.12 + idx * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 24,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-3.5 rounded-2xl border-[3px] border-black flex flex-col justify-between text-left min-h-[140px] transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#C8FF2A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]"
                        : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <span className="text-2xl">{goal.emoji}</span>
                      {renderCheckbox(isSelected)}
                    </div>
                    <div className="mt-4">
                      <h2 className="font-extrabold text-sm md:text-base text-[#0A0A0F] leading-snug">
                        {isMounted ? t(goal.titleKey) : goal.titleKey}
                      </h2>
                      <p className="text-xs text-stone-600 font-medium mt-0.5">
                        {isMounted ? t(goal.subtitleKey) : goal.subtitleKey}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Middle Row: Full-width Card */}
            {(() => {
              const isSelected = selectedGoals.has(middleGoal.id);
              return (
                <motion.button
                  key={middleGoal.id}
                  type="button"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.22,
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => toggleGoal(middleGoal.id)}
                  className={`w-full p-3.5 md:p-4 rounded-2xl border-[3px] border-black flex items-center justify-between text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#C8FF2A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]"
                      : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-2">
                    <div className="w-11 h-11 rounded-xl border-[2px] border-black bg-[#CCFBF1] flex items-center justify-center text-xl shrink-0 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                      <span>{middleGoal.emoji}</span>
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-extrabold text-sm md:text-base text-[#0A0A0F] leading-snug">
                        {isMounted ? t(middleGoal.titleKey) : middleGoal.titleKey}
                      </h2>
                      <p className="text-xs text-stone-600 font-medium mt-0.5 truncate">
                        {isMounted
                          ? t(middleGoal.subtitleKey)
                          : middleGoal.subtitleKey}
                      </p>
                    </div>
                  </div>
                  {renderCheckbox(isSelected)}
                </motion.button>
              );
            })()}

            {/* Bottom Row: 2 Grid Cards */}
            <div className="grid grid-cols-2 gap-3">
              {bottomRowGoals.map((goal, idx) => {
                const isSelected = selectedGoals.has(goal.id);
                return (
                  <motion.button
                    key={goal.id}
                    type="button"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.28 + idx * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 24,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-3.5 rounded-2xl border-[3px] border-black flex flex-col justify-between text-left min-h-[140px] transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#C8FF2A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]"
                        : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <span className="text-2xl">{goal.emoji}</span>
                      {renderCheckbox(isSelected)}
                    </div>
                    <div className="mt-4">
                      <h2 className="font-extrabold text-sm md:text-base text-[#0A0A0F] leading-snug">
                        {isMounted ? t(goal.titleKey) : goal.titleKey}
                      </h2>
                      <p className="text-xs text-stone-600 font-medium mt-0.5">
                        {isMounted ? t(goal.subtitleKey) : goal.subtitleKey}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Next Button */}
        <motion.footer
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.38, duration: 0.3 }}
          className="w-full mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            disabled={selectedGoals.size === 0}
            className="w-full bg-[#0A0A0F] hover:bg-[#1A1A24] text-white font-extrabold text-base md:text-lg py-4 px-6 rounded-full flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            <span>{isMounted ? t("goal.continue") : "NEXT"}</span>
            <svg
              className="w-5 h-5 stroke-[3px]"
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
