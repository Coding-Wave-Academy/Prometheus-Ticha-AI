"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: "habit" | "streak" | "achievement" | "system";
  read: boolean;
  created_at: string;
}

const defaultNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "🔥 1% Daily Habit Ready!",
    body: "Your 3 custom daily micro-lessons targeting your weak subjects are ready to complete.",
    type: "habit",
    read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "notif-2",
    title: "⚡ Keep Your Streak Alive!",
    body: "Complete 1 lesson today to climb your daily study streak.",
    type: "streak",
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "notif-3",
    title: "🎉 Welcome to Ticha AI!",
    body: "Welcome! Your personalized GCE study path has been initialized.",
    type: "system",
    read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ticha_user_notifications");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setNotifications(parsed);
          setUnreadCount(parsed.filter((n: NotificationItem) => !n.read).length);
          return;
        } catch {
          // ignore error
        }
      }
      setNotifications(defaultNotifications);
      setUnreadCount(defaultNotifications.filter((n) => !n.read).length);
      localStorage.setItem("ticha_user_notifications", JSON.stringify(defaultNotifications));
    }
  }, [user]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      if (typeof window !== "undefined") {
        localStorage.setItem("ticha_user_notifications", JSON.stringify(updated));
      }
      return updated;
    });
    setUnreadCount(0);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      if (typeof window !== "undefined") {
        localStorage.setItem("ticha_user_notifications", JSON.stringify(updated));
      }
      return updated;
    });
    setUnreadCount((count) => Math.max(0, count - 1));
  }, []);

  return {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
  };
}
