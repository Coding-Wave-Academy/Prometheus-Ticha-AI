import React from "react";

export interface ProgressBarProps {
  progress: number; // 0 to 100
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export default function ProgressBar({
  progress,
  showLabel = false,
  label,
  className = "",
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`flex flex-col space-y-1 w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center text-xs font-extrabold uppercase tracking-wider text-stone-800">
          <span>{label || "Progress"}</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div
        className="w-full bg-white border-[3px] border-black rounded-full h-4 p-[2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="bg-[#B6FF00] h-full rounded-full border-r-[2px] border-black transition-all duration-500 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
