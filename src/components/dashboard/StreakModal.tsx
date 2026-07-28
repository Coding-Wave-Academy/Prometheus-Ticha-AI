"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FireIcon, Shield01Icon, CheckmarkCircle01Icon } from "hugeicons-react";
import { StreakDayItem } from "@/hooks/useStreak";

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakCount: number;
  freezesRemaining: number;
  isTodayClaimed: boolean;
  weeklyDays: StreakDayItem[];
  onClaim: () => void;
}

export default function StreakModal({
  isOpen,
  onClose,
  streakCount,
  freezesRemaining,
  isTodayClaimed,
  weeklyDays,
  onClaim,
}: StreakModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          id="streak-details-modal"
          className="w-full max-w-sm bg-[#FAF7EC] border-[4px] border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex flex-col text-left space-y-5"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white border-[3px] border-black rounded-full flex items-center justify-center font-black text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none hover:bg-stone-50"
            aria-label="Close streak modal"
          >
            ✕
          </button>

          {/* Animated Hero Fire Icon */}
          <div className="flex flex-col items-center text-center space-y-2 pt-2">
            <motion.div
              animate={{
                scale: [1, 1.12, 1],
                rotate: [0, 3, -3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-20 h-20 bg-[#FFB040] border-[3.5px] border-black rounded-3xl flex items-center justify-center shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] relative"
            >
              <FireIcon size={44} className="text-orange-600" />
            </motion.div>

            <h2 className="text-3xl font-black uppercase text-black tracking-tight mt-1">
              {streakCount} Day Streak!
            </h2>
            <p className="text-xs font-bold text-stone-600 max-w-xs">
              Chess.com-style healthy streak protection keeps your momentum safe even if life gets busy.
            </p>
          </div>

          {/* Streak Saver / Pause Protection Card */}
          <div className="bg-[#B6FF00] border-[3px] border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white border-[2.5px] border-black rounded-lg flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                <Shield01Icon size={22} className="text-black" />
              </div>
              <div>
                <h4 className="font-black text-xs uppercase text-black leading-tight">
                  Streak Protection Active
                </h4>
                <p className="text-[11px] font-bold text-stone-800 leading-snug">
                  {freezesRemaining} / 2 Streak Savers available
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase bg-black text-[#B6FF00] px-2 py-0.5 rounded-full border border-black">
              Safe
            </span>
          </div>

          {/* Weekly Status Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">
              This Week&apos;s Breakdown
            </h4>
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {weeklyDays.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl border-[2px] border-black flex flex-col items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                    item.status === "active"
                      ? "bg-[#B6FF00]"
                      : item.status === "frozen"
                      ? "bg-[#FFB040]"
                      : "bg-white"
                  }`}
                >
                  <span className="text-xs font-black text-black">{item.day}</span>
                  {item.status === "active" && (
                    <FireIcon size={14} className="text-orange-600 mt-1" />
                  )}
                  {item.status === "frozen" && (
                    <Shield01Icon size={14} className="text-black mt-1" />
                  )}
                  {item.status === "upcoming" && (
                    <div className="w-3.5 h-3.5 rounded-full border border-stone-300 mt-1" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Claim Action Button */}
          <button
            onClick={onClaim}
            disabled={isTodayClaimed}
            className={`w-full py-3.5 px-4 rounded-xl border-[3.5px] border-black font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 ${
              isTodayClaimed
                ? "bg-stone-200 text-stone-500 shadow-none cursor-not-allowed border-stone-400"
                : "bg-[#FFB040] hover:bg-[#ffa326] text-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            }`}
          >
            {isTodayClaimed ? (
              <>
                <CheckmarkCircle01Icon size={18} className="text-stone-600" />
                <span>Today&apos;s Streak Claimed!</span>
              </>
            ) : (
              <>
                <FireIcon size={18} className="text-orange-600" />
                <span>Claim Today&apos;s Streak</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
