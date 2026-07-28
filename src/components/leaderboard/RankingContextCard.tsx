"use client";

import React from "react";
import Image from "next/image";

interface RankingContextCardProps {
  rank: number;
  points: number;
  aheadOf: number;
}

/**
 * RankingContextCard — lime-green card showing the current user's rank,
 * points, and how many students they are ahead of.
 */
export default function RankingContextCard({ rank, points, aheadOf }: RankingContextCardProps) {
  return (
    <section className="w-full bg-[#B6FF00] border-[3.5px] border-black rounded-xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-10 relative overflow-hidden flex items-center gap-4">
      {/* Left: text info */}
      <div className="flex-1 space-y-1 relative z-10">
        <div className="inline-flex bg-black/80 rounded-full py-0.5 px-3 items-center gap-1">
          <svg className="w-3 h-3 fill-current text-[#B6FF00]" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-wider text-white">
            Top 1% Daily
          </span>
        </div>
        <h2 className="text-2xl font-black text-black leading-tight tracking-tight">
          Ranking #{rank}
        </h2>
        <p className="text-xs font-bold text-black opacity-90">
          You&apos;re ahead of {aheadOf.toLocaleString()} students!
        </p>
      </div>

      {/* Right: points bubble */}
      <div className="flex flex-col items-center flex-shrink-0 text-center relative z-10 px-2">
        <span className="text-lg font-black text-[#7A4711] drop-shadow-[1.5px_1.5px_0px_#000]">
          {points.toLocaleString()}
        </span>
        <span className="text-[9px] font-black uppercase tracking-wider text-[#7A4711]">
          Points
        </span>
      </div>

      {/* Graph overlay */}
      <div className="absolute inset-0 flex justify-end items-center pr-4 pointer-events-none z-0">
        <Image
          src="/images/rank-graphic-overlay.png"
          alt=""
          width={80}
          height={80}
          className="object-contain opacity-10"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
