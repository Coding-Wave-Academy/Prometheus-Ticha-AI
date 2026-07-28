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
  const [completedCount, setCompletedCount] = useState(1);

  useEffect(() => {
    // Read actual setup state from localStorage
    const profileCompleted = localStorage.getItem("ticha_profile_completed") === "true";
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
          <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        ),
        isCompleted: profileCompleted,
        href: "/dashboard/profile?focus=name",
      },
      {
        id: "region",
        title: "Select Region",
        description: "Localize your learning",
        icon: (
          <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
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
          <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 24 24">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
          </svg>
        ),
        isCompleted: schoolAdded,
        href: "/dashboard/profile?focus=school",
      },
    ];

    const timer = setTimeout(() => {
      setSteps(allSteps);
      const count = allSteps.filter((s) => s.isCompleted).length;
      setCompletedCount(count);
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const totalSteps = 4;
  const percentage = (completedCount / totalSteps) * 100;
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
            {completedCount} of {totalSteps}
          </span>
        </div>

        {/* Header Text */}
        <div className="pr-12 space-y-1.5 mb-6 text-left">
          <h2 className="text-2xl font-black text-black leading-tight">
            Finish Setup
          </h2>
          <p className="text-xs font-bold text-stone-600 leading-snug">
            Almost there! Complete your profile to unlock your full potential.
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
                <div className="w-9 h-9 rounded-lg border-[2px] border-black flex items-center justify-center flex-shrink-0 bg-white">
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
