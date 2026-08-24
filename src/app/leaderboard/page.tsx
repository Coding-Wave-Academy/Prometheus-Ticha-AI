"use client";

import React from "react";
import ComingSoon from "@/components/ui/ComingSoon";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";

export default function LeaderboardPage() {
  const navItems = useNavItems();

  return (
    <div className="min-h-screen bg-[#FAF7EC] flex flex-col justify-between pb-28">
      <main className="flex-1 flex items-center justify-center p-4">
        <ComingSoon
          title="Leaderboard Coming Soon"
          description="Compete with fellow Cameroonian students nationally and within your school. Rankings, XP points, and weekly challenges are on the way!"
          showBackHome={true}
        />
      </main>
      <BottomNav items={navItems} />
    </div>
  );
}
