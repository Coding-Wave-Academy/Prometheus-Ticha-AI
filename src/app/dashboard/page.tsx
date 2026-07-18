"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useNavItems } from "@/hooks/useNavItems";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StreakCalendar from "@/components/dashboard/StreakCalendar";
import QuickActions from "@/components/dashboard/QuickActions";
import FeaturedSubjects from "@/components/dashboard/FeaturedSubjects";
import RegionalUpdates from "@/components/dashboard/RegionalUpdates";
import BottomNav from "@/components/layout/BottomNav";
import FinishSetupModal from "@/components/dashboard/FinishSetupModal";
import { SubjectData, StreakDay, QuickAction } from "@/types";
import "@/lib/i18n";

// ─── Static data (replace with API calls once useAuth / useCourseProgress are wired up) ──

const streakDays: StreakDay[] = [
  { day: "S", active: true },
  { day: "M", active: true },
  { day: "T", active: false },
  { day: "W", active: false },
  { day: "TH", active: false },
  { day: "F", active: false },
  { day: "S", active: false },
];

const quickActions: QuickAction[] = [
  { name: "Daily Quiz", icon: "🔥", bgColor: "bg-[#FFB040]", badge: 3 },
  { name: "Summaries", icon: "⊞", bgColor: "bg-[#B6FF00]" },
  { name: "Past Papers", icon: "✏️", bgColor: "bg-[#D3E2FF]" },
  { name: "Practice", icon: "≡", bgColor: "bg-[#FFD9E0]" },
];

const featuredSubjects: SubjectData[] = [
  {
    id: "phys",
    category: "Sciences",
    title: "Physics",
    subtitle: "Electromagnetism & Quantum",
    progress: 82,
    bgColor: "bg-[#B6FF00]",
    icon: (
      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.636-6.364-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05 4.636 4.636" />
      </svg>
    ),
  },
  {
    id: "math",
    category: "Mathematics",
    title: "Pure Maths",
    subtitle: "Complex Numbers & Calculus",
    progress: 45,
    bgColor: "bg-[#D3E2FF]",
    icon: (
      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15M19.5 19.5l-15-15m0 15 15-15" />
      </svg>
    ),
  },
  {
    id: "ict",
    category: "Technology",
    title: "ICT",
    subtitle: "Networking Basics",
    progress: 94,
    bgColor: "bg-[#FFD9E0]",
    icon: (
      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    ),
  },
];

const regionalUpdates = [
  { id: "littoral-mock", title: "Littoral Region Mock dates released!", date: "May 12th, 2024" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudentDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const navItems = useNavItems();

  const [userName, setUserName] = useState("Amadou");
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  useEffect(() => {
    // Read dynamic user name configured in profile setup
    const savedName = localStorage.getItem("ticha_user_fullname");
    if (savedName) setUserName(savedName);

    // Open setup modal if ?showSetup=true query parameter is present
    if (searchParams.get("showSetup") === "true") {
      setIsSetupModalOpen(true);
    }
  }, [searchParams]);

  const currentLevel = "GCE A-Level";
  const streakCount = 12;
  const notificationCount = 3;

  return (
    <div className="min-h-screen bg-[#FAF7EC] text-black antialiased font-sans pb-28 selection:bg-[#B6FF00]">
      <main className="w-full max-w-md mx-auto p-4 pt-6 flex flex-col items-center">
        <DashboardHeader
          userName={userName}
          streakCount={streakCount}
          notificationCount={notificationCount}
          onNotificationClick={() => console.log("Notifications clicked")}
        />

        <StreakCalendar streakCount={streakCount} days={streakDays} />

        <QuickActions
          actions={quickActions}
          onAction={(name) => console.log("Quick action:", name)}
        />

        <FeaturedSubjects
          subjects={featuredSubjects}
          currentLevel={currentLevel}
          onSubjectClick={(id) => router.push(`/courses/${id}`)}
          onSeeMore={() => router.push("/courses")}
        />

        <RegionalUpdates
          updates={regionalUpdates}
          onUpdateClick={(id) => console.log("Update clicked:", id)}
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
