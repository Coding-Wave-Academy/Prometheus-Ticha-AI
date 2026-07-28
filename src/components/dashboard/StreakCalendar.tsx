"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { StreakDay } from "@/types";

interface StreakCalendarProps {
  streakCount: number;
  days: StreakDay[];
}

/**
 * StreakCalendar — orange card showing streak count + 7-day activity grid.
 */
export default function StreakCalendar({ streakCount, days }: StreakCalendarProps) {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-[#FFB040] border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
      <div className="flex gap-4 items-start mb-4">
        {/* Fire Icon Box */}
        <div className="w-16 h-16 bg-white border-[3px] border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
          <svg className="w-9 h-9 text-orange-600 fill-current" viewBox="0 0 24 24">
            <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.6 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-5.52-4.5-9.33-6.5-13.33z" />
          </svg>
        </div>

        <div className="flex-1 space-y-0.5">
          <h2 className="text-xl font-black uppercase tracking-tight text-black leading-tight">
            {streakCount} {t("dashboard.streakDays")}
          </h2>
          <p className="text-sm font-medium text-stone-900 opacity-90">
            {t("dashboard.streakMotivation")}
          </p>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-7 gap-2 w-full">
        {days.map((item, index) => (
          <div
            key={index}
            className={`aspect-square rounded-lg border-[3px] border-black flex items-center justify-center font-bold text-sm tracking-tight shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors ${
              item.active
                ? "bg-[#B6FF00] text-black"
                : "bg-[#1A1A1A] text-white"
            }`}
          >
            {item.day}
          </div>
        ))}
      </div>
    </section>
  );
}
