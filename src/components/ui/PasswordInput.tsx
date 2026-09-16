"use client";

import React, { useState } from "react";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Optional right-aligned element next to the label (e.g. "Forgot?" link) */
  labelRight?: React.ReactNode;
  leftIcon?: React.ReactNode;
  error?: string;
}

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = "••••••••",
  labelRight,
  leftIcon,
  error,
}: PasswordInputProps) {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <div className="flex justify-between items-center">
        <label
          htmlFor={id}
          className="text-xs font-extrabold uppercase tracking-widest text-[#0A0A0F]"
        >
          {label}
        </label>
        {labelRight}
      </div>

      <div className="flex items-center gap-2.5 w-full">
        {leftIcon && (
          <div className="w-12 h-12 rounded-xl border-[2.5px] border-black bg-[#EBFFA8] flex items-center justify-center text-[#0A0A0F] shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {leftIcon}
          </div>
        )}

        {/* Neobrutalist Wrapper Container */}
        <div className="relative flex-1 rounded-xl border-[2.5px] border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-within:translate-x-[-1px] focus-within:translate-y-[-1px] focus-within:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
          <input
            id={id}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent rounded-lg p-3 md:p-3.5 pr-12 text-[15px] font-medium text-[#0A0A0F] outline-none placeholder:text-stone-400"
          />

          {/* Show/Hide toggle — 44×44 touch target */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // Keeps focus on input
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-stone-500 hover:text-black active:scale-95 transition-transform z-10"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              /* Eye-off icon */
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              /* Eye icon */
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs font-bold text-red-600 pl-1 animate-spring-pop">
          {error}
        </p>
      )}
    </div>
  );
}



