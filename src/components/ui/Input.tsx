"use client";

import React, { forwardRef } from "react";
import { hapticWarning } from "@/lib/haptics";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  onClear?: () => void;
  containerClassName?: string;
  leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      onClear,
      containerClassName = "",
      className = "",
      leftIcon,
      onChange,
      value,
      type = "text",
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className={`flex flex-col space-y-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-extrabold uppercase tracking-widest text-[#0A0A0F] flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}

        <div className="flex items-center gap-2.5 w-full">
          {leftIcon && (
            <div className="w-12 h-12 rounded-xl border-[2.5px] border-black bg-[#EBFFA8] flex items-center justify-center text-[#0A0A0F] shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {leftIcon}
            </div>
          )}

          <div className="relative flex-1">
            <input
              id={inputId}
              ref={ref}
              type={type}
              value={value}
              onChange={handleChange}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
              className={`w-full bg-white border-[2.5px] border-black rounded-xl p-3 md:p-3.5 text-[15px] font-medium text-[#0A0A0F] outline-none placeholder:text-stone-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${
                error ? "border-[#EF4444] bg-red-50/20" : ""
              } ${onClear && value ? "pr-10" : ""} ${className}`}
              {...props}
            />

            {/* Optional Clear Button */}
            {onClear && value && String(value).length > 0 && (
              <button
                type="button"
                onClick={() => {
                  hapticWarning();
                  onClear();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-stone-400 hover:text-black font-black text-sm z-10"
                aria-label="Clear field"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Error message with SVG Icon */}
        {error && (
          <div
            id={`${inputId}-error`}
            role="alert"
            className="bg-[#FFE4E4] border-[2px] border-[#EF4444] rounded-xl p-2.5 font-bold text-xs text-[#EF4444] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-spring-slide-up flex items-center gap-1.5"
          >
            <svg className="w-4 h-4 text-[#EF4444] shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V8h2v4z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Helper text */}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-xs font-medium text-stone-600 px-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

