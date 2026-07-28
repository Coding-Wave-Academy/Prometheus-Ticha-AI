"use client";

import React from "react";
import ComingSoon from "@/components/ui/ComingSoon";

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-[#FAF7EC] flex items-center justify-center p-4">
      <ComingSoon
        title="Screen Coming Soon"
        description="Our AI engineering team is actively building this experience for Cameroonian students. Check back soon for updates!"
        showBackHome={true}
      />
    </main>
  );
}
