"use client";

import React, { useState } from "react";
import { FireIcon } from "hugeicons-react";
import { useStreak } from "@/hooks/useStreak";
import StreakModal from "@/components/dashboard/StreakModal";
import { hapticTap } from "@/lib/haptics";

/**
 * Streak card (desktop). Measured from design/Ticha AI Web View - Dashboard.png:
 * 340px tall, 2px grey outline, 80×86 icon tile, 37px "N DAY STREAK!",
 * seven 67×78 day tiles on an 84px pitch (black; claimed = lime).
 * Opens StreakModal to claim the day.
 */
export default function StreakCardWeb() {
  const { streakCount, freezesRemaining, isTodayClaimed, weeklyDays, claimDailyStreak, status, pendingClaims } = useStreak();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dayWord = streakCount === 1 ? "Day" : "Days";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          hapticTap();
          setIsModalOpen(true);
        }}
        aria-haspopup="dialog"
        aria-label={`${streakCount} ${dayWord.toLowerCase()} streak. Open streak details`}
        className="@container relative w-full h-[340px] flex flex-col justify-start items-stretch text-left bg-streak-bg border-2 border-streak-line rounded-[20px] pt-[43px] pl-[29px] pr-[29px] transition-transform duration-150 hover:-translate-y-0.5 outline-none focus-visible:ring-[3px] focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      >
        <span className="flex items-start gap-[23px]">
          <span className="w-20 h-[86px] shrink-0 rounded-[12px] bg-white border-[3px] border-ink flex items-center justify-center" aria-hidden="true">
            <FireIcon size={42} className="text-ink" />
          </span>
          <span className="pt-[14px] flex flex-col">
            <span className="text-[clamp(22px,6.2cqw,37px)] leading-none font-extrabold uppercase text-ink tracking-[-0.01em] whitespace-nowrap">
              {streakCount} {dayWord} Streak!
            </span>
            <span className="mt-[14px] text-[clamp(14px,2.9cqw,17px)] leading-tight font-medium text-ink">
              {status === "offline" && pendingClaims > 0
                ? "Saved offline. Syncs when you're back online"
                : <>Keep up the good work, I see you <span aria-hidden="true">🔥</span></>}
            </span>
          </span>
        </span>

        {/* Decorative rays (top right) */}
        <svg className="absolute top-[34px] right-[44px]" width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <path d="M20 4l-6 16M30 14l-16 10M34 26l-18 2" stroke="var(--color-primary-deep)" strokeWidth="3" strokeLinecap="round" />
        </svg>

        <span className="absolute left-[29px] right-[29px] top-[189px] grid grid-cols-7 gap-[min(17px,2.7cqw)] max-w-[571px]" role="list" aria-label="This week">
          {weeklyDays.map((item, index) => {
            const done = item.status === "active";
            const frozen = item.status === "frozen";
            return (
              <span
                key={`${item.label}-${index}`}
                role="listitem"
                aria-label={`${item.label}: ${done ? "studied" : frozen ? "covered by a freeze" : "not yet"}`}
                className={`w-full max-w-[67px] aspect-[67/78] rounded-[9px] flex items-center justify-center text-[clamp(16px,5.3cqw,32px)] font-bold leading-none ${
                  done
                    ? "bg-primary text-ink border-2 border-ink"
                    : frozen
                      ? "bg-card-sky text-ink border-2 border-ink"
                      : "bg-ink text-white"
                }`}
              >
                {item.day}
              </span>
            );
          })}
        </span>
      </button>

      <StreakModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        streakCount={streakCount}
        freezesRemaining={freezesRemaining}
        isTodayClaimed={isTodayClaimed}
        weeklyDays={weeklyDays}
        onClaim={claimDailyStreak}
      />
    </>
  );
}
