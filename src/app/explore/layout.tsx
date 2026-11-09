import React from "react";
import AppShell from "@/components/layout/AppShell";

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
