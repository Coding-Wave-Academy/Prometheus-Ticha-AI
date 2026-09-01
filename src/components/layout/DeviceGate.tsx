"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import NotFound from "@/app/not-found";

export interface DeviceGateProps {
  children: React.ReactNode;
}

/**
 * DeviceGate — Route & Viewport Manager.
 * 
 * Rules:
 * 1. Mobile viewports (< 768px): All mobile pages render normally with mobile UX.
 * 2. Desktop/Laptop/Tablet viewports (>= 768px):
 *    - If visiting `/dashboard` (which has a dedicated Web design), render the Web Dashboard.
 *    - If visiting ANY page that only has a mobile design built so far (e.g. /explore, /tutor, /past-papers, etc.),
 *      do NOT display the mobile view stretched on desktop — render the custom 404 screen instead!
 */
export default function DeviceGate({ children }: DeviceGateProps) {
  const pathname = usePathname() || "";
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkViewport = () => {
      // 768px is the md breakpoint for Web / Tablet / Desktop
      setIsDesktop(window.innerWidth >= 768);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Check if current route has an authorized web/desktop version
  const cleanPath = pathname.replace(/\/$/, "");
  const isWebSupportedRoute =
    cleanPath === "/dashboard" ||
    cleanPath.startsWith("/auth") ||
    cleanPath.startsWith("/api");

  if (!isMounted) {
    return <>{children}</>;
  }

  // If on desktop/laptop/tablet (>=768px) and the page has no web design yet, show custom 404 page!
  if (isDesktop && !isWebSupportedRoute) {
    return <NotFound />;
  }

  // Otherwise render children normally (e.g., Web Dashboard on desktop, or mobile pages on mobile devices)
  return <>{children}</>;
}
