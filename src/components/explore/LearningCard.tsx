"use client";

import React from "react";
import { HubCard } from "@/types";

interface LearningCardProps {
  card: HubCard;
  onClick: (id: string) => void;
}

/**
 * LearningCard — reusable hub card with two layout modes:
 * - Square (default): aspect-[1/1], icon top-left.
 * - Large (card.large): full-width row with clean Neobrutalist styling.
 */
export default function LearningCard({ card, onClick }: LearningCardProps) {
  return (
    <button
      id={`hub-card-${card.id}`}
      onClick={() => onClick(card.id)}
      className={`${card.bgColor} ${
        card.large
          ? "w-full p-6 flex-row"
          : "w-full aspect-square p-5 flex-col"
      } border-[3.5px] border-black rounded-2xl flex items-start gap-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all relative overflow-hidden text-left group`}
    >
      {/* Icon circle */}
      <div className="w-14 h-14 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 relative z-10">
        {card.icon}
      </div>

      {/* Text */}
      <div className="flex-1 space-y-1 relative z-10">
        <h4
          className={`${
            card.large ? "text-xl" : "text-lg"
          } font-black text-black leading-tight tracking-tight`}
        >
          {card.title}
        </h4>
        <p className="text-[13px] font-medium text-stone-900 leading-tight">
          {card.subtitle}
        </p>
      </div>
    </button>
  );
}
