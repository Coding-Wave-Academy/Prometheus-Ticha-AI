"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [streakCount, setStreakCount] = useState(0);
  const [freezesRemaining, setFreezesRemaining] = useState(2);
  const [isTodayClaimed, setIsTodayClaimed] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  // Initialize weekly days grid: all days start as "upcoming" (black)
  const [weeklyDays, setWeeklyDays] = useState<StreakDayItem[]>(() => {
    return baseDays.map((d) => ({ ...d, status: "upcoming" }));
  });

  useEffect(() => {
    if (profile) {
      const userStreak = profile.streak_count ?? 0;
      setStreakCount(userStreak);
      setFreezesRemaining(profile.freezes_remaining ?? 2);

      const todayStr = new Date().toISOString().split("T")[0];
      const todayIndex = new Date().getDay();
      const isClaimedToday = profile.last_active_date === todayStr;
      setIsTodayClaimed(isClaimedToday);

      // Read claimed streak dates from localStorage or profile vector
      let claimedDates: string[] = [];
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("ticha_streak_dates");
        if (stored) {
          try {
            claimedDates = JSON.parse(stored);
          } catch {
            // ignore
          }
        }
      }

      // Calculate current week's dates to map correctly to calendar days
      const now = new Date();
      const sundayDate = new Date(now);
      sundayDate.setDate(now.getDate() - todayIndex);

      setWeeklyDays(
        baseDays.map((d, idx) => {
          const thisDay = new Date(sundayDate);
          thisDay.setDate(sundayDate.getDate() + idx);
          const dateStr = thisDay.toISOString().split("T")[0];

          let status: "active" | "frozen" | "upcoming" = "upcoming";

          if (dateStr === todayStr && isClaimedToday) {
            status = "active";
          } else if (claimedDates.includes(dateStr)) {
            status = "active";
          } else if (idx < todayIndex) {
            // Past day without activity: check if user had a freeze or missed
            const isFrozenDate = typeof window !== "undefined" && localStorage.getItem(`ticha_frozen_${dateStr}`) === "true";
            status = isFrozenDate ? "frozen" : "upcoming";
          }

          return { ...d, status };
        })
      );
    }
  }, [profile]);

  const claimDailyStreak = useCallback(async () => {
    const todayStr = new Date().toISOString().split("T")[0];

    // Enforce ONE streak claim per day rule
    if (isTodayClaimed || profile?.last_active_date === todayStr) {
      return { success: false, message: "Daily streak already claimed for today!" };
    }

    hapticSuccess();
    fireSideCannons();

    const currentCount = profile?.streak_count ?? streakCount ?? 0;
    const newStreak = currentCount + 1; // 0 -> 1 on first claim!
    const todayIndex = new Date().getDay();

    setStreakCount(newStreak);
    setIsTodayClaimed(true);
    setIsFrozen(false);

    // Save date to streak dates storage
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("ticha_streak_dates");
        const existing: string[] = stored ? JSON.parse(stored) : [];
        if (!existing.includes(todayStr)) {
          existing.push(todayStr);
          localStorage.setItem("ticha_streak_dates", JSON.stringify(existing));
        }
      } catch {
        // ignore
      }
    }

    setWeeklyDays((prev) =>
      prev.map((item, idx) => (idx === todayIndex ? { ...item, status: "active" } : item))
    );

    await updateProfile({
      streak_count: newStreak,
      last_active_date: todayStr,
    });

    return { success: true, newStreak };
  }, [isTodayClaimed, profile, streakCount, updateProfile]);

  return {
    streakCount,
    freezesRemaining,
    isTodayClaimed,
    isFrozen,
    weeklyDays,
    claimDailyStreak,
  };
}
