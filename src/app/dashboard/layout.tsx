"use client";

import React from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

/**
 * Dashboard layout — renders the sidebar on web/tablet viewports (≥768px)
 * alongside the page content. On mobile (<768px), the sidebar is hidden via
 * Tailwind's `hidden md:flex` and the BottomNav is rendered inside each page.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FAF7EC]">
      {/* Sidebar — visible on md+ viewports */}
      <DashboardSidebar />

      {/* Main content area */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
