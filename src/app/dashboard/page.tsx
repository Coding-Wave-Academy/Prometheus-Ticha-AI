"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useNavItems } from "@/hooks/useNavItems";
import { useFeaturedSubjects } from "@/hooks/useFeaturedSubjects";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StreakCalendar from "@/components/dashboard/StreakCalendar";
import QuickActions from "@/components/dashboard/QuickActions";
import FeaturedSubjects from "@/components/dashboard/FeaturedSubjects";
import RegionalUpdates from "@/components/dashboard/RegionalUpdates";
import BottomNav from "@/components/layout/BottomNav";
import FinishSetupModal from "@/components/dashboard/FinishSetupModal";
import { StreakDay, QuickAction } from "@/types";
import { supabase } from "@/lib/supabase";
import "@/lib/i18n";

// ─── Static data ──────────────────────────────────────────────────────────────

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

const regionalUpdates = [
  { id: "littoral-mock", title: "Littoral Region Mock dates released!", date: "May 12th, 2024" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

function StudentDashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const navItems = useNavItems();

  const [userName, setUserName] = useState("Student");
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [educationLevel, setEducationLevel] = useState("GCE A-Level");

  // Get authenticated userId for backend calls
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem("ticha_user_fullname");
    if (savedName) setUserName(savedName);

    const savedAvatar = localStorage.getItem("ticha_user_avatar");
    if (savedAvatar) setAvatar(savedAvatar);

    const savedEd = localStorage.getItem("ticha_onboarding_education");
    if (savedEd) {
      const levelMap: Record<string, string> = {
        ol: "GCE O-Level",
        al: "GCE A-Level",
        university: "University",
      };
      setEducationLevel(levelMap[savedEd] || "GCE A-Level");
    }

    if (searchParams.get("showSetup") === "true") {
      setIsSetupModalOpen(true);
    }
  }, [searchParams]);

  // Dynamic featured subjects from onboarding selections + Supabase progress
  const { subjects: featuredSubjects, isLoading: subjectsLoading } = useFeaturedSubjects(userId);

  const streakCount = 12;
  const notificationCount = 3;

  return (
    <div className="min-h-screen bg-[#FAF7EC] text-black antialiased font-sans pb-28 selection:bg-[#B6FF00]">
      <main className="w-full max-w-md mx-auto p-4 pt-6 flex flex-col items-center animate-page-in">
        <DashboardHeader
          userName={userName}
          streakCount={streakCount}
          notificationCount={notificationCount}
          avatar={avatar}
          onNotificationClick={() => console.log("Notifications clicked")}
        />

        <StreakCalendar streakCount={streakCount} days={streakDays} />

        <QuickActions
          actions={quickActions}
          onAction={(name) => {
            if (name === "Daily Quiz") {
              router.push("/dashboard/quiz-generator");
            } else {
              console.log("Quick action:", name);
            }
          }}
        />

        {/* Featured Subjects — driven by onboarding selections */}
        {subjectsLoading ? (
          <section className="w-full mb-8">
            <div className="flex items-center justify-between mb-4 pl-1">
              <h3 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A]">
                Featured Subjects
              </h3>
            </div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-stone-200 border-[3.5px] border-black rounded-xl p-4 h-20 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] animate-pulse"
                />
              ))}
            </div>
          </section>
        ) : featuredSubjects.length === 0 ? (
          <section className="w-full mb-8">
            <div className="flex items-center justify-between mb-4 pl-1">
              <h3 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A]">
                Featured Subjects
              </h3>
            </div>
            <button
              onClick={() => router.push("/getting-started/struggles")}
              className="w-full bg-[#B6FF00] border-[3.5px] border-black rounded-xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col items-start gap-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-left"
            >
              <span className="text-lg">📚</span>
              <p className="font-black text-black text-sm uppercase tracking-wide">
                Select Your Subjects
              </p>
              <p className="text-xs font-bold text-stone-700">
                Tell Ticha AI what you&apos;re studying to unlock personalized cards here.
              </p>
            </button>
          </section>
        ) : (
          <FeaturedSubjects
            subjects={featuredSubjects}
            currentLevel={educationLevel}
            onSubjectClick={(id) => router.push(`/courses/${id}`)}
            onSeeMore={() => router.push("/courses")}
          />
        )}

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

export default function StudentDashboardPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FAF7EC]" />}>
      <StudentDashboardPageContent />
    </React.Suspense>
  );
}
