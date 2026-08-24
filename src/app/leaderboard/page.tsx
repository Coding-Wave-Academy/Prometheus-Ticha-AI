"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FireIcon,
  Award01Icon,
  SparklesIcon,
  HelpCircleIcon,
  Cancel01Icon,
  FlashIcon,
  CheckmarkCircle02Icon,
  Book01Icon,
} from "hugeicons-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";
import { useProfile } from "@/hooks/useProfile";
import { hapticTap } from "@/lib/haptics";

interface RankingUser {
  rank: number;
  name: string;
  school: string;
  points: number;
  avatar: string;
  badge: string;
  isSelf?: boolean;
}

export default function LeaderboardsPage() {
  const router = useRouter();
  const navItems = useNavItems();
  const { profile } = useProfile();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const userName = profile?.full_name || "Student";
  const firstName = userName.split(" ")[0];
  const avatarUrl = profile?.avatar_url || null;
  const streakCount = profile?.streak_count ?? 0;
  const schoolName = profile?.school_name || "GCE Candidate";

  // Calculate dynamic user points: (streak * 50) + base activity points
  const userPoints = streakCount * 50 + 1380;
  const userRank = 4;

  const topPodium = [
    {
      rank: 2,
      name: "Amadou B.",
      school: "GBHS Molyko",
      points: "2,480",
      avatar: "/images/amadou-avatar.png",
      color: "bg-[#FFB040]",
      height: "h-28",
    },
    {
      rank: 1,
      name: "Sarah K.",
      school: "Lycée Joss Douala",
      points: "3,120",
      avatar: "/images/madame-ticha.png",
      color: "bg-[#B6FF00]",
      height: "h-36",
    },
    {
      rank: 3,
      name: "Jean P.",
      school: "Sacred Heart Bamenda",
      points: "2,150",
      avatar: "/images/amadou-avatar.png",
      color: "bg-[#D3E2FF]",
      height: "h-24",
    },
  ];

  const nationalRankings: RankingUser[] = [
    {
      rank: userRank,
      name: `${userName} (You)`,
      school: schoolName,
      points: userPoints,
      avatar: avatarUrl || "/images/amadou-avatar.png",
      badge: "TOP 1% DAILY",
      isSelf: true,
    },
    {
      rank: 5,
      name: "Marie Eboa",
      school: "GBHS Yaoundé",
      points: 1250,
      avatar: "/images/madame-ticha.png",
      badge: "STREAK MASTER",
    },
    {
      rank: 6,
      name: "Emmanuel T.",
      school: "CPC Bali",
      points: 1180,
      avatar: "/images/amadou-avatar.png",
      badge: "PHYSICS PRO",
    },
    {
      rank: 7,
      name: "Blessing N.",
      school: "Bilingual Grammar Buea",
      points: 1050,
      avatar: "/images/madame-ticha.png",
      badge: "MATH WHIZ",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7EC] text-black antialiased font-sans pb-28 selection:bg-[#B6FF00]">
      <main className="w-full max-w-md mx-auto p-4 pt-6 flex flex-col space-y-6 animate-page-in">
        {/* Dynamic Header matching Dashboard Header */}
        <header className="flex items-center justify-between w-full">
          <div
            onClick={() => router.push("/dashboard/profile")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full border-[3px] border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[#B6FF00] shrink-0">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={`${userName}'s profile avatar`}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-lg text-black">
                  {firstName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-[#1A1A1A] leading-tight flex items-center gap-1.5 group-hover:underline">
                <span>Hello, {firstName}</span>
                <Award01Icon size={20} className="text-amber-600 inline" />
              </h1>
              <p className="text-xs font-bold uppercase text-stone-600">National Leaderboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-[#B6FF00] border-[2.5px] border-black rounded-full py-1.5 px-3 font-extrabold text-xs text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 active:scale-95 transition-all"
            >
              <FireIcon size={16} className="text-orange-600 animate-pulse" />
              <span>{streakCount}</span>
            </button>

            <button
              onClick={() => {
                hapticTap();
                setShowHowItWorks(true);
              }}
              className="w-10 h-10 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all"
              aria-label="How points work"
            >
              <HelpCircleIcon size={20} className="text-black" />
            </button>
          </div>
        </header>

        {/* Title Banner */}
        <section className="w-full bg-[#FFB040] border-[3.5px] border-black rounded-2xl py-3.5 px-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-center relative">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-[#1A1A1A]">
            CAMEROON GCE PREP RANKING
          </h2>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-stone-900 mt-0.5">
            Compete Daily • Earn Mastery Points
          </p>
        </section>

        {/* User Ranking Highlight Card */}
        <section className="w-full bg-[#B6FF00] border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1.5 z-10 text-left">
            <span className="inline-flex items-center gap-1 bg-white text-black border-[2px] border-black rounded-full px-3 py-0.5 text-[11px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              <SparklesIcon size={14} className="text-amber-600" />
              <span>NATIONAL RANK #{userRank}</span>
            </span>
            <h3 className="text-2xl font-black uppercase tracking-tight text-black">
              {userName}
            </h3>
            <p className="text-xs font-extrabold text-stone-800">
              Ahead of 14,200 GCE candidates nationwide!
            </p>
          </div>

          <div className="flex flex-col items-center justify-center z-10">
            <div className="w-12 h-12 bg-[#FFB040] border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-1 rotate-[6deg]">
              <Award01Icon size={26} className="text-black" />
            </div>
            <span className="text-lg font-black text-black leading-none">{userPoints.toLocaleString()}</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-800">POINTS</span>
          </div>
        </section>

        {/* Podium Section (1st, 2nd, 3rd Place) */}
        <section className="w-full pt-4 pb-2">
          <h3 className="text-sm font-black uppercase tracking-wider text-stone-700 text-center mb-4">
            🏆 Top 3 GCE Prep Leaders
          </h3>

          <div className="flex items-end justify-center gap-3 max-w-xs mx-auto">
            {/* 2nd Place */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative w-14 h-14 rounded-full border-[3px] border-black overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-2 bg-[#FFB040]">
                <Image
                  src={topPodium[0].avatar}
                  alt={topPodium[0].name}
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <div className="w-full h-28 bg-stone-200 border-[3.5px] border-black rounded-2xl p-2 flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-3xl font-black text-black">2</span>
                <span className="text-[11px] font-black uppercase text-stone-800 truncate w-full text-center">
                  {topPodium[0].name}
                </span>
                <span className="text-[10px] font-bold text-stone-600">{topPodium[0].points} PTS</span>
              </div>
            </div>

            {/* 1st Place (Center - Tallest) */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative mb-2">
                <div className="w-16 h-16 rounded-full border-[3.5px] border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#B6FF00]">
                  <Image
                    src={topPodium[1].avatar}
                    alt={topPodium[1].name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFB040] border-[2px] border-black rounded-full p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Award01Icon size={16} className="text-black" />
                </div>
              </div>
              <div className="w-full h-36 bg-[#FFB040] border-[3.5px] border-black rounded-2xl p-2 flex flex-col items-center justify-center shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-4xl font-black text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">1</span>
                <span className="text-[12px] font-black uppercase text-white tracking-wider truncate w-full text-center drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                  {topPodium[1].name}
                </span>
                <span className="text-[10px] font-black text-stone-900">{topPodium[1].points} PTS</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative w-14 h-14 rounded-full border-[3px] border-black overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-2 bg-[#D3E2FF]">
                <Image
                  src={topPodium[2].avatar}
                  alt={topPodium[2].name}
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <div className="w-full h-24 bg-[#7A4711] text-white border-[3.5px] border-black rounded-2xl p-2 flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-2xl font-black text-white">3</span>
                <span className="text-[11px] font-extrabold uppercase text-stone-200 truncate w-full text-center">
                  {topPodium[2].name}
                </span>
                <span className="text-[10px] font-bold text-stone-200">{topPodium[2].points} PTS</span>
              </div>
            </div>
          </div>
        </section>

        {/* National Ranking List */}
        <section className="w-full space-y-3 pt-2">
          <h3 className="text-lg font-black uppercase tracking-tight text-[#1A1A1A] text-left pl-1">
            NATIONAL RANKINGS
          </h3>

          <div className="space-y-3">
            {nationalRankings.map((u) => (
              <div
                key={u.rank}
                className={`p-3.5 border-[3.5px] border-black rounded-2xl flex items-center justify-between shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-x-px active:translate-y-px active:shadow-none ${
                  u.isSelf ? "bg-[#B6FF00]" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xl font-black text-black w-6 text-center">
                    #{u.rank}
                  </span>
                  <div className="w-11 h-11 rounded-xl border-[2.5px] border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-stone-100 shrink-0">
                    <Image
                      src={u.avatar}
                      alt={u.name}
                      width={44}
                      height={44}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="font-black text-sm text-black leading-tight flex items-center gap-1.5">
                      <span>{u.name}</span>
                    </h4>
                    <p className="text-xs font-bold text-stone-700 leading-tight">
                      {u.school}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-black leading-none block">
                    {u.points.toLocaleString()}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-stone-600">
                    PTS
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/coming-soon")}
            className="w-full mt-4 bg-white hover:bg-stone-50 border-[3.5px] border-black rounded-2xl py-3.5 text-center font-black uppercase tracking-wider text-base shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-black"
          >
            VIEW FULL 500 RANKINGS
          </button>
        </section>
      </main>

      {/* How Leaderboard Points Work Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-spring-pop">
          <div className="w-full max-w-sm bg-[#FAF7EC] border-[4px] border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-[3px] border-black pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-[#FFB040] border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Award01Icon size={22} className="text-black" />
                </div>
                <h3 className="text-lg font-black uppercase text-black">
                  How Points Work
                </h3>
              </div>
              <button
                onClick={() => setShowHowItWorks(false)}
                className="w-8 h-8 bg-white border-[2.5px] border-black rounded-full flex items-center justify-center font-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
              >
                <Cancel01Icon size={16} className="text-black" />
              </button>
            </div>

            <p className="text-xs font-bold text-stone-700 leading-relaxed">
              The Leaderboard tracks your daily study effort and consistency across Cameroon! Here is how your points are earned:
            </p>

            <div className="space-y-3">
              <div className="bg-white border-[2.5px] border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                <div className="w-9 h-9 bg-[#B6FF00] border-[2px] border-black rounded-lg flex items-center justify-center shrink-0">
                  <FlashIcon size={20} className="text-black" />
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase text-black">AI Study Lessons</h4>
                  <p className="text-[11px] font-bold text-stone-600">+10 Points per lesson block completed</p>
                </div>
              </div>

              <div className="bg-white border-[2.5px] border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                <div className="w-9 h-9 bg-[#FFB040] border-[2px] border-black rounded-lg flex items-center justify-center shrink-0">
                  <FireIcon size={20} className="text-orange-600" />
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase text-black">Daily Streak Continuity</h4>
                  <p className="text-[11px] font-bold text-stone-600">+50 Points for every active streak day</p>
                </div>
              </div>

              <div className="bg-white border-[2.5px] border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                <div className="w-9 h-9 bg-[#D3E2FF] border-[2px] border-black rounded-lg flex items-center justify-center shrink-0">
                  <CheckmarkCircle02Icon size={20} className="text-black" />
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase text-black">Daily Quizzes & Past Papers</h4>
                  <p className="text-[11px] font-bold text-stone-600">+20 Points for scores above 70%</p>
                </div>
              </div>

              <div className="bg-white border-[2.5px] border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                <div className="w-9 h-9 bg-[#FFD9E0] border-[2px] border-black rounded-lg flex items-center justify-center shrink-0">
                  <Book01Icon size={20} className="text-black" />
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase text-black">Summaries Read</h4>
                  <p className="text-[11px] font-bold text-stone-600">+5 Points per summary review</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHowItWorks(false)}
              className="w-full bg-[#B6FF00] border-[3px] border-black rounded-xl py-2.5 font-black uppercase text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-black"
            >
              Got It!
            </button>
          </div>
        </div>
      )}

      <BottomNav items={navItems} />
    </div>
  );
}
