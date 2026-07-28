"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useNavItems } from "@/hooks/useNavItems";
import LevelToggle from "@/components/leaderboard/LevelToggle";
import ContextFilter from "@/components/leaderboard/ContextFilter";
import RankingContextCard from "@/components/leaderboard/RankingContextCard";
import Podium from "@/components/leaderboard/Podium";
import DailyRankingList from "@/components/leaderboard/DailyRankingList";
import BottomStats from "@/components/leaderboard/BottomStats";
import TertiaryTab from "@/components/leaderboard/TertiaryTab";
import BottomNav from "@/components/layout/BottomNav";
import {
  LeaderboardUser,
  PodiumUser,
  EducationLevel,
  FilterContext,
} from "@/types/leaderboard";

// ─── Static data (replace once leaderboard API is wired up) ──────────────────

const podiumUsers: [PodiumUser, PodiumUser, PodiumUser] = [
  { rank: 1, name: "Sarah K.", points: 2850, avatar: "/images/podium-1.png" },
  { rank: 2, name: "Amadou B.", points: 2610, avatar: "/images/podium-2.png" },
  { rank: 3, name: "Jean P.", points: 2595, avatar: "/images/podium-3.png" },
];

const USER_RANK = 42;
const USER_POINTS = 1850;
const AHEAD_OF = 12400;

const dailyRankings: LeaderboardUser[] = [
  {
    rank: 4,
    name: "Chidi Okoro",
    school: "GBHS Molyko",
    points: 2420,
    avatar: "/images/avatar-chidi.png",
  },
  {
    rank: 5,
    name: "Marie Eboa",
    school: "Lycée Joss",
    points: 2380,
    avatar: "/images/avatar-marie.png",
  },
  {
    rank: USER_RANK,
    name: "You (Student)",
    school: "Your School",
    points: USER_POINTS,
    avatar: "/images/onboarding-avatar.png",
    isSelf: true,
  },
  {
    rank: 6,
    name: "Paul Biya Jr",
    school: "Sacred Heart",
    points: 2310,
    avatar: "/images/avatar-paul.png",
  },
];

const bottomStats = [
  {
    id: "positions",
    icon: "↗️",
    headline: "+12 Positions",
    subtext: "Up since yesterday",
    bgColor: "bg-[#D3E2FF]",
  },
  {
    id: "badge",
    icon: "🏅",
    headline: "Master",
    subtext: "Current Badge",
    bgColor: "bg-[#B6FF00]",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LeaderboardsPage() {
  const navItems = useNavItems();

  const [educationLevel, setEducationLevel] =
    useState<EducationLevel>("secondary");
  const [filterContext, setFilterContext] = useState<FilterContext>("national");

  return (
    <div className="min-h-screen bg-[#FAF7EC] text-black antialiased font-sans pb-28 selection:bg-[#B6FF00]">
      <main className="w-full max-w-md mx-auto p-4 pt-6 flex flex-col items-center">
        {/* Header */}
        <header className="flex items-center justify-between w-full mb-8 border-b-[3.5px] border-black pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full border-[2px] border-black overflow-hidden shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              <Image
                src="/images/onboarding-avatar.png"
                alt="EduCameroon logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <h1 className="text-xl font-black uppercase text-[#965A18] tracking-wider leading-none">
              EduCameroon
            </h1>
          </div>

          <button
            id="leaderboard-notifications"
            aria-label="Notifications"
            className="relative w-10 h-10 bg-white border-[3px] border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all"
          >
            <svg
              className="w-5 h-5 stroke-[3px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          </button>
        </header>

        {/* Level toggle — Secondary / Tertiary */}
        <LevelToggle value={educationLevel} onChange={setEducationLevel} />

        {educationLevel === "secondary" ? (
          <>
            {/* Context sub-filter — National / Community / My School */}
            <ContextFilter value={filterContext} onChange={setFilterContext} />

            {/* User ranking context banner */}
            <RankingContextCard
              rank={USER_RANK}
              points={USER_POINTS}
              aheadOf={AHEAD_OF}
            />

            {/* Top-3 podium */}
            <Podium users={podiumUsers} />

            {/* Daily ranking list + CTA */}
            <DailyRankingList
              users={dailyRankings}
              onSeeFullLeaderboard={() =>
                console.log("Full leaderboard requested")
              }
            />

            {/* Bottom stat cards */}
            <BottomStats cards={bottomStats} />
          </>
        ) : (
          <TertiaryTab />
        )}
      </main>

      <BottomNav items={navItems} />
    </div>
  );
}
