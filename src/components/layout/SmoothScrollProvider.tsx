"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname();
  const scrollTargetY = useRef(0);
  const currentScrollY = useRef(0);
  const isRafActive = useRef(false);

  useEffect(() => {
    // Only intercept desktop mouse wheel hard steps to create iOS-style spring deceleration
    const isTouchDevice =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    if (isTouchDevice) return;

    scrollTargetY.current = window.scrollY;
    currentScrollY.current = window.scrollY;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updateScroll = () => {
      const diff = scrollTargetY.current - currentScrollY.current;

      if (Math.abs(diff) > 0.5) {
        // Damping factor gives iOS spring deceleration feel
        currentScrollY.current = lerp(currentScrollY.current, scrollTargetY.current, 0.12);
        window.scrollTo(0, currentScrollY.current);
        requestAnimationFrame(updateScroll);
      } else {
        window.scrollTo(0, scrollTargetY.current);
        isRafActive.current = false;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Allow ctrlKey zoom or explicit shift horizontally
      if (e.ctrlKey || e.shiftKey) return;

      e.preventDefault();
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      // Accelerate wheel delta with momentum damping factor
      const delta = e.deltaY * 0.85;
      scrollTargetY.current = Math.min(Math.max(0, scrollTargetY.current + delta), maxScroll);

      if (!isRafActive.current) {
        isRafActive.current = true;
        requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.99 }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1], // iOS spring cubic-bezier
        }}
        className="w-full flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
