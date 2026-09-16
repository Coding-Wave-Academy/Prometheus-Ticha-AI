"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Notification01Icon,
  FireIcon,
  Book01Icon,
  File01Icon,
  HelpCircleIcon,
  PlusSignSquareIcon,
  Upload01Icon,
  PencilEdit01Icon,
  AiChat02Icon,
  Award01Icon,
  ArrowRight01Icon,
} from "hugeicons-react";
import { useNavItems } from "@/hooks/useNavItems";
import { useProfile } from "@/hooks/useProfile";
import { useNotifications } from "@/hooks/useNotifications";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ExploreSearch from "@/components/explore/ExploreSearch";
import LearningCard from "@/components/explore/LearningCard";
import LeaderboardCard from "@/components/explore/LeaderboardCard";
import BottomNav from "@/components/layout/BottomNav";
import { hapticTap } from "@/lib/haptics";
import { HubCard } from "@/types";
import "@/lib/i18n";

interface WebHubCard {
  id: string;
  title: string;
  subtitle: string;
  bgColor: string;
  icon: React.ReactNode;
  route: string;
}

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 },
  },
};

export default function ExploreHubPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const navItems = useNavItems();
  const { profile } = useProfile();
  const { unreadCount } = useNotifications();
  const [search, setSearch] = useState("");

  const userName = profile?.full_name?.split(" ")[0] || "Student";
  const avatarUrl = profile?.avatar_url || null;
  const streakCount = profile?.streak_count ?? 0;

  // Web Core Learning Cards (3 columns)
  const webCoreCards: WebHubCard[] = [
    {
      id: "summaries",
      title: "Summaries",
      subtitle: "Study notes & bites",
      bgColor: "bg-[#D3E2FF]",
      icon: <Book01Icon size={24} className="text-black" />,
      route: "/summaries",
    },
    {
      id: "past-papers",
      title: "Past Papers",
      subtitle: "GCE & BACC exams",
      bgColor: "bg-[#FFE7D6]",
      icon: <File01Icon size={24} className="text-black" />,
      route: "/past-papers",
    },
    {
      id: "daily-quiz",
      title: "Daily Quiz",
      subtitle: "Test your knowledge with today's challenge!",
      bgColor: "bg-[#C8FF2A]",
      icon: <HelpCircleIcon size={24} className="text-black" />,
      route: "/dashboard/daily-quiz",
    },
  ];

  // Web Study Tools Cards (4 columns)
  const webStudyToolCards: WebHubCard[] = [
    {
      id: "flashcards",
      title: "Flashcards",
      subtitle: "Spaced memory decks",
      bgColor: "bg-[#FFB040]",
      icon: <PlusSignSquareIcon size={22} className="text-black" />,
      route: "/dashboard/flashcards",
    },
    {
      id: "upload-materials",
      title: "Upload Materials",
      subtitle: "Outlines, notes & PDFs",
      bgColor: "bg-[#C8FF2A]",
      icon: <Upload01Icon size={22} className="text-black" />,
      route: "/coming-soon",
    },
    {
      id: "practice",
      title: "Practice Drills",
      subtitle: "Topic exercises",
      bgColor: "bg-[#FFD6E7]",
      icon: <PencilEdit01Icon size={22} className="text-black" />,
      route: "/practice",
    },
    {
      id: "ai-tutor",
      title: "AI Practice Bot",
      subtitle: "Instant doubt solving",
      bgColor: "bg-[#D3E2FF]",
      icon: <AiChat02Icon size={22} className="text-black" />,
      route: "/dashboard/tutor",
    },
  ];

  // Search filtering logic for web cards
  const filterWebCards = (cards: WebHubCard[]) => {
    if (!search.trim()) return cards;
    const q = search.toLowerCase().trim();
    return cards.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q)
    );
  };

  const filteredWebCore = filterWebCards(webCoreCards);
  const filteredWebTools = filterWebCards(webStudyToolCards);
  const isLeaderboardVisible =
    !search.trim() ||
    "leaderboard".includes(search.toLowerCase().trim()) ||
    "rankings".includes(search.toLowerCase().trim());

  // Mobile data preserved
  const mobileCoreCards: HubCard[] = [
    {
      id: "summaries",
      title: "Summaries",
      subtitle: "Study notes & bites",
      bgColor: "bg-[#D3E2FF]",
      icon: <Book01Icon size={24} className="text-black" />,
    },
    {
      id: "past-papers",
      title: "Past Papers",
      subtitle: "GCE & BACC exams",
      bgColor: "bg-[#FFE5C4]",
      icon: <File01Icon size={24} className="text-black" />,
    },
  ];

  const mobileDailyQuizCard: HubCard = {
    id: "daily-quiz",
    title: "Daily Quiz",
    subtitle: "Test your knowledge with today's challenge!",
    bgColor: "bg-[#B6FF00]",
    large: true,
    icon: <HelpCircleIcon size={24} className="text-black" />,
  };

  const mobileStudyToolCards: HubCard[] = [
    {
      id: "flashcards",
      title: "Flashcards",
      subtitle: "Spaced memory decks",
      bgColor: "bg-[#FFB040]",
      icon: <PlusSignSquareIcon size={24} className="text-black" />,
    },
    {
      id: "upload-materials",
      title: "Upload Materials",
      subtitle: "Outlines, notes & PDFs",
      bgColor: "bg-[#B6FF00]",
      icon: <Upload01Icon size={24} className="text-black" />,
    },
    {
      id: "practice",
      title: "Practice Drills",
      subtitle: "Topic exercises",
      bgColor: "bg-[#FFD9E0]",
      icon: <PencilEdit01Icon size={24} className="text-black" />,
    },
    {
      id: "ai-tutor",
      title: "AI Practice Bot",
      subtitle: "Instant doubt solving",
      bgColor: "bg-[#D3E2FF]",
      icon: <AiChat02Icon size={24} className="text-black" />,
    },
  ];

  const handleMobileCardClick = (id: string) => {
    hapticTap();
    if (id === "daily-quiz") {
      router.push("/dashboard/daily-quiz");
      return;
    }
    const routes: Record<string, string> = {
      summaries: "/summaries",
      "past-papers": "/past-papers",
      flashcards: "/dashboard/flashcards",
      "upload-materials": "/coming-soon",
      practice: "/practice",
      "ai-tutor": "/dashboard/tutor",
    };
    router.push(routes[id] ?? "/coming-soon");
  };

  const filterMobileCards = (cards: HubCard[]) => {
    if (!search.trim()) return cards;
    const q = search.toLowerCase().trim();
    return cards.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q)
    );
  };

  const filteredMobileCore = filterMobileCards(mobileCoreCards);
  const filteredMobileTools = filterMobileCards(mobileStudyToolCards);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          WEB / TABLET EXPLORE HUB (md+ : >=768px)
          Full 2-column widescreen layout matching design/Ticha AI Web View - Explore.png
       ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex min-h-screen bg-[#FAF7EC]">
        {/* Persistent Left Sidebar */}
        <DashboardSidebar />

        {/* Main Explore Content */}
        <main className="flex-1 min-w-0 p-6 lg:p-10 select-none overflow-y-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-5xl mx-auto space-y-7"
          >
            {/* Top Web Header: Avatar + Greeting + Streak + Notification Bell */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full border-[3px] border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white flex items-center justify-center shrink-0">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={`${userName}'s profile`}
                      width={44}
                      height={44}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  ) : (
                    <span className="text-base font-black text-black leading-none">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <h1 className="text-xl lg:text-2xl font-black text-[#1A1A1A] leading-tight">
                  Hello, {userName} 👋
                </h1>
              </div>

              <div className="flex items-center gap-3">
                {/* Streak Pill */}
                <div className="bg-[#FFF8F1] border-[2.5px] border-black rounded-full py-1.5 px-4 flex items-center gap-2 shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] font-black text-sm">
                  <FireIcon size={18} className="text-[#FF882E]" />
                  <span className="text-black">{streakCount}</span>
                </div>

                {/* Notification Bell */}
                <button
                  id="web-explore-notifications"
                  onClick={() => {
                    hapticTap();
                    router.push("/dashboard/notifications");
                  }}
                  aria-label={`${unreadCount} notifications`}
                  className="relative w-11 h-11 bg-[#FFF8F1] hover:bg-stone-100 border-[2.5px] border-black rounded-full flex items-center justify-center shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all"
                >
                  <Notification01Icon size={20} className="text-black" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#FFB040] border-[2px] border-black rounded-full w-5 h-5 flex items-center justify-center font-black text-[10px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Title & Search Bar */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tight text-[#1A1A1A]">
                EXPLORE HUB
              </h2>
              <ExploreSearch
                value={search}
                onChange={setSearch}
                onSearch={() => {}}
              />
            </motion.div>

            {/* Section 1: Core Learning Hub (3 Large Cards) */}
            <motion.section variants={itemVariants} className="space-y-3.5">
              <h3 className="text-xl font-black text-[#1A1A1A] tracking-tight">
                Core Learning Hub
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {filteredWebCore.map((card) => (
                  <div
                    key={card.id}
                    id={`web-core-${card.id}`}
                    onClick={() => {
                      hapticTap();
                      router.push(card.route);
                    }}
                    className={`${card.bgColor} border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.01] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex flex-col justify-between min-h-[170px] relative overflow-hidden group`}
                  >
                    <div>
                      {/* Icon Circle */}
                      <div className="w-12 h-12 bg-white border-[2.5px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3 group-hover:scale-105 transition-transform">
                        {card.icon}
                      </div>

                      {/* Title & Subtitle */}
                      <h4 className="text-xl font-black text-black leading-tight tracking-tight">
                        {card.title}
                      </h4>
                      <p className="text-xs font-semibold text-stone-800 leading-snug mt-1">
                        {card.subtitle}
                      </p>
                    </div>

                    {/* Bottom-right Arrow Button */}
                    <div className="flex justify-end pt-2">
                      <div className="w-9 h-9 bg-white border-[2.5px] border-black rounded-full flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 transition-transform">
                        <ArrowRight01Icon size={18} className="text-black" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Section 2: Flashcards & Study Tools (4 Cards) */}
            <motion.section variants={itemVariants} className="space-y-3.5">
              <h3 className="text-xl font-black text-[#1A1A1A] tracking-tight">
                Flashcards & Study Tools
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredWebTools.map((card) => (
                  <div
                    key={card.id}
                    id={`web-tool-${card.id}`}
                    onClick={() => {
                      hapticTap();
                      router.push(card.route);
                    }}
                    className={`${card.bgColor} border-[3px] border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.01] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex flex-col justify-between min-h-[150px] relative overflow-hidden group`}
                  >
                    <div>
                      {/* Icon Circle */}
                      <div className="w-10 h-10 bg-white border-[2px] border-black rounded-full flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] mb-2.5 group-hover:scale-105 transition-transform">
                        {card.icon}
                      </div>

                      {/* Title & Subtitle */}
                      <h4 className="text-base font-black text-black leading-tight tracking-tight">
                        {card.title}
                      </h4>
                      <p className="text-[11px] font-semibold text-stone-800 leading-snug mt-0.5 line-clamp-2">
                        {card.subtitle}
                      </p>
                    </div>

                    {/* Bottom-right Arrow Button */}
                    <div className="flex justify-end pt-2">
                      <div className="w-7 h-7 bg-white border-[2px] border-black rounded-full flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-0.5 transition-transform">
                        <ArrowRight01Icon size={14} className="text-black" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Section 3: Social & Competition (Full-Width Banner) */}
            {isLeaderboardVisible && (
              <motion.section variants={itemVariants} className="space-y-3.5 pt-1">
                <h3 className="text-xl font-black text-[#1A1A1A] tracking-tight">
                  Social & Competition
                </h3>
                <div
                  id="web-leaderboard-banner"
                  onClick={() => {
                    hapticTap();
                    router.push("/leaderboard");
                  }}
                  className="w-full bg-[#FFB040] border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.005] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center justify-between relative overflow-hidden group"
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-white border-[2.5px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0 group-hover:scale-105 transition-transform">
                      <Award01Icon size={24} className="text-black" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-black leading-tight tracking-tight">
                        Leaderboard
                      </h4>
                      <p className="text-xs font-semibold text-stone-900 leading-tight mt-0.5">
                        National & School Rankings
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Trophy SVG Graphic Watermark + Action Arrow */}
                  <div className="flex items-center gap-6 relative z-10">
                    {/* Decorative Trophy Outline */}
                    <div className="hidden sm:block opacity-25 group-hover:opacity-40 transition-opacity">
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="text-amber-900">
                        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V18H8v2h8v-2h-3v-2.1c2.16-.4 3.84-2.11 4.39-4.36C19.85 11.23 21 9.25 21 7V6c0-1.1-.9-1-2-1zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" fill="currentColor" />
                      </svg>
                    </div>

                    <div className="w-10 h-10 bg-white border-[2.5px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 transition-transform shrink-0">
                      <ArrowRight01Icon size={20} className="text-black" />
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </motion.div>
        </main>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE EXPLORE HUB (<768px)
          Original mobile layout completely preserved
       ═══════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden min-h-screen bg-[#FAF7EC] text-black antialiased font-sans pb-28 selection:bg-[#B6FF00]">
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md mx-auto p-4 pt-6 flex flex-col items-start"
        >
          {/* Mobile Header */}
          <motion.div variants={itemVariants} className="w-full">
            <DashboardHeader
              userName={userName}
              avatarUrl={avatarUrl}
              streakCount={streakCount}
              notificationCount={unreadCount}
              onNotificationClick={() => {
                hapticTap();
                router.push("/dashboard/notifications");
              }}
            />
          </motion.div>

          {/* Explore Hub title + Search */}
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
              {filteredMobileCore.map((card) => (
                <LearningCard
                  key={card.id}
                  card={card}
                  onClick={handleMobileCardClick}
                />
              ))}
            </div>
            {(!search ||
              mobileDailyQuizCard.title
                .toLowerCase()
                .includes(search.toLowerCase())) && (
              <LearningCard
                card={mobileDailyQuizCard}
                onClick={handleMobileCardClick}
              />
            )}
          </motion.section>

          {/* Study Tools & Flashcards */}
          <motion.section variants={itemVariants} className="w-full mb-8">
            <h3 className="text-xl font-black text-[#1A1A1A] tracking-tight mb-4 pl-1">
              Flashcards & Study Tools
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {filteredMobileTools.map((card) => (
                <LearningCard
                  key={card.id}
                  card={card}
                  onClick={handleMobileCardClick}
                />
              ))}
            </div>
          </motion.section>

          {/* Social & Competition */}
          <motion.section variants={itemVariants} className="w-full mb-4 space-y-4">
            <h3 className="text-xl font-black text-[#1A1A1A] tracking-tight pl-1">
              {t("explore.socialCompetition")}
            </h3>
            <LeaderboardCard
              onClick={() => {
                hapticTap();
                router.push("/leaderboard");
              }}
            />
          </motion.section>
        </motion.main>

        <BottomNav items={navItems} />
      </div>
    </>
  );
}
