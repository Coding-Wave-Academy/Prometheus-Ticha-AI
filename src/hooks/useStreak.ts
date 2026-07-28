"use client";

import { useState, useEffect } from "react";
import { fireSideCannons } from "@/lib/confetti";
import { hapticSuccess } from "@/lib/haptics";

export interface StreakDayItem {
  day: string;
  status: "active" | "frozen" | "upcoming";
  label: string;
}

export function useStreak() {
  const [streakCount, setStreakCount] = useState(12);
  const [freezesRemaining, setFreezesRemaining] = useState(1);
  const [isTodayClaimed, setIsTodayClaimed] = useState(false);
  const [isFrozen, setIsFrozen] = useState(true); // Demonstrating Chess.com paused streak feature

  const [weeklyDays, setWeeklyDays] = useState<StreakDayItem[]>([
    { day: "S", status: "active", label: "Sunday" },
    { day: "M", status: "active", label: "Monday" },
    { day: "T", status: "frozen", label: "Tuesday (Paused)" },
    { day: "W", status: "active", label: "Wednesday" },
    { day: "TH", status: "active", label: "Thursday" },
    { day: "F", status: "upcoming", label: "Friday" },
    { day: "S", status: "upcoming", label: "Saturday" },
  ]);

  useEffect(() => {
    const savedStreak = localStorage.getItem("ticha_streak_count");
    const savedClaimed = localStorage.getItem("ticha_streak_claimed_today") === "true";
    const savedFreezes = localStorage.getItem("ticha_streak_freezes");

    if (savedStreak) setStreakCount(parseInt(savedStreak, 10));
    if (savedClaimed) setIsTodayClaimed(savedClaimed);
    if (savedFreezes) setFreezesRemaining(parseInt(savedFreezes, 10));
  }, []);

  const claimDailyStreak = () => {
    if (isTodayClaimed) return;

    hapticSuccess();
    fireSideCannons();

    const newStreak = streakCount + 1;
    setStreakCount(newStreak);
    setIsTodayClaimed(true);
    setIsFrozen(false);

    // Update today in weekly array
    setWeeklyDays((prev) =>
      prev.map((item, idx) => (idx === 4 ? { ...item, status: "active" } : item))
    );

    localStorage.setItem("ticha_streak_count", newStreak.toString());
    localStorage.setItem("ticha_streak_claimed_today", "true");
  };

  return {
    streakCount,
    freezesRemaining,
    isTodayClaimed,
    isFrozen,
    weeklyDays,
    claimDailyStreak,
  };
}
