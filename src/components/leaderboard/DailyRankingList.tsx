"use client";

import React from "react";
import Image from "next/image";
import { LeaderboardUser } from "@/types/leaderboard";

interface DailyRankingListProps {
  users: LeaderboardUser[];
  onSeeFullLeaderboard: () => void;
}

/**
 * DailyRankingList — scrollable list of ranked rows with a pinned "You" row
 * highlighted in orange, plus a "See Full Leaderboard" CTA at the bottom.
 */
export default function DailyRankingList({
  users,
  onSeeFullLeaderboard,
}: DailyRankingListProps) {
  return (
    <section className="w-full space-y-3 mb-8">
      <h3 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A] pl-1 mb-4">
        Daily Ranking
      </h3>

      {users.map((user) => (
        <div
          key={`${user.rank}-${user.name}`}
          className={`flex items-center gap-3 rounded-xl border-[3px] border-black p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${
            user.isSelf
              ? "bg-[#FFB040]"
              : "bg-white hover:bg-stone-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          }`}
        >
          {/* Rank number */}
          <span className="w-7 font-black text-base text-[#1A1A1A] text-center flex-shrink-0">
            {user.rank}
          </span>

          {/* Avatar */}
          <div className="w-11 h-11 rounded-xl border-[2.5px] border-black overflow-hidden shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
            <Image
              src={user.avatar}
              alt={user.name}
              width={44}
              height={44}
              className="object-cover"
            />
          </div>

          {/* Name + school */}
          <div className="flex-1 min-w-0">
            <p className="font-black text-[15px] text-[#1A1A1A] truncate leading-tight">
              {user.name}
            </p>
            <p className="text-[11px] font-bold text-stone-700 truncate leading-tight">
              {user.school}
            </p>
          </div>

          {/* Points */}
          <div className="flex flex-col items-end flex-shrink-0">
            <span className="font-black text-base text-[#1A1A1A]">
              {user.points.toLocaleString()}
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider text-stone-600">
              PTS
            </span>
          </div>
        </div>
      ))}

      {/* CTA */}
      <button
        id="see-full-leaderboard"
        onClick={onSeeFullLeaderboard}
        className="w-full bg-white border-[3.5px] border-black rounded-xl py-4 font-black text-[17px] uppercase tracking-wider shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:bg-stone-50 mt-2"
      >
        See Full Leaderboard
      </button>
    </section>
  );
}
