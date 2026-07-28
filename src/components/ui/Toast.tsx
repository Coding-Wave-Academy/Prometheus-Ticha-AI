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

  const icons: Record<ToastMessage["type"], string> = {
    success: "✓",
    error: "⚠️",
    warning: "⚡",
    info: "ℹ️",
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
            <span className="text-lg font-black leading-none mt-0.5">
              {icons[toast.type]}
            </span>
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
