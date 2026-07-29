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

const baseDays = [
  { day: "S", label: "Sunday" },
  { day: "M", label: "Monday" },
  { day: "T", label: "Tuesday" },
  { day: "W", label: "Wednesday" },
  { day: "TH", label: "Thursday" },
  { day: "F", label: "Friday" },
  { day: "S", label: "Saturday" },
];

export function useStreak() {
  const { profile, updateProfile } = useProfile();
  const [streakCount, setStreakCount] = useState(1);
  const [freezesRemaining, setFreezesRemaining] = useState(2);
  const [isTodayClaimed, setIsTodayClaimed] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  const [weeklyDays, setWeeklyDays] = useState<StreakDayItem[]>(() => {
    const todayIndex = new Date().getDay(); // 0 = Sun, 6 = Sat
    return baseDays.map((d, idx) => {
      let status: "active" | "frozen" | "upcoming" = "upcoming";
      if (idx < todayIndex) {
        status = idx === 2 ? "frozen" : "active"; // Tuesday example frozen
      } else if (idx === todayIndex) {
        status = "active";
      } else {
        status = "upcoming";
      }
      return { ...d, status };
    });
  });

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
    const todayIndex = new Date().getDay();

    setStreakCount(newStreak);
    setIsTodayClaimed(true);
    setIsFrozen(false);

    setWeeklyDays((prev) =>
      prev.map((item, idx) => (idx === todayIndex ? { ...item, status: "active" } : item))
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
