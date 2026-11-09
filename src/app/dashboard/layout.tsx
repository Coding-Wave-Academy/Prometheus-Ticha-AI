import React from "react";
import AppShell from "@/components/layout/AppShell";

/** Desktop: sidebar + page. Mobile pages render their own header and BottomNav. */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
