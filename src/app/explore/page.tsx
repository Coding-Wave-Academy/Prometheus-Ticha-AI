"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Book01Icon,
  File01Icon,
  HelpCircleIcon,
  PlusSignSquareIcon,
  Upload01Icon,
  PencilEdit01Icon,
  AiChat02Icon,
  Award01Icon,
  Search01Icon,
} from "hugeicons-react";
import { useNavItems } from "@/hooks/useNavItems";
import { useProfile } from "@/hooks/useProfile";
import { useNotifications } from "@/hooks/useNotifications";
import AppHeader from "@/components/layout/AppHeader";
import { DesktopPage, DesktopColumn } from "@/components/layout/AppShell";
import HubCardLink from "@/components/ui/HubCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ExploreSearch from "@/components/explore/ExploreSearch";
import LearningCard from "@/components/explore/LearningCard";
import LeaderboardCard from "@/components/explore/LeaderboardCard";
import BottomNav from "@/components/layout/BottomNav";
import { hapticTap } from "@/lib/haptics";
import { HubCard } from "@/types";
import "@/lib/i18n";
import { useStreak } from "@/hooks/useStreak";

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
  const { streakCount } = useStreak();

  // Web Core Learning Cards (3 columns)
  const webCoreCards: WebHubCard[] = [
    {
      id: "summaries",
      title: "Summaries",
      subtitle: "Study notes & bites",
      bgColor: "bg-card-sky",
      icon: <Book01Icon size={36} className="text-ink" />,
      route: "/summaries",
    },
    {
      id: "past-papers",
      title: "Past Papers",
      subtitle: "GCE & BACC exams",
      bgColor: "bg-card-peach",
      icon: <File01Icon size={36} className="text-ink" />,
      route: "/past-papers",
    },
    {
      id: "daily-quiz",
      title: "Daily Quiz",
      subtitle: "Test your knowledge with today's challenge!",
      bgColor: "bg-primary",
      icon: <HelpCircleIcon size={36} className="text-ink" />,
      route: "/dashboard/daily-quiz",
    },
  ];

  // Web Study Tools Cards (4 columns)
  const webStudyToolCards: WebHubCard[] = [
    {
      id: "flashcards",
      title: "Flashcards",
      subtitle: "Spaced memory decks",
      bgColor: "bg-card-orange",
      icon: <PlusSignSquareIcon size={30} className="text-ink" />,
      route: "/dashboard/flashcards",
    },
    {
      id: "upload-materials",
      title: "Upload Materials",
      subtitle: "Outlines, notes & PDFs",
      bgColor: "bg-primary",
      icon: <Upload01Icon size={30} className="text-ink" />,
      route: "/coming-soon",
    },
    {
      id: "practice",
      title: "Practice Drills",
      subtitle: "Topic exercises",
      bgColor: "bg-card-pink",
      icon: <PencilEdit01Icon size={30} className="text-ink" />,
      route: "/practice",
    },
    {
      id: "ai-tutor",
      title: "AI Practice Bot",
      subtitle: "Instant doubt solving",
      bgColor: "bg-card-sky",
      icon: <AiChat02Icon size={30} className="text-ink" />,
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
    bgColor: "bg-primary",
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
      bgColor: "bg-primary",
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
      <DesktopPage>
        <AppHeader
          variant="inline"
          userName={userName}
          avatarUrl={avatarUrl}
          streakCount={streakCount}
          unreadCount={unreadCount}
        />
        <DesktopColumn>
          <h1 className="mt-[34px] text-[27px] leading-none font-extrabold uppercase text-ink">
            Explore Hub
          </h1>

          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="mt-[19px] flex w-[650px] max-w-full h-[63px] bg-white border-2 border-ink rounded-[12px] shadow-[5px_5px_0_0_var(--color-ink)] overflow-hidden"
          >
            <label htmlFor="explore-search-desktop" className="sr-only">Search resources and topics</label>
            <span className="pl-[20px] pr-[14px] flex items-center text-ink/60" aria-hidden="true">
              <Search01Icon size={24} />
            </span>
            <input
              id="explore-search-desktop"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources, topics..."
              className="flex-1 min-w-0 bg-transparent text-[19px] text-ink placeholder:text-ink/55 outline-none"
            />
            <button
              type="submit"
              className="m-[2px] w-[120px] rounded-[9px] bg-brown text-white text-[15px] font-bold uppercase tracking-[0.02em] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
            >
              Search
            </button>
          </form>

          {filteredWebCore.length > 0 && (
            <section aria-labelledby="explore-core" className="mt-[44px]">
              <h2 id="explore-core" className="text-[22.5px] leading-none font-bold text-ink">Core Learning Hub</h2>
              <div className="mt-[16px] grid grid-cols-2 lg:grid-cols-[342fr_356fr_365fr] gap-x-[37px] gap-y-[24px]">
                {filteredWebCore.map((card) => (
                  <HubCardLink key={card.id} id={`web-core-${card.id}`} size="lg" href={card.route} title={card.title} subtitle={card.subtitle} icon={card.icon} tint={card.bgColor} />
                ))}
              </div>
            </section>
          )}

          {filteredWebTools.length > 0 && (
            <section aria-labelledby="explore-tools" className="mt-[42px]">
              <h2 id="explore-tools" className="text-[22.5px] leading-none font-bold text-ink">Flashcards &amp; Study Tools</h2>
              <div className="mt-[14px] grid grid-cols-2 lg:grid-cols-[254fr_252fr_262fr_277fr] gap-x-[31px] gap-y-[24px]">
                {filteredWebTools.map((card) => (
                  <HubCardLink key={card.id} id={`web-tool-${card.id}`} size="md" href={card.route} title={card.title} subtitle={card.subtitle} icon={card.icon} tint={card.bgColor} />
                ))}
              </div>
            </section>
          )}

          {isLeaderboardVisible && (
            <section aria-labelledby="explore-social" className="mt-[35px]">
              <h2 id="explore-social" className="text-[22.5px] leading-none font-bold text-ink">Social &amp; Competition</h2>
              <div className="mt-[16px]">
                <HubCardLink
                  id="web-leaderboard-banner"
                  size="banner"
                  href="/leaderboard"
                  title="Leaderboard"
                  subtitle="National & School Rankings"
                  icon={<Award01Icon size={30} className="text-ink" />}
                  tint="bg-card-orange"
                  decoration={<Award01Icon size={84} className="text-[#C9862A] opacity-40" />}
                />
              </div>
            </section>
          )}

          {filteredWebCore.length === 0 && filteredWebTools.length === 0 && !isLeaderboardVisible && (
            <p className="mt-10 text-[16px] text-muted" role="status">No resources match “{search}”.</p>
          )}
        </DesktopColumn>
      </DesktopPage>

      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE EXPLORE HUB (<768px)
          Original mobile layout completely preserved
       ═══════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden min-h-screen bg-[#FAF7EC] text-black antialiased font-sans pb-28 selection:bg-primary">
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
