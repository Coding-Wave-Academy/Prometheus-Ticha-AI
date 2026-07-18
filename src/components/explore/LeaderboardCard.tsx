"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

interface LeaderboardCardProps {
  onClick: () => void;
}

/**
 * LeaderboardCard — full-width orange CTA card with trophy image overlay,
 * animated arrow, and national/school ranking subtitle.
 */
export default function LeaderboardCard({ onClick }: LeaderboardCardProps) {
  const { t } = useTranslation();

  return (
    <button
      id="explore-leaderboard"
      onClick={onClick}
      className="w-full bg-[#FFB040] p-6 border-[3.5px] border-black rounded-2xl flex items-center gap-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-left relative group overflow-hidden"
    >
      {/* Trophy icon circle */}
      <div className="w-14 h-14 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 relative z-10">
        <span role="img" aria-label="trophy" className="text-3xl leading-none">🏆</span>
      </div>

      {/* Text */}
      <div className="flex-1 space-y-1 relative z-10">
        <h4 className="text-xl font-black text-black leading-tight tracking-tight">
          {t("explore.leaderboard")}
        </h4>
        <p className="text-[13px] font-medium text-stone-900 leading-tight">
          {t("explore.leaderboardSub")}
        </p>
      </div>

      {/* Animated arrow */}
      <div className="absolute inset-y-0 right-6 flex items-center justify-center z-10">
        <svg
          className="w-6 h-6 text-black stroke-[3px] group-hover:translate-x-1.5 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>

      {/* Trophy overlay graphic */}
      <div className="absolute inset-0 flex justify-end pr-10 items-center select-none pointer-events-none z-0">
        <Image
          src="/images/leaderboard-overlay.png"
          alt=""
          width={120}
          height={120}
          className="object-contain opacity-10 group-hover:scale-105 transition-transform"
          aria-hidden="true"
        />
      </div>
    </button>
  );
}
