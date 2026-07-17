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
}

/**
 * PasswordInput — a professional password field with show/hide toggle.
 *
 * Follows the neobrutalist design system with a wrapper that lifts on focus-within,
 * ensuring the toggle button and input translate together. Uses onMouseDown preventDefault
 * to keep focus on the input when toggling.
 */
export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = "••••••••",
  labelRight,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col space-y-1.5">
      <div className="flex justify-between items-center">
        <label
          htmlFor={id}
          className="text-xs font-extrabold uppercase tracking-widest text-stone-800"
        >
          {label}
        </label>
        {labelRight}
      </div>
      
      {/* Neobrutalist Wrapper Container */}
      <div className="relative rounded-xl border-[3.5px] border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus-within:translate-x-[-2px] focus-within:translate-y-[-2px] focus-within:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent rounded-lg p-3 md:p-3.5 pr-14 text-[15px] font-medium outline-none placeholder-stone-500"
        />
        
        {/* Show/Hide toggle — 44×44 touch target, only visible when input is not empty */}
        {value.length > 0 && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // Keeps focus on input
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-stone-600 hover:text-black active:scale-95 transition-transform z-10"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              /* Eye-off icon */
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              /* Eye icon */
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

