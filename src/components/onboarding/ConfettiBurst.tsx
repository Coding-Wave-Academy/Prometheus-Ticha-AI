"use client";

import { useEffect } from "react";
import { fireSuccessCelebration } from "@/lib/confetti";

/**
 * High-performance canvas-confetti celebration for Onboarding and Sign-up.
 * Fires once on mount with realistic physics and Ticha brand colors.
 * Replaces generic animated divs with real canvas-confetti.
 */
export default function ConfettiBurst() {
  useEffect(() => {
    // Fire celebration when component mounts
    const timer = setTimeout(() => {
      fireSuccessCelebration();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
