"use client";

import React, { useEffect, useRef } from "react";
import { hapticTap } from "@/lib/haptics";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "md",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        hapticTap();
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Lock background scroll
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-spring-pop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          hapticTap();
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        ref={modalRef}
        className={`w-full ${maxWidthClasses[maxWidth]} bg-white border-[3.5px] border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative animate-spring-slide-up text-black space-y-4`}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-2 border-b-[3px] border-black">
          {title && (
            <h2 id="modal-title" className="text-xl font-black uppercase tracking-tight text-black">
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={() => {
              hapticTap();
              onClose();
            }}
            className="w-11 h-11 flex items-center justify-center rounded-xl border-[2.5px] border-black bg-stone-100 hover:bg-[#FF9494] active:scale-95 transition-all font-black text-lg ml-auto"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="pt-2 text-stone-800">{children}</div>
      </div>
    </div>
  );
}
