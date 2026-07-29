"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft01Icon,
  Notification01Icon,
  CheckmarkCircle02Icon,
  FireIcon,
  SparklesIcon,
  Book01Icon,
} from "hugeicons-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const router = useRouter();
  const navItems = useNavItems();
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();

  return (
    <div className="min-h-screen bg-[#FAF7EC] text-black antialiased font-sans pb-28 selection:bg-[#B6FF00]">
      <main className="w-full max-w-md mx-auto p-4 pt-6 flex flex-col space-y-5 animate-page-in text-left">
        {/* Header */}
        <header className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-10 h-10 bg-white border-[2.5px] border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center transition-transform"
              aria-label="Back to dashboard"
            >
              <ArrowLeft01Icon className="w-5 h-5 text-black" />
            </button>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A]">
                Notifications
              </h1>
              <p className="text-xs font-bold text-stone-600">
                {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? "s" : ""}` : "All notifications read"}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-white border-[2px] border-black rounded-full py-1 px-3 text-[11px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all text-black flex items-center gap-1"
            >
              <CheckmarkCircle02Icon size={14} className="text-green-600" />
              <span>Mark Read</span>
            </button>
          )}
        </header>

        {/* Notification List */}
        <div className="space-y-3 pt-2">
          {notifications.length === 0 ? (
            <div className="bg-white border-[3.5px] border-black rounded-2xl p-8 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-center space-y-3">
              <Notification01Icon size={40} className="text-stone-400 mx-auto" />
              <h3 className="font-black text-base uppercase text-black">No Notifications Yet</h3>
              <p className="text-xs font-bold text-stone-600">
                You are all caught up! Check back later for 1% Daily Habit updates.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  markAsRead(n.id);
                  if (n.type === "habit") {
                    router.push("/dashboard/daily-lessons");
                  }
                }}
                className={`p-4 border-[3.5px] border-black rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-x-px active:translate-y-px active:shadow-none transition-all flex items-start gap-3.5 ${
                  !n.read ? "bg-[#B6FF00]" : "bg-white"
                }`}
              >
                <div className="w-10 h-10 rounded-xl border-[2px] border-black bg-white flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  {n.type === "habit" ? (
                    <Book01Icon size={20} className="text-black" />
                  ) : n.type === "streak" ? (
                    <FireIcon size={20} className="text-orange-600" />
                  ) : (
                    <SparklesIcon size={20} className="text-amber-600" />
                  )}
                </div>

                <div className="flex-1 space-y-0.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-black text-sm text-black leading-tight truncate">
                      {n.title}
                    </h4>
                    {!n.read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 border-[1.5px] border-black shrink-0" />
                    )}
                  </div>
                  <p className="text-xs font-bold text-stone-800 leading-snug">
                    {n.body}
                  </p>
                  <span className="text-[10px] font-extrabold text-stone-600 block pt-1">
                    {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <BottomNav items={navItems} />
    </div>
  );
}
