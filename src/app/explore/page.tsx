"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FireIcon } from "hugeicons-react";
import { useNavItems } from "@/hooks/useNavItems";
import { useProfile } from "@/hooks/useProfile";
import ExploreSearch from "@/components/explore/ExploreSearch";
import LearningCard from "@/components/explore/LearningCard";
import LeaderboardCard from "@/components/explore/LeaderboardCard";
import BottomNav from "@/components/layout/BottomNav";
import { HubCard } from "@/types";
import "@/lib/i18n";

const coreCards: HubCard[] = [
  {
    id: "summaries",
    title: "Summaries",
    subtitle: "Study notes & bites",
    bgColor: "bg-[#D3E2FF]",
    icon: (
      <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    id: "past-papers",
    title: "Past Papers",
    subtitle: "GCE & BACC exams",
    bgColor: "bg-[#FFE5C4]",
    icon: (
      <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
];

const dailyQuizCard: HubCard = {
  id: "daily-quiz",
  title: "Daily Quiz",
  subtitle: "Test your knowledge with today's challenge!",
  bgColor: "bg-[#B6FF00]",
  large: true,
  icon: (
    <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  ),
};

const studyToolCards: HubCard[] = [
  {
    id: "flashcards",
    title: "Flashcards",
    subtitle: "Spaced memory decks",
    bgColor: "bg-[#FFB040]",
    icon: (
      <svg className="w-7 h-7 text-black fill-current" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
      </svg>
    ),
  },
  {
    id: "upload-materials",
    title: "Upload Materials",
    subtitle: "Outlines, notes & PDFs",
    bgColor: "bg-[#B6FF00]",
    icon: (
      <svg className="w-7 h-7 text-black stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    id: "practice",
    title: "Practice Drills",
    subtitle: "Topic exercises",
    bgColor: "bg-[#FFD9E0]",
    icon: (
      <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      </svg>
    ),
  },
  {
    id: "ai-tutor",
    title: "AI Practice Bot",
    subtitle: "Instant doubt solving",
    bgColor: "bg-[#D3E2FF]",
    icon: (
      <svg className="w-7 h-7 text-black fill-current" viewBox="0 0 24 24">
        <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 110 2h-1v1a3 3 0 01-3 3H7a3 3 0 01-3-3v-1H3a1 1 0 110-2h1a7 7 0 017-7h1V5.73A2.001 2.001 0 0112 2z" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 20 },
  },
};

export default function ExploreHubPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const navItems = useNavItems();
  const { profile } = useProfile();
  const [search, setSearch] = useState("");

  const userName = profile?.full_name?.split(" ")[0] || "Student";
  const avatarUrl = profile?.avatar_url || null;
  const streakCount = profile?.streak_count ?? 0;

  const handleCardClick = (id: string) => {
    if (id === "daily-quiz") {
      router.push("/dashboard/daily-lessons");
      return;
    }
    const routes: Record<string, string> = {
      summaries: "/summaries",
      "past-papers": "/past-papers",
      flashcards: "/coming-soon",
      "upload-materials": "/coming-soon",
      practice: "/practice",
      "ai-tutor": "/dashboard/tutor",
    };
    router.push(routes[id] ?? "/coming-soon");
  };

  const filterCards = (cards: HubCard[]) => {
    if (!search.trim()) return cards;
    const q = search.toLowerCase().trim();
    return cards.filter(
      (c) => c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q)
    );
  };

  const filteredCore = filterCards(coreCards);
  const filteredTools = filterCards(studyToolCards);

  return (
    <div className="min-h-screen bg-[#FAF7EC] text-black antialiased font-sans pb-28 selection:bg-[#B6FF00]">
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md mx-auto p-4 pt-6 flex flex-col items-start"
      >
        {/* Dynamic Header matching Dashboard Header */}
        <motion.header variants={itemVariants} className="flex items-center justify-between w-full mb-8">
          <div
            onClick={() => router.push("/dashboard/profile")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full border-[3px] border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 bg-[#B6FF00]">
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
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-[#1A1A1A] leading-tight group-hover:underline">
                {userName}
              </h1>
              <p className="text-xs font-bold uppercase text-stone-600">Explore Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/dashboard")}
              aria-label={`${streakCount} day streak`}
              className="bg-[#B6FF00] border-[2.5px] border-black rounded-full py-1.5 px-3 font-extrabold text-xs text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 active:scale-95 transition-all"
            >
              <FireIcon size={16} className="text-orange-600 animate-pulse" />
              <span>{streakCount}</span>
            </button>

            <button
              id="explore-notifications"
              onClick={() => router.push("/coming-soon")}
              aria-label="3 notifications"
              className="relative w-11 h-11 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            >
              <svg className="w-6 h-6 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute -top-1 -right-1.5 bg-[#FFB040] border-[2px] border-black rounded-full w-6 h-6 flex items-center justify-center font-black text-xs shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                3
              </span>
            </button>
          </div>
        </motion.header>

        {/* Explore Hub title + Dynamic Working Search */}
        <motion.section variants={itemVariants} className="w-full mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[#1A1A1A] mb-5">
            {t("explore.hubTitle")}
          </h2>
          <ExploreSearch
            value={search}
            onChange={setSearch}
            onSearch={() => {}}
          />
        </motion.section>

        {/* Core Learning Hub */}
        <motion.section variants={itemVariants} className="w-full mb-8 space-y-4">
          <h3 className="text-xl font-black text-[#1A1A1A] tracking-tight pl-1">
            {t("explore.coreLearning")}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {filteredCore.map((card) => (
              <LearningCard key={card.id} card={card} onClick={handleCardClick} />
            ))}
          </div>
          {(!search || dailyQuizCard.title.toLowerCase().includes(search.toLowerCase())) && (
            <LearningCard card={dailyQuizCard} onClick={handleCardClick} />
          )}
        </motion.section>

        {/* Study Tools & Flashcards */}
        <motion.section variants={itemVariants} className="w-full mb-8">
          <h3 className="text-xl font-black text-[#1A1A1A] tracking-tight mb-4 pl-1">
            Flashcards & Study Tools
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {filteredTools.map((card) => (
              <LearningCard key={card.id} card={card} onClick={handleCardClick} />
            ))}
          </div>
        </motion.section>

        {/* Social & Competition */}
        <motion.section variants={itemVariants} className="w-full mb-4 space-y-4">
          <h3 className="text-xl font-black text-[#1A1A1A] tracking-tight pl-1">
            {t("explore.socialCompetition")}
          </h3>
          <LeaderboardCard onClick={() => router.push("/leaderboard")} />
        </motion.section>
      </motion.main>

      <BottomNav items={navItems} />
    </div>
  );
}
