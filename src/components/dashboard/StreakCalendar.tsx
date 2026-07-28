"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FireIcon, PauseIcon } from "hugeicons-react";
import { useTranslation } from "react-i18next";
import { useStreak } from "@/hooks/useStreak";
import StreakModal from "@/components/dashboard/StreakModal";
import { hapticTap } from "@/lib/haptics";
import "@/lib/i18n";

export default function StreakCalendar() {
  const { t } = useTranslation();
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
      <section
        onClick={handleOpenModal}
        className="w-full bg-[#FFB040] border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8 cursor-pointer active:translate-x-px active:translate-y-px active:shadow-none transition-all relative overflow-hidden group"
      >
        <div className="flex gap-4 items-start mb-4">
          {/* Animated Fire Icon Box */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-16 h-16 bg-white border-[3px] border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 relative"
          >
            <FireIcon size={36} className="text-orange-600" />
            <span className="absolute -top-1.5 -right-1.5 bg-[#B6FF00] border-[1.5px] border-black rounded-full p-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
              <PauseIcon size={12} className="text-black" />
            </span>
          </motion.div>

          <div className="flex-1 space-y-0.5 text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tight text-black leading-tight">
                {streakCount} {t("dashboard.streakDays")}
              </h2>
              
            </div>
            <p className="text-xs font-extrabold text-stone-900 opacity-90 leading-snug">
              {t("dashboard.streakMotivation")}
            </p>
          </div>
        </div>

        {/* 7-Day Grid */}
        <div className="grid grid-cols-7 gap-2 w-full">
          {weeklyDays.map((item, index) => (
            <div
              key={index}
              className={`aspect-square rounded-xl border-[2.5px] border-black flex flex-col items-center justify-center font-black text-xs tracking-tight shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:scale-105 ${
                item.status === "active"
                  ? "bg-[#B6FF00] text-black"
                  : item.status === "frozen"
                  ? "bg-white text-black"
                  : "bg-stone-900 text-white"
              }`}
            >
              <span>{item.day}</span>
              {item.status === "frozen" && (
                <PauseIcon size={10} className="text-black" />
              )}
            </div>
          ))}
        </div>
      </section>

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
