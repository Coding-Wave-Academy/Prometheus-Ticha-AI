"use client";

import React from "react";
import Link from "next/link";
import { FireIcon } from "hugeicons-react";
import { useProfile } from "@/hooks/useProfile";
import { getTodayLessonTopic } from "@/lib/dailyTopic";
import { hapticTap } from "@/lib/haptics";

/**
 * Today's lesson card (desktop). Measured from design/Ticha AI Web View - Dashboard.png:
 * 338px tall, soft lime fill, 2px olive border, 64px icon tile, 28px subject,
 * 32px two-line topic, 28px olive "Start Lesson →", line-art book bottom-right.
 */
export default function DailyLessonCardWeb() {
  const { profile } = useProfile();
  const struggles = profile?.struggles as string[] | undefined;
  const { subject, topic } = getTodayLessonTopic(struggles ?? []);
  const displayTopic = topic.replace(/ and /gi, "\nAnd ");

  return (
    <Link
      href="/dashboard/daily-lessons"
      onClick={() => hapticTap()}
      aria-label={`Start today's lesson: ${subject}, ${topic}`}
      className="@container group relative flex flex-col h-[342px] bg-primary-soft border-2 border-olive-line rounded-[18px] overflow-hidden transition-transform duration-150 hover:-translate-y-0.5 outline-none focus-visible:ring-[3px] focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      <span className="flex items-center gap-[20px] pt-[36px] pl-[29px]">
        <span className="w-16 h-16 shrink-0 rounded-[11px] bg-white border-[2.5px] border-ink flex items-center justify-center" aria-hidden="true">
          <FireIcon size={30} className="text-ink" />
        </span>
        <span className="text-[28px] leading-none font-semibold text-ink">{subject}</span>
      </span>

      <span className="mt-[30px] pl-[32px] pr-[180px] @max-[460px]:pr-[32px] text-[32px] leading-[40px] font-bold text-ink whitespace-pre-line">
        {displayTopic}
      </span>

      <span className="mt-auto mb-[44px] ml-[44px] flex items-center gap-[14px] text-[28px] leading-none font-semibold text-olive">
        Start Lesson
        <svg width="28" height="22" viewBox="0 0 28 22" fill="none" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
          <path d="M2 11h23M16 2l9 9-9 9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* Decorative swirl, sparkles and open book (olive line art) */}
      <svg className="absolute top-[6px] right-[18px] text-olive-line" width="56" height="80" viewBox="0 0 56 80" fill="none" aria-hidden="true">
        <path d="M30 2c10 10 14 24 4 34-8 8-20 2-16-8 4-9 18-6 22 4 4 11-2 24-14 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg className="absolute right-[16px] bottom-[34px] text-olive-line @max-[460px]:hidden" width="150" height="120" viewBox="0 0 150 120" fill="none" aria-hidden="true">
        <path d="M118 6l3 8 8 3-8 3-3 8-3-8-8-3 8-3z M14 64l2.5 6.5 6.5 2.5-6.5 2.5-2.5 6.5-2.5-6.5-6.5-2.5 6.5-2.5z" fill="var(--color-primary-soft)" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M30 44l46 10 44-24 22 52-46 30-48-12z" fill="#EEF9B6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M76 54l-2 56M30 44l-2 6 46 12M120 30l3 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M40 60l14 3M38 70l20 4M36 80l12-14 8 16zM86 60l26-12M90 70l14-7M96 64c4 0 6 4 4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <text x="104" y="58" fontSize="13" fontStyle="italic" fill="currentColor" fontFamily="serif">x²</text>
      </svg>
    </Link>
  );
}
