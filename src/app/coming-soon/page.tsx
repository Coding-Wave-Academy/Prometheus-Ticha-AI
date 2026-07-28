"use client";

import React from "react";
import ComingSoon from "@/components/ui/ComingSoon";

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-[#FAF7EC] flex items-center justify-center p-4">
      <ComingSoon
        title="Screen Coming Soon"
        featureName="This Module"
        description="Our AI engineering team is actively building this experience. Sign up below to get early access as soon as it launches!"
        showBackHome={true}
      />
    </main>
  );
}
