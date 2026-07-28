"use client";

import { useEffect } from "react";
import { fireConfettiBurst } from "@/lib/confetti";

export default function ConfettiOverlay() {
  useEffect(() => {
    fireConfettiBurst();
  }, []);

  return null;
}
