"use client";

import React from "react";
import ComingSoon from "@/components/ui/ComingSoon";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FAF7EC] flex items-center justify-center p-4">
      <ComingSoon
        title="Screen Coming Soon"
        description="The screen or module you requested is under active construction by our AI engineering team. Check back soon!"
        showBackHome={true}
      />
    </main>
  );
}
