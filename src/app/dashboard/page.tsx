"use client";

export const dynamic = "force-dynamic";

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
  {
    name: "Daily Quiz",
    icon: (
      <svg className="w-6 h-6 fill-current text-black" viewBox="0 0 24 24">
        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V18H8v2h8v-2h-3v-2.1c2.16-.4 3.84-2.11 4.39-4.36C19.85 11.23 21 9.25 21 7V6c0-1.1-.9-1-2-1zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
      </svg>
    ),
    bgColor: "bg-[#FFB040]",
    badge: 3,
  },
  {
    name: "Summaries",
    icon: (
      <svg className="w-6 h-6 fill-current text-black" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    ),
    bgColor: "bg-[#B6FF00]",
  },
  {
    name: "Past Papers",
    icon: (
      <svg className="w-6 h-6 fill-current text-black" viewBox="0 0 24 24">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
      </svg>
    ),
    bgColor: "bg-[#D3E2FF]",
  },
  {
    name: "Practice",
    icon: (
      <svg className="w-6 h-6 stroke-[2.5] text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.037-.501.087-.75.15m.75-.15a15.228 15.228 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.037.501.087.75.15M3 17.25h18" />
      </svg>
    ),
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
    icon: (
      <svg className="w-6 h-6 text-black stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
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
      <svg className="w-6 h-6 text-black fill-current" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
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
      <svg className="w-6 h-6 text-black fill-current" viewBox="0 0 24 24">
        <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
      </svg>
    ),
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

        <StreakCalendar streakCount={streakCount} days={streakDays} />

        <QuickActions
          actions={quickActions}
          onAction={(name) => {
            if (name === "Daily Quiz") {
              router.push("/dashboard/quiz-generator");
            } else {
              router.push("/coming-soon");
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
