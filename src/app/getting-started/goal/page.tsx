"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

interface GoalOption {
  id: string;
  titleKey: string;
  descriptionKey: string;
  bgColor: string;
  icon: React.ReactNode;
  badgeTextKey: string;
  badgeIcon: React.ReactNode;
}

export default function GoalSelectionPage() {
  const { t } = useTranslation();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const goals: GoalOption[] = [
    {
      id: "gce",
      titleKey: "goal.gce.title",
      descriptionKey: "goal.gce.description",
      bgColor: "bg-[#FFB040]",
      badgeTextKey: "goal.gce.badge",
      badgeIcon: (
        <svg
          className="w-3.5 h-3.5 text-black"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941"
          />
        </svg>
      ),
      icon: (
        <svg
          className="w-6 h-6 text-[#7A4711] fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5.47 12.5L12 16l6.53-3.5H5.47z" />
        </svg>
      ),
    },
    {
      id: "habit",
      titleKey: "goal.habit.title",
      descriptionKey: "goal.habit.description",
      bgColor: "bg-[#B6FF00]",
      badgeTextKey: "goal.habit.badge",
      badgeIcon: <span className="text-xs leading-none">🔥</span>,
      icon: (
        <svg
          className="w-6 h-6 text-[#4A6700]"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
          />
        </svg>
      ),
    },
    {
      id: "rank",
      titleKey: "goal.rank.title",
      descriptionKey: "goal.rank.description",
      bgColor: "bg-[#D3E2FF]",
      badgeTextKey: "goal.rank.badge",
      badgeIcon: (
        <svg
          className="w-3.5 h-3.5 text-black fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      icon: (
        <svg
          className="w-6 h-6 text-[#2B4C7E]"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941"
          />
        </svg>
      ),
    },
    {
      id: "curiosity",
      titleKey: "goal.curiosity.title",
      descriptionKey: "goal.curiosity.description",
      bgColor: "bg-[#FFE5C4]",
      badgeTextKey: "goal.curiosity.badge",
      badgeIcon: (
        <svg
          className="w-3.5 h-3.5 text-black"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499c.172-.436.784-.436.956 0l2.4 4.861 5.334.777c.48.07.67.659.322.99l-3.86 3.763.911 5.314c.082.478-.42.84-.842.615l-4.772-2.507-4.772 2.507c-.422.225-.923-.138-.842-.615l.911-5.314-3.86-3.763c-.348-.33-.158-.92.322-.99l5.334-.777 2.4-4.861z"
          />
        </svg>
      ),
      icon: (
        <svg
          className="w-6 h-6 text-[#7A5311] fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1-1.5-1s-1.5.17-1.5.17v.51C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
      ),
    },
  ];

  const handleBack = () => {
    router.push("/getting-started/language");
  };

  const handleContinue = () => {
    if (!selectedGoal) return;
    console.log(`Goal chosen: ${selectedGoal}`);
    router.push("/getting-started/education");
  };

  return (
    <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center p-4 antialiased font-sans">
      {/* PWA Mobile-First Wrapper Container */}
      <main className="w-full max-w-md min-h-[85vh] flex flex-col justify-between py-6 px-6 text-black">
        {/* Navigation & Progress Header */}
        <header className="flex items-center gap-4 w-full">
          <button
            onClick={handleBack}
            className="w-11 h-11 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all shrink-0"
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
          </button>

          {/* Progress Tracker (Step 2 of 5 Active) */}
          <div className="flex gap-1.5 w-full items-center">
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-transparent border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-transparent border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-transparent border-[1.5px] border-black rounded-full flex-1"></div>
          </div>
        </header>

        {/* Heading Section */}
        <div className="text-center space-y-1 mt-6 mb-4">
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">
            {isMounted ? t("goal.title") : "What is your primary goal?"}
          </h1>
          <p className="text-[15px] text-stone-600 font-medium">
            {isMounted
              ? t("goal.subtitle")
              : "Let's get 1% better every single day."}
          </p>
        </div>

        {/* Goal Stack Layout */}
        <div className="space-y-4 my-auto w-full">
          {goals.map((goal) => {
            const isSelected = selectedGoal === goal.id;
            return (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={`w-full text-left p-3.5 md:p-4 rounded-2xl border-[3.5px] border-black flex items-center gap-3.5 transition-all ${
                  isSelected
                    ? `${goal.bgColor} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]`
                    : "bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
                }`}
              >
                {/* Left Circular Icon Bubble */}
                <div className="w-11 h-11 bg-white border-[2.5px] border-black rounded-full flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {goal.icon}
                </div>

                {/* Card Main Info Content */}
                <div className="space-y-1.5 flex-1 text-left">
                  <div>
                    <h2 className="font-black text-base leading-tight text-[#1A1A1A]">
                      {isMounted ? t(goal.titleKey) : goal.titleKey}
                    </h2>
                    <p className="text-xs text-stone-600 font-medium leading-tight mt-0.5">
                      {isMounted ? t(goal.descriptionKey) : goal.descriptionKey}
                    </p>
                  </div>

                  {/* Context Badge Row */}
                  <div className="inline-flex bg-white border-2 border-black rounded-md py-0.5 px-2 items-center gap-1 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    {goal.badgeIcon}
                    <span className="text-[9px] font-black tracking-wide text-black uppercase">
                      {isMounted ? t(goal.badgeTextKey) : goal.badgeTextKey}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Button Footer */}
        <footer className="w-full mt-6">
          <button
            onClick={handleContinue}
            disabled={!selectedGoal}
            className={`w-full border-[3.5px] border-black rounded-xl py-4 px-4 font-black text-lg uppercase tracking-wider transition-all shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${
              selectedGoal
                ? "bg-[#B6FF00] hover:bg-[#a3e600] text-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                : "bg-[#E8E6DA] text-stone-400 cursor-not-allowed opacity-80 shadow-none border-stone-400"
            }`}
          >
            {isMounted ? t("goal.continue") : "Continue"}
          </button>
        </footer>
      </main>
    </div>
  );
}
