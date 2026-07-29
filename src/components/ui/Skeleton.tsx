import React from "react";

export function SkeletonText({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-4 bg-[#E5E0D0] border-[2px] border-black rounded-md animate-skeleton ${className}`}
    />
  );
}

export function SkeletonAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-14 h-14",
  };
  return (
    <div
      className={`rounded-full border-[2.5px] border-black bg-[#E5E0D0] animate-skeleton ${sizeClasses[size]}`}
    />
  );
}

export function SkeletonButton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-12 w-full border-[3.5px] border-black rounded-xl bg-[#E5E0D0] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] animate-skeleton ${className}`}
    />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white space-y-4 ${className}`}
    >
      <div className="flex items-center space-x-3">
        <SkeletonAvatar size="md" />
        <div className="space-y-2 flex-1">
          <SkeletonText className="w-3/4 h-5" />
          <SkeletonText className="w-1/2 h-3" />
        </div>
      </div>
      <SkeletonText className="w-full h-12" />
      <SkeletonButton className="h-10" />
    </div>
  );
}
