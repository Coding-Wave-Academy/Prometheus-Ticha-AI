"use client";

import React from "react";

export default function PaperSkeleton() {
  return (
    <div className="w-full bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-pulse flex flex-col justify-between gap-4">
      <div className="flex items-center justify-between gap-2">
        <div className="h-6 w-24 bg-stone-200 rounded-full border-[2px] border-stone-400" />
        <div className="h-6 w-12 bg-stone-200 rounded-full border-[2px] border-stone-400" />
      </div>

      <div className="space-y-2">
        <div className="h-6 w-3/4 bg-stone-300 rounded-md" />
        <div className="h-4 w-full bg-stone-200 rounded-md" />
      </div>

      <div className="h-10 w-full bg-stone-200 rounded-xl border-[3.5px] border-stone-400" />
    </div>
  );
}
