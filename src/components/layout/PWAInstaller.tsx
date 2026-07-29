"use client";

import React, { useEffect, useState } from "react";
import { Download01Icon, Cancel01Icon } from "hugeicons-react";
import { hapticSuccess, hapticTap } from "@/lib/haptics";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("PWA Service Worker registered:", reg.scope))
        .catch((err) => console.error("Service Worker registration failed:", err));
    }

    // 2. Capture beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    hapticTap();

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      hapticSuccess();
      console.log("User accepted PWA installation");
    }
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!showBanner || !deferredPrompt) return null;

  return (
    <div className="w-full mb-4 bg-[#B6FF00] border-[3.5px] border-black rounded-2xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between animate-spring-pop z-40 relative">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
          <Download01Icon size={22} className="text-black" />
        </div>
        <div className="text-left">
          <h4 className="font-black text-xs uppercase text-black leading-tight">
            Install Ticha AI App
          </h4>
          <p className="text-[11px] font-bold text-stone-800">
            Add to home screen for offline access
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstallClick}
          className="bg-white hover:bg-stone-50 border-[2.5px] border-black rounded-xl py-1.5 px-3 font-black text-xs uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all"
        >
          Install
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="w-8 h-8 bg-white border-[2px] border-black rounded-lg flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all"
          aria-label="Dismiss banner"
        >
          <Cancel01Icon size={14} className="text-black" />
        </button>
      </div>
    </div>
  );
}
