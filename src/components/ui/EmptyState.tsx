"use client";

import React from "react";
import Button from "./Button";
import Card from "./Card";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <Card className={`text-center py-10 px-6 space-y-4 flex flex-col items-center justify-center ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-[#B6FF00] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black mb-2 animate-spring-pop">
        {icon || (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2v20M2 12h20" strokeLinecap="round" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        )}
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-xl font-black uppercase tracking-tight text-black">
          {title}
        </h3>
        <p className="text-sm font-medium text-stone-600">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
