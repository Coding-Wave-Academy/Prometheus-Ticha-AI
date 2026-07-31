"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Award01Icon,
  File01Icon,
  Book01Icon,
  Upload01Icon,
  FlashIcon,
  SquareIcon,
  ComputerIcon,
  Globe02Icon,
  CheckmarkCircle02Icon,
} from "hugeicons-react";
import { useNavItems } from "@/hooks/useNavItems";
import { useProfile } from "@/hooks/useProfile";
import { useNotifications } from "@/hooks/useNotifications";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StreakCalendar from "@/components/dashboard/StreakCalendar";
import QuickActions from "@/components/dashboard/QuickActions";
import FeaturedSubjects from "@/components/dashboard/FeaturedSubjects";
import UpgradeCard from "@/components/dashboard/UpgradeCard";
import BottomNav from "@/components/layout/BottomNav";
import FinishSetupModal from "@/components/dashboard/FinishSetupModal";
import PWAInstaller from "@/components/layout/PWAInstaller";
import { SubjectData, QuickAction } from "@/types";
import "@/lib/i18n";

const quickActions: QuickAction[] = [
  {
    name: "Daily Lessons",
    icon: <Award01Icon size={24} className="text-black" />,
    bgColor: "bg-[#FFB040]",
    badge: 1,
  },
  {
    name: "Summaries",
    icon: <Book01Icon size={24} className="text-black" />,
    bgColor: "bg-[#B6FF00]",
  },
  {
    name: "Past Papers",
    icon: <File01Icon size={24} className="text-black" />,
    bgColor: "bg-[#D3E2FF]",
  },
  {
    name: "Upload",
    icon: <Upload01Icon size={24} className="text-black" />,
    bgColor: "bg-[#FFD9E0]",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 20,
    },
  },
};

export default function StudentDashboardPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FAF7EC]" />}>
      <StudentDashboardPageContent />
    </React.Suspense>
  );
}

function StudentDashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const navItems = useNavItems();
  const { profile, isLoading } = useProfile();
  const { unreadCount } = useNotifications();

  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [dynamicFeaturedSubjects, setDynamicFeaturedSubjects] = useState<SubjectData[]>([]);

  useEffect(() => {
    // Read struggles from localStorage or profile vector
    let struggles: string[] = ["physics", "math", "ict"];
    if (typeof window !== "undefined") {
      const storedStruggles = localStorage.getItem("ticha_onboarding_struggles");
      if (storedStruggles) {
        try {
          const parsed = JSON.parse(storedStruggles);
          if (Array.isArray(parsed) && parsed.length > 0) {
            struggles = parsed;
          }
        } catch {
          // ignore error
        }
      }
    }

    // Helper to get real stored progress (defaults to 0% for weak subjects until student completes lessons)
    const getProgress = (subjectKey: string): number => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(`ticha_progress_${subjectKey.toLowerCase()}`);
        if (stored) return Math.min(100, Number(stored));
      }
      return 0; // 0% initial progress for new users!
    };

    const subjectMap: Record<string, SubjectData> = {
      physics: {
        id: "phys",
        category: "Sciences",
        title: "Physics",
        subtitle: "Electromagnetism & Quantum Physics",
        progress: getProgress("physics"),
        bgColor: "bg-[#FFB040]",
        icon: <FlashIcon size={24} className="text-black" />,
      },
      math: {
        id: "math",
        category: "Mathematics",
        title: "Pure Maths",
        subtitle: "Complex Numbers & Calculus Limits",
        progress: getProgress("pure mathematics"),
        bgColor: "bg-[#B6FF00]",
        icon: <SquareIcon size={24} className="text-black" />,
      },
      ict: {
        id: "ict",
        category: "Technology",
        title: "ICT & Computing",
        subtitle: "Database Normalization & Networks",
        progress: getProgress("ict"),
        bgColor: "bg-[#FFDF9E]",
        icon: <ComputerIcon size={24} className="text-black" />,
      },
      chemistry: {
        id: "chem",
        category: "Sciences",
        title: "Chemistry",
        subtitle: "Organic Reactions & Energetics",
        progress: getProgress("chemistry"),
        bgColor: "bg-[#D3E2FF]",
        icon: <CheckmarkCircle02Icon size={24} className="text-black" />,
      },
      biology: {
        id: "bio",
        category: "Sciences",
        title: "Biology",
        subtitle: "Genetics & Cell Structure",
        progress: getProgress("biology"),
        bgColor: "bg-[#FFD9E0]",
        icon: <Award01Icon size={24} className="text-black" />,
      },
      english: {
        id: "eng",
        category: "Arts",
        title: "English Language",
        subtitle: "Essay Structure & Comprehension",
        progress: getProgress("english"),
        bgColor: "bg-[#E2D3FF]",
        icon: <Book01Icon size={24} className="text-black" />,
      },
      french: {
        id: "fr",
        category: "Arts",
        title: "French Language",
        subtitle: "Grammar & Expression Écrite",
        progress: getProgress("french"),
        bgColor: "bg-[#A8FFD3]",
        icon: <Globe02Icon size={24} className="text-black" />,
      },
    };

    const mapped = struggles
      .map((s) => subjectMap[s.toLowerCase()])
      .filter(Boolean);

    if (mapped.length > 0) {
      setDynamicFeaturedSubjects(mapped);
    } else {
      setDynamicFeaturedSubjects([
        subjectMap.physics,
        subjectMap.math,
        subjectMap.ict,
      ]);
    }
  }, [profile]);

  // Show setup modal if profile is not completed
  useEffect(() => {
    if (isLoading) return;
    const showSetupQuery = searchParams.get("showSetup") === "true";
    if (showSetupQuery || !profile?.profile_completed) {
      setIsSetupModalOpen(true);
    }
  }, [searchParams, isLoading, profile?.profile_completed]);

  const userName = profile?.full_name?.split(" ")[0] || "Student";
  const avatarUrl = profile?.avatar_url || null;
  const streakCount = profile?.streak_count ?? 0; // 0 for new users
  const currentLevel = profile?.education_level === "ol" ? "GCE O-Level" : "GCE A-Level";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center">
        <div className="w-10 h-10 border-[3.5px] border-black border-t-[#B6FF00] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7EC] text-black antialiased font-sans pb-28 selection:bg-[#B6FF00]">
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md mx-auto p-4 pt-6 flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="w-full">
          <PWAInstaller />
          <DashboardHeader
            userName={userName}
            avatarUrl={avatarUrl}
            streakCount={streakCount}
            notificationCount={unreadCount}
            onNotificationClick={() => router.push("/dashboard/notifications")}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <StreakCalendar />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <QuickActions
            actions={quickActions}
            onAction={(name) => {
              if (name === "Daily Lessons") {
                router.push("/dashboard/daily-lessons");
              } else if (name === "Summaries") {
                router.push("/summaries");
              } else if (name === "Past Papers") {
                router.push("/past-papers");
              } else {
                router.push("/practice");
              }
            }}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <FeaturedSubjects
            subjects={dynamicFeaturedSubjects}
            currentLevel={currentLevel}
            onSubjectClick={(id) => {
              const slugMap: Record<string, string> = {
                phys: "physics",
                math: "math",
                ict: "ict",
                chem: "chemistry",
                bio: "biology",
                eng: "english",
                fr: "french",
              };
              router.push(`/dashboard/subjects/${slugMap[id] || id}`);
            }}
            onSeeMore={() => router.push("/dashboard/subjects")}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <UpgradeCard onUpgradeClick={() => router.push("/coming-soon")} />
        </motion.div>
      </motion.main>

      <FinishSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
      />

      <BottomNav items={navItems} />
    </div>
  );
}
