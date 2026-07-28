"use client";

import React from "react";
import { ToastMessage } from "@/hooks/useToast";

export interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  const bgClasses: Record<ToastMessage["type"], string> = {
    success: "bg-[#B6FF00] text-black",
    error: "bg-[#FF9494] text-black",
    warning: "bg-amber-300 text-black",
    info: "bg-white text-black",
  };

  const renderIcon = (type: ToastMessage["type"]) => {
    switch (type) {
      case "success":
        return (
          <svg className="w-5 h-5 fill-current text-black shrink-0 mt-0.5" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        );
      case "error":
        return (
          <svg className="w-5 h-5 text-black shrink-0 stroke-[3] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-5 h-5 text-black shrink-0 fill-current mt-0.5" viewBox="0 0 24 24">
            <path d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V8h2v4z" />
          </svg>
        );
      case "info":
      default:
        return (
          <svg className="w-5 h-5 text-black shrink-0 stroke-[2.5] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M12 16v-4m0-4h.01" />
          </svg>
        );
    }
  };

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full px-4 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto border-[3.5px] border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-start justify-between gap-3 animate-spring-slide-up ${
            bgClasses[toast.type]
          }`}
        >
          <div className="flex items-start gap-2.5">
            {renderIcon(toast.type)}
            <div className="space-y-0.5">
              {toast.title && (
                <h4 className="font-extrabold uppercase text-xs tracking-wider">
                  {toast.title}
                </h4>
              )}
              <p className="text-sm font-bold leading-tight">{toast.message}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="text-black font-black text-sm hover:opacity-75 p-1"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
