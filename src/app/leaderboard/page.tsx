"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";

interface RankingUser {
  rank: number;
  name: string;
  school: string;
  points: string;
  avatar: string;
  isSelf?: boolean;
}

const nationalRankings: RankingUser[] = [
  {
    rank: 4,
    name: "Chidi Okoro",
    school: "GBHS Molyko",
    points: "2,420",
    avatar: "/images/amadou-avatar.png",
  },
  {
    rank: 5,
    name: "Marie Eboa",
    school: "Lycée Joss",
    points: "2,380",
    avatar: "/images/madame-ticha.png",
  },
  {
    rank: 9,
    name: "Amadou",
    school: "GHS Limbe",
    points: "1,850",
    avatar: "/images/amadou-avatar.png",
    isSelf: true,
  },
];

export default function LeaderboardsPage() {
  const router = useRouter();
  const navItems = useNavItems();

  return (
    <div className="min-h-screen bg-[#FAF7EC] text-black antialiased font-sans pb-28 selection:bg-[#B6FF00]">
      <main className="w-full max-w-md mx-auto p-4 pt-6 flex flex-col space-y-6">

        {/* Header Bar */}
        <header className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-[3px] border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[#B6FF00] shrink-0">
              <Image
                src="/images/amadou-avatar.png"
                alt="Amadou profile"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#1A1A1A] leading-tight flex items-center gap-1.5">
              <span>Hello, Amadou</span>
              <svg className="w-5 h-5 fill-current text-amber-600 inline" viewBox="0 0 24 24">
                <path d="M22 14c0 1.1-.9 2-2 2h-1v-4h1c1.1 0 2 .9 2 2zm-4-7c0-1.1-.9-2-2-2h-3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2V7zm-8 4c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-6z" />
              </svg>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Streak Badge */}
            <div className="bg-[#FAF7EC] border-[2.5px] border-black rounded-full py-1 px-3 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-sm">
              <svg className="w-4 h-4 fill-current text-orange-600" viewBox="0 0 24 24">
                <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.6 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-5.52-4.5-9.33-6.5-13.33z" />
              </svg>
              <span>1</span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => router.push("/coming-soon")}
              aria-label="3 notifications"
              className="relative w-10 h-10 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all"
            >
              <svg className="w-5 h-5 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-[#FFB040] border-[2px] border-black rounded-full w-5 h-5 flex items-center justify-center font-black text-[10px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                3
              </span>
            </button>
          </div>
        </header>

        {/* Title Banner */}
        <section className="w-full bg-[#FFB040] border-[3.5px] border-black rounded-2xl py-3.5 px-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-center">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-[#1A1A1A]">
            TICHA PREP EXAM RANKING
          </h2>
        </section>

        {/* User Ranking Highlight Card */}
        <section className="w-full bg-[#B6FF00] border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1.5 z-10">
            <span className="inline-flex items-center gap-1 bg-[#85BE00] text-black border-[2px] border-black rounded-full px-3 py-0.5 text-[11px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              <svg className="w-3.5 h-3.5 fill-current text-black" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>TOP 1% DAILY</span>
            </span>
            <h3 className="text-2xl font-black uppercase tracking-tight text-black">
              Ranking #9
            </h3>
            <p className="text-xs font-extrabold text-stone-800">
              You&apos;re ahead of 12,400 students!
            </p>
          </div>

          <div className="flex flex-col items-center justify-center z-10">
            <div className="w-12 h-12 bg-[#FFB040] border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-1 rotate-[6deg]">
              <svg className="w-7 h-7 text-black fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
            <span className="text-lg font-black text-black leading-none">1,850</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-800">POINTS</span>
          </div>
        </section>

        {/* Podium Section (1st, 2nd, 3rd Place) */}
        <section className="w-full pt-6 pb-2">
          <div className="flex items-end justify-center gap-3 max-w-xs mx-auto">
            {/* 2nd Place */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative w-14 h-14 rounded-full border-[3px] border-black overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-2 bg-[#FFB040]">
                <Image
                  src="/images/amadou-avatar.png"
                  alt="Amadou B."
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <div className="w-full h-28 bg-stone-200 border-[3.5px] border-black rounded-2xl p-2 flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-3xl font-black text-black">2</span>
                <span className="text-[11px] font-extrabold uppercase text-stone-700 truncate w-full text-center">
                  AMADOU B.
                </span>
              </div>
            </div>

            {/* 1st Place (Center - Tallest) */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative mb-2">
                <div className="w-16 h-16 rounded-full border-[3.5px] border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#B6FF00]">
                  <Image
                    src="/images/madame-ticha.png"
                    alt="Sarah K."
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFB040] border-[2px] border-black rounded-full p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
              </div>
              <div className="w-full h-36 bg-[#FFB040] border-[3.5px] border-black rounded-2xl p-2 flex flex-col items-center justify-center shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-4xl font-black text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">1</span>
                <span className="text-[12px] font-black uppercase text-white tracking-wider truncate w-full text-center drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                  SARAH K.
                </span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative w-14 h-14 rounded-full border-[3px] border-black overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-2 bg-[#D3E2FF]">
                <Image
                  src="/images/amadou-avatar.png"
                  alt="Jean P."
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <div className="w-full h-24 bg-[#7A4711] text-white border-[3.5px] border-black rounded-2xl p-2 flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-2xl font-black text-white">3</span>
                <span className="text-[11px] font-extrabold uppercase text-stone-200 truncate w-full text-center">
                  JEAN P.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* National Ranking List */}
        <section className="w-full space-y-3 pt-2">
          <h3 className="text-lg font-black uppercase tracking-tight text-[#1A1A1A] pl-1">
            NATIONAL RANKING
          </h3>

          <div className="space-y-3">
            {nationalRankings.map((user) => (
              <div
                key={user.rank}
                className={`p-3.5 border-[3.5px] border-black rounded-2xl flex items-center justify-between shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-x-px active:translate-y-px active:shadow-none ${
                  user.isSelf ? "bg-[#FFE8C4]" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xl font-black text-black w-6 text-center">
                    {user.rank}
                  </span>
                  <div className="w-11 h-11 rounded-xl border-[2.5px] border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-stone-100 shrink-0">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={44}
                      height={44}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-black leading-tight">
                      {user.name}
                    </h4>
                    <p className="text-xs font-bold text-stone-600 leading-tight">
                      {user.school}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-black leading-none block">
                    {user.points}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-stone-500">
                    PTS
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/coming-soon")}
            className="w-full mt-4 bg-white hover:bg-stone-50 border-[3.5px] border-black rounded-2xl py-3.5 text-center font-black uppercase tracking-wider text-base shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            SEE FULL LEADERBOARD
          </button>
        </section>

      </main>

      <BottomNav items={navItems} />
    </div>
  );
}
