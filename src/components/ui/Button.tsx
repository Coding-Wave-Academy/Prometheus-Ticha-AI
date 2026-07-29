"use client";

import React from "react";
import { hapticPress } from "@/lib/haptics";

export type ButtonVariant = "primary" | "secondary" | "danger" | "accent" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  enableHaptics?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  enableHaptics = true,
  children,
  className = "",
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const handlePress = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enableHaptics && !disabled && !isLoading) {
      hapticPress();
    }
    if (onClick) {
      onClick(e);
    }
  };

  // Base Neobrutalist styles
  const baseClasses =
    "inline-flex items-center justify-center font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";

  // Variant mappings
  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "bg-[#B6FF00] text-black border-[3.5px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#a3e600] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
    secondary:
      "bg-white text-black border-[3.5px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
    danger:
      "bg-[#FF9494] text-black border-[3.5px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ff7b7b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
    accent:
      "bg-[#965A18] text-white border-[3.5px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#7A4711] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
    ghost:
      "bg-transparent text-black border-[2.5px] border-transparent hover:border-black hover:bg-stone-100/50 active:translate-x-[1px] active:translate-y-[1px]",
  };

  // Size mappings (ensuring min 44px WCAG touch target)
  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3.5 py-2 text-sm min-h-[44px]",
    md: "px-5 py-3 text-[16px] min-h-[48px]",
    lg: "px-6 py-4 text-[17px] min-h-[52px]",
  };

  return (
    <button
      onClick={handlePress}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          {/* Neobrutalist Inline SVG Spinner */}
          <svg
            className="animate-spin h-5 w-5 text-current"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
