"use client";

import { useState, useEffect } from "react";
import { fireSideCannons } from "@/lib/confetti";
import { hapticSuccess } from "@/lib/haptics";
import { useProfile } from "@/hooks/useProfile";

export interface StreakDayItem {
  day: string;
  status: "active" | "frozen" | "upcoming";
  label: string;
}

export function useStreak() {
  const { profile, updateProfile } = useProfile();
  const [streakCount, setStreakCount] = useState(1);
  const [freezesRemaining, setFreezesRemaining] = useState(2);
  const [isTodayClaimed, setIsTodayClaimed] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

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
    if (profile) {
      setStreakCount(profile.streak_count || 1);
      setFreezesRemaining(profile.freezes_remaining ?? 2);

      const todayStr = new Date().toISOString().split("T")[0];
      if (profile.last_active_date === todayStr) {
        setIsTodayClaimed(true);
      }
    }
  }, [profile]);

  const claimDailyStreak = async () => {
    if (isTodayClaimed) return;

    hapticSuccess();
    fireSideCannons();

    const newStreak = streakCount + 1;
    const todayStr = new Date().toISOString().split("T")[0];

    setStreakCount(newStreak);
    setIsTodayClaimed(true);
    setIsFrozen(false);

    setWeeklyDays((prev) =>
      prev.map((item, idx) => (idx === 4 ? { ...item, status: "active" } : item))
    );

    await updateProfile({
      streak_count: newStreak,
      last_active_date: todayStr,
    });
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
