"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FireIcon } from "hugeicons-react";
import { useStreak } from "@/hooks/useStreak";
import StreakModal from "@/components/dashboard/StreakModal";
import { hapticTap } from "@/lib/haptics";

/**
 * StreakCardWeb — Right-column streak widget for the web/tablet dashboard.
 * Shows fire icon, streak count, motivational message, and a 7-day calendar grid.
 *
 * Connected to useStreak() hook for live data from Supabase profile.
 * Opens the interactive StreakModal on click for streak claiming.
 */
export default function StreakCardWeb() {
  const {
    streakCount,
    freezesRemaining,
    isTodayClaimed,
    weeklyDays,
    claimDailyStreak,
  } = useStreak();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    hapticTap();
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={handleOpenModal}
        className="bg-[#FAF7EC] border-[3px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer relative overflow-hidden active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all min-h-[260px] flex flex-col justify-between"
      >
        {/* Top Row: Icon + Text */}
        <div className="flex items-start gap-3 mb-4">
          <motion.div
            animate={{
              scale: [1, 1.06, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-12 h-12 bg-black border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0"
          >
            <FireIcon size={24} className="text-white" />
          </motion.div>

          <div className="flex-1">
            <h3 className="text-xl lg:text-2xl font-black uppercase tracking-tight text-black leading-tight">
              {streakCount} Day Streak!
            </h3>
            <p className="text-xs font-semibold text-stone-500 mt-0.5 leading-snug">
              Keep up the good work, I see you 🔥
            </p>
          </div>
        </div>

        {/* 7-Day Grid */}
        <div className="grid grid-cols-7 gap-2 w-full">
          {weeklyDays.map((item, index) => (
            <div
              key={index}
              className={`aspect-square rounded-xl border-[2.5px] border-black flex items-center justify-center font-black text-xs tracking-tight shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                item.status === "active"
                  ? "bg-[#C8FF2A] text-black"
                  : item.status === "frozen"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }`}
            >
              <span>{item.day}</span>
            </div>
          ))}
        </div>

        {/* Decorative Sparkle (top-right) */}
        <div className="absolute top-3 right-3 pointer-events-none">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
          >
            <path
              d="M14 4L16 12L24 14L16 16L14 24L12 16L4 14L12 12Z"
              fill="#FFB040"
              opacity="0.6"
            />
          </svg>
        </div>
        <div className="absolute top-8 right-10 pointer-events-none">
          <svg
            width="14"
            height="14"
            viewBox="0 0 28 28"
            fill="none"
          >
            <path
              d="M14 4L16 12L24 14L16 16L14 24L12 16L4 14L12 12Z"
              fill="#FFB040"
              opacity="0.4"
            />
          </svg>
        </div>
      </motion.div>

      {/* Interactive Streak Modal */}
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
