"use client";

import React from "react";
import ComingSoon from "@/components/ui/ComingSoon";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";

export default function CourseDetailPage() {
  const navItems = useNavItems();

  return (
    <div className="min-h-screen bg-[#FAF7EC] flex flex-col justify-between pb-28">
      <main className="flex-1 flex items-center justify-center p-4">
        <ComingSoon
          title="Course Details Coming Soon"
          description="Full course overview with modules, video lessons, enrollment, and progress tracking — launching soon!"
          showBackHome={true}
        />
      </main>
      <BottomNav items={navItems} />
    </div>
  );
}
