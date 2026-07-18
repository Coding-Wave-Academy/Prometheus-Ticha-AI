"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  href: string;
}

interface FinishSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FinishSetupModal({ isOpen, onClose }: FinishSetupModalProps) {
  const router = useRouter();
  const [steps, setSteps] = useState<SetupStep[]>([]);
  const [completedCount, setCompletedCount] = useState(1); // At least 1 (Account Created) is always true

  useEffect(() => {
    // Read actual setup state from localStorage
    const profileCompleted = localStorage.getItem("ticha_profile_completed") === "true";
    const tfaEnabled = localStorage.getItem("ticha_2fa_enabled") === "true";
    const regionSelected = localStorage.getItem("ticha_region_selected") === "true";
    const schoolAdded = localStorage.getItem("ticha_school_added") === "true";

    const allSteps: SetupStep[] = [
      {
        id: "account",
        title: "Account Created",
        description: "Great start!",
        icon: (
          <svg className="w-5 h-5 stroke-[3.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ),
        isCompleted: true,
        href: "#",
      },
      {
        id: "profile",
        title: "Complete Profile",
        description: "Tell us about yourself",
        icon: (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 448 512">
            <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C75.8 288 32 331.8 32 385.6V464c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-78.4c0-53.8-43.8-97.6-97.6-97.6z" />
          </svg>
        ),
        isCompleted: profileCompleted,
        href: "/dashboard/profile?focus=name",
      },
      {
        id: "tfa",
        title: "Enable 2FA",
        description: "Secure your account",
        icon: (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 512 512">
            <path d="M256 0c14.1 0 27.2 9.3 31.9 22.6l16 45.4C377.7 85.9 432 143.6 432 216v51.1c0 58.7 41 110.1 97.7 122.9 14.2 3.2 22.7 17.5 19.5 31.7S531.7 444 517.5 440.8C440.9 423.5 384 353.6 384 267.1V216c0-48.4-32.9-90.1-78.6-102.7l16.1 45.5c4.7 13.3-2.3 28-15.6 32.7s-28-2.3-32.7-15.6L256 128l-17.2 48.7c-4.7 13.3-19.4 20.3-32.7 15.6s-20.3-19.4-15.6-32.7l16.1-45.5C160.9 125.9 128 167.6 128 216v51.1c0 86.5-56.9 156.4-133.5 173.7C-19.7 444-28.2 429.7-25 415.5s17.5-22.7 31.7-19.5C65 383.2 106 331.8 106 273.1V216c0-72.4 54.3-130.1 128.1-148L224 22.6C228.8 9.3 241.9 0 256 0z" />
          </svg>
        ),
        isCompleted: tfaEnabled,
        href: "/dashboard/profile?focus=2fa",
      },
      {
        id: "region",
        title: "Select Region",
        description: "Localize your learning",
        icon: (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 384 512">
            <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
          </svg>
        ),
        isCompleted: regionSelected,
        href: "/dashboard/profile?focus=region",
      },
      {
        id: "school",
        title: "Add School Name",
        description: "Find your community",
        icon: (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 640 512">
            <path d="M620.8 104.3L338.9 4.4a32.2 32.2 0 0 0-18.1 0L38.4 104.3A32 32 0 0 0 32 134.4v264a32 32 0 0 0 20.3 29.8l268.8 96a32.1 32.1 0 0 0 17.8 0l268.8-96A32 32 0 0 0 608 398.4V134.4a32 32 0 0 0-6.4-30.1z" />
          </svg>
        ),
        isCompleted: schoolAdded,
        href: "/dashboard/profile?focus=school",
      },
    ];

    setSteps(allSteps);
    const count = allSteps.filter((s) => s.isCompleted).length;
    setCompletedCount(count);
  }, [isOpen]);

  if (!isOpen) return null;

  const percentage = (completedCount / 5) * 100;
  const strokeDasharray = 2 * Math.PI * 22; // r = 22
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  // Next incomplete step logic
  const nextIncompleteStep = steps.find((s) => !s.isCompleted);
  const ctaText = nextIncompleteStep ? nextIncompleteStep.title : "All Set!";
  const ctaHref = nextIncompleteStep ? nextIncompleteStep.href : "/dashboard";

  const handleCtaClick = () => {
    onClose();
    router.push(ctaHref);
  };

  const handleStepClick = (step: SetupStep) => {
    if (step.id === "account") return;
    onClose();
    router.push(step.href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Modal Dialog */}
      <div 
        id="finish-setup-modal"
        className="w-full max-w-sm bg-[#FAF7EC] border-[4px] border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex flex-col"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 w-9 h-9 bg-white border-[3px] border-black rounded-full flex items-center justify-center font-black text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none hover:bg-stone-50"
          aria-label="Close dialog"
        >
          ✕
        </button>

        {/* Circular Progress Ring in Top-Right */}
        <div className="absolute top-5 right-5 w-14 h-14 flex items-center justify-center relative">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="28" cy="28" r="22" stroke="black" strokeWidth="4.5" fill="transparent" className="text-stone-200" />
            <circle 
              cx="28" 
              cy="28" 
              r="22" 
              stroke="#FFB040" 
              strokeWidth="4.5" 
              fill="transparent" 
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <span className="absolute font-black text-[10px] text-black">
            {completedCount} of 5
          </span>
        </div>

        {/* Header Text */}
        <div className="pr-12 space-y-1.5 mb-6 text-left">
          <h2 className="text-2xl font-black text-black leading-tight">
            Finish Setup
          </h2>
          <p className="text-xs font-bold text-stone-600 leading-snug">
            Almost there, Amadou! You&apos;re {100 - percentage}% away from unlocking your full potential.
          </p>
        </div>

        {/* Steps Stack */}
        <div className="space-y-3 mb-6">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(step)}
              disabled={step.id === "account"}
              className={`w-full p-3 rounded-xl border-[2.5px] border-black flex items-center justify-between transition-all text-left shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                step.isCompleted
                  ? "bg-[#B6FF00]"
                  : "bg-white hover:bg-stone-50 active:translate-x-px active:translate-y-px active:shadow-none"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* SVG Icon */}
                <div className={`w-9 h-9 rounded-lg border-[2px] border-black flex items-center justify-center flex-shrink-0 bg-white`}>
                  {step.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-[13px] text-black leading-tight truncate">
                    {step.title}
                  </p>
                  <p className="text-[10px] font-bold text-stone-600 leading-tight">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Status checkbox indicator */}
              <div className="flex-shrink-0 w-5 h-5 rounded-full border-[2px] border-black bg-white flex items-center justify-center">
                {step.isCompleted && (
                  <svg className="w-3.5 h-3.5 text-black stroke-[3.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Primary Action Button */}
        <button
          onClick={handleCtaClick}
          className="w-full bg-[#FFB040] hover:bg-[#ffa326] border-[3.5px] border-black rounded-xl py-3.5 px-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-center text-black"
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
}
