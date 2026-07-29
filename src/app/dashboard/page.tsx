"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
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
} from "hugeicons-react";
import { useNavItems } from "@/hooks/useNavItems";
import { useProfile } from "@/hooks/useProfile";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StreakCalendar from "@/components/dashboard/StreakCalendar";
import QuickActions from "@/components/dashboard/QuickActions";
import FeaturedSubjects from "@/components/dashboard/FeaturedSubjects";
import RegionalUpdates from "@/components/dashboard/RegionalUpdates";
import BottomNav from "@/components/layout/BottomNav";
import FinishSetupModal from "@/components/dashboard/FinishSetupModal";
import { SubjectData, QuickAction } from "@/types";
import "@/lib/i18n";

const quickActions: QuickAction[] = [
  {
    name: "Daily Quiz",
    icon: <Award01Icon size={24} className="text-black" />,
    bgColor: "bg-[#FFB040]",
    badge: 3,
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

const featuredSubjects: SubjectData[] = [
  {
    id: "phys",
    category: "Sciences",
    title: "Physics",
    subtitle: "Electromagnetism & Quantum",
    progress: 82,
    bgColor: "bg-[#B6FF00]",
    icon: <FlashIcon size={24} className="text-black" />,
  },
  {
    id: "math",
    category: "Mathematics",
    title: "Pure Maths",
    subtitle: "Complex Numbers & Calculus",
    progress: 45,
    bgColor: "bg-[#D3E2FF]",
    icon: <SquareIcon size={24} className="text-black" />,
  },
  {
    id: "ict",
    category: "Technology",
    title: "ICT",
    subtitle: "Networking Basics",
    progress: 94,
    bgColor: "bg-[#FFD9E0]",
    icon: <ComputerIcon size={24} className="text-black" />,
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

function StudentDashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const navItems = useNavItems();
  const { profile, isLoading } = useProfile();

  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  const regionName = profile?.region ? profile.region.charAt(0).toUpperCase() + profile.region.slice(1) : "Littoral";
  const regionalUpdates = [
    { id: "regional-mock", title: `${regionName} Region GCE Mock Schedule & Updates`, date: "Updated Live" },
  ];

  // Show setup modal if profile is not completed
  React.useEffect(() => {
    if (isLoading) return;
    const showSetupQuery = searchParams.get("showSetup") === "true";
    if (showSetupQuery || !profile?.profile_completed) {
      setIsSetupModalOpen(true);
    }
  }, [searchParams, isLoading, profile?.profile_completed]);

  const userName = profile?.full_name?.split(" ")[0] || "Student";
  const avatarUrl = profile?.avatar_url || null;
  const streakCount = profile?.streak_count || 1;
  const currentLevel = profile?.education_level === "ol" ? "GCE O-Level" : "GCE A-Level";
  const notificationCount = 3;

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
          <DashboardHeader
            userName={userName}
            avatarUrl={avatarUrl}
            streakCount={streakCount}
            notificationCount={notificationCount}
            onNotificationClick={() => router.push("/coming-soon")}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <StreakCalendar />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <QuickActions
            actions={quickActions}
            onAction={(name) => {
              if (name === "Daily Quiz") {
                router.push("/dashboard/quiz-generator");
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
            subjects={featuredSubjects}
            currentLevel={currentLevel}
            onSubjectClick={(id) => router.push(`/courses/${id}`)}
            onSeeMore={() => router.push("/courses")}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <RegionalUpdates
            updates={regionalUpdates}
            onUpdateClick={() => router.push("/coming-soon")}
          />
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

export default function StudentDashboardPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FAF7EC]" />}>
      <StudentDashboardPageContent />
    </React.Suspense>
  );
}
