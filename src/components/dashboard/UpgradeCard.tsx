"use client";

import React from "react";
import { SparklesIcon, ArrowRight01Icon, ZapIcon } from "hugeicons-react";

interface UpgradeCardProps {
  onUpgradeClick: () => void;
}

/**
 * UpgradeCard — Neobrutalist banner promoting premium upgrades.
 * Replaces RegionalUpdates to drive student engagement and monetization.
 */
export default function UpgradeCard({ onUpgradeClick }: UpgradeCardProps) {
  return (
    <section className="w-full bg-[#B6FF00] border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6 text-left relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 z-10 flex-1">
          <div className="inline-flex items-center gap-1.5 bg-black text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
            <ZapIcon size={12} className="text-[#B6FF00]" />
            <span>TICHA PRO MAX</span>
          </div>

          <h3 className="text-xl font-black uppercase tracking-tight text-black leading-tight pt-1">
            Unlock 100% Exam Success
          </h3>

          <p className="text-xs font-extrabold text-stone-900 leading-snug">
            Get unlimited 1% Daily Lessons, AI Explainer Videos & Unlimited Tutor Voice Calls!
          </p>
        </div>

        <div className="w-12 h-12 bg-white border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] shrink-0 rotate-[6deg]">
          <SparklesIcon size={24} className="text-amber-600" />
        </div>
      </div>

      <button
        onClick={onUpgradeClick}
        className="w-full mt-4 bg-black text-white hover:bg-stone-900 border-[2.5px] border-black rounded-xl py-3 px-4 font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all flex items-center justify-center gap-2"
      >
        <span>Upgrade to Ticha Pro</span>
        <ArrowRight01Icon size={16} className="text-[#B6FF00]" />
      </button>
    </section>
  );
}
