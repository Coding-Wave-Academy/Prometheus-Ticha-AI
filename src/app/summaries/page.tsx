"use client";

import React from "react";
import ComingSoon from "@/components/ui/ComingSoon";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";

export default function SummariesPage() {
  const navItems = useNavItems();

  return (
    <div className="min-h-screen bg-[#FAF7EC] flex flex-col justify-between pb-28">
      <main className="flex-1 flex items-center justify-center p-4">
        <ComingSoon
          title="Study Summaries Coming Soon"
          description="High-yield revision notes, bite-sized topic summaries, and key formula guides tailored for Cameroonian students!"
          showBackHome={true}
        />
      </main>
      <BottomNav items={navItems} />
    </div>
  );
}
