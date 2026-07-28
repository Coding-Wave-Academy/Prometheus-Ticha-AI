"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

const regionalUpdates = [
  { id: "littoral-mock", title: "Littoral Region Mock dates released!", date: "May 12th, 2024" },
];

function StudentDashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const navItems = useNavItems();

  const [userName, setUserName] = useState("Amadou");
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("ticha_user_fullname");
    if (savedName) setUserName(savedName.split(" ")[0]);

    // Check if new user signup or profile incomplete
    const profileCompleted = localStorage.getItem("ticha_profile_completed") === "true";
    const showSetupQuery = searchParams.get("showSetup") === "true";

    if (showSetupQuery || !profileCompleted) {
      setIsSetupModalOpen(true);
    }
  }, [searchParams]);

  const currentLevel = "GCE A-Level";
  const streakCount = 12;
  const notificationCount = 3;

  return (
    <div className="min-h-screen bg-[#FAF7EC] text-black antialiased font-sans pb-28 selection:bg-[#B6FF00]">
      <main className="w-full max-w-md mx-auto p-4 pt-6 flex flex-col items-center animate-page-in">
        <DashboardHeader
          userName={userName}
          streakCount={streakCount}
          notificationCount={notificationCount}
          onNotificationClick={() => router.push("/coming-soon")}
        />

        <StreakCalendar />

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

        <FeaturedSubjects
          subjects={featuredSubjects}
          currentLevel={currentLevel}
          onSubjectClick={(id) => router.push(`/courses/${id}`)}
          onSeeMore={() => router.push("/courses")}
        />

        <RegionalUpdates
          updates={regionalUpdates}
          onUpdateClick={() => router.push("/coming-soon")}
        />
      </main>

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
