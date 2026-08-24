"use client";

import React from "react";
import ComingSoon from "@/components/ui/ComingSoon";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";

export default function TutorPage() {
  const navItems = useNavItems();

  return (
    <div className="min-h-screen bg-[#FAF7EC] flex flex-col justify-between pb-28">
      <main className="flex-1 flex items-center justify-center p-4">
        <ComingSoon
          title="AI Tutor Chat Coming Soon"
          description="Have real-time voice and text conversations with Madame Ticha — your personal AI tutor that explains GCE concepts step by step."
          showBackHome={true}
        />
      </main>
      <BottomNav items={navItems} />
    </div>
  );
}
