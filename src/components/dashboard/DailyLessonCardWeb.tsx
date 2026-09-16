"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FireIcon } from "hugeicons-react";
import { useProfile } from "@/hooks/useProfile";
import { getTodayLessonTopic } from "@/lib/dailyTopic";

/**
 * DailyLessonCardWeb — Large lime-green feature card for the web/tablet dashboard.
 * Shows today's subject and topic from the daily rotation engine, connected to
 * the student's profile struggles for personalised content.
 *
 * Matches the design: subject name, topic title, "Start Lesson →" CTA, and
 * a decorative open-book SVG illustration in the bottom-right corner.
 */
export default function DailyLessonCardWeb() {
  const router = useRouter();
  const { profile } = useProfile();

  // Get today's live lesson from the rotation engine
  const struggles = profile?.struggles as string[] | undefined;
  const { subject, topic } = getTodayLessonTopic(struggles ?? []);

  // Format topic for display (title case, line-break on "And")
  const displayTopic = topic.replace(/ and /gi, "\nAnd ");

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => router.push("/dashboard/daily-lessons")}
      className="bg-[#C8FF2A] border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[260px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group"
    >
      {/* Subject Badge */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-10 h-10 bg-white border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <FireIcon size={20} className="text-black" />
        </div>
        <span className="text-base font-black text-black tracking-tight">
          {subject}
        </span>
      </div>

      {/* Topic Title */}
      <h3 className="text-2xl lg:text-[1.7rem] font-black text-black leading-tight tracking-tight whitespace-pre-line max-w-[65%]">
        {displayTopic}
      </h3>

      {/* CTA */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-base font-black text-black tracking-tight">
          Start Lesson
        </span>
        <svg
          className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
          />
        </svg>
      </div>

      {/* Decorative Book Illustration (SVG) */}
      <div className="absolute bottom-4 right-4 opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none">
        <svg
          width="110"
          height="90"
          viewBox="0 0 110 90"
          fill="none"
          className="text-[#1A1A1A]"
        >
          {/* Open book shape */}
          <path
            d="M55 20C55 20 40 12 15 12C10 12 5 14 5 18V72C5 76 10 78 15 78C40 78 55 70 55 70M55 20C55 20 70 12 95 12C100 12 105 14 105 18V72C105 76 100 78 95 78C70 78 55 70 55 70M55 20V70"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Page lines left */}
          <path
            d="M20 28H45M20 38H42M20 48H40M20 58H38"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Page lines right */}
          <path
            d="M65 28H90M68 38H88M70 48H85"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Small triangle decoration (math symbol) */}
          <path
            d="M75 55L82 68H68Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* x² text */}
          <text
            x="85"
            y="65"
            fontSize="10"
            fontWeight="800"
            fill="currentColor"
            fontFamily="sans-serif"
          >
            x²
          </text>
        </svg>
      </div>

      {/* Sparkle decorations */}
      <div className="absolute top-6 right-8 pointer-events-none">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z"
            fill="#1A1A1A"
            opacity="0.15"
          />
        </svg>
      </div>
      <div className="absolute top-16 right-20 pointer-events-none">
        <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z"
            fill="#1A1A1A"
            opacity="0.12"
          />
        </svg>
      </div>
    </motion.div>
  );
}
