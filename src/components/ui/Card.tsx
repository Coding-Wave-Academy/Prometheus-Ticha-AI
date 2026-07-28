"use client";

import React from "react";
import { hapticTap } from "@/lib/haptics";

export type CardVariant = "default" | "accent" | "warm" | "dark";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
  children: React.ReactNode;
}

export default function Card({
  variant = "default",
  interactive = false,
  children,
  className = "",
  onClick,
  ...props
}: CardProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactive) {
      hapticTap();
    }
    if (onClick) {
      onClick(e);
    }
  };

  const variantClasses: Record<CardVariant, string> = {
    default: "bg-white text-black",
    accent: "bg-[#B6FF00] text-black",
    warm: "bg-[#FAF7EC] text-black",
    dark: "bg-[#1A1A1A] text-white",
  };

  const interactiveClasses = interactive
    ? "cursor-pointer transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
    : "";

  return (
    <div
      onClick={handleClick}
      className={`border-[3.5px] border-black rounded-2xl p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden ${variantClasses[variant]} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
