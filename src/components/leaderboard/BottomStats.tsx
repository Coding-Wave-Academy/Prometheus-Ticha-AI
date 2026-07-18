"use client";

import React from "react";

interface StatCard {
  id: string;
  icon: string;
  headline: string;
  subtext: string;
  bgColor: string;
}

interface BottomStatsProps {
  cards: StatCard[];
}

/**
 * BottomStats — two-column grid of small info cards shown below the ranking list.
 * Design: "+12 Positions / UP SINCE YESTERDAY" and "Master / CURRENT BADGE".
 */
export default function BottomStats({ cards }: BottomStatsProps) {
  return (
    <section className="w-full grid grid-cols-2 gap-4 mb-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`${card.bgColor} border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-1`}
        >
          <span className="text-xl leading-none">{card.icon}</span>
          <p className="text-2xl font-black text-[#1A1A1A] leading-tight tracking-tight">
            {card.headline}
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-700">
            {card.subtext}
          </p>
        </div>
      ))}
    </section>
  );
}
