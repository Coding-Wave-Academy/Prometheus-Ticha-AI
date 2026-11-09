import React from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

/**
 * Signed-in app frame. Desktop (≥ 768px): sidebar + content. Mobile: content
 * only (pages render their own mobile header and bottom nav).
 *
 * Desktop content spacing follows the desktop designs at 1536px:
 * 38px gutter after the sidebar, 35px on the right, content column max 1140px.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-cream text-ink">
      <DashboardSidebar />
      <main id="main-content" className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}

/** Desktop page container: gutters and the 1140px content column. */
export function DesktopPage({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`hidden md:block pl-6 pr-6 xl:pl-[38px] xl:pr-[35px] pb-12 ${className}`}>{children}</div>;
}

/**
 * The content column. `width` is the column's max width in px: 1140 (Explore
 * design) by default; the Dashboard design uses 1134.
 */
export function DesktopColumn({
  children,
  className = "",
  width = 1140,
}: {
  children: React.ReactNode;
  className?: string;
  width?: number;
}) {
  return (
    <div className={`w-full ${className}`} style={{ maxWidth: width }}>
      {children}
    </div>
  );
}
