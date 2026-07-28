"use client";

import React from "react";
import ComingSoon from "@/components/ui/ComingSoon";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";

export default function PastPapersPage() {
  const navItems = useNavItems();

  return (
    <div className="min-h-screen bg-[#FAF7EC] flex flex-col justify-between pb-28">
      <main className="flex-1 flex items-center justify-center p-4">
        <ComingSoon
          title="GCE Past Papers Vault Coming Soon"
          description="Access past GCE O/L & A/L question papers with official marking guides. Our team is actively uploading subject archives!"
          showBackHome={true}
        />
      </main>
      <BottomNav items={navItems} />
    </div>
  );
}
