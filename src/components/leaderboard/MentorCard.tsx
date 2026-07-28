"use client";

import React from "react";
import Image from "next/image";

interface MentorCardProps {
  name: string;
  university: string;
  levels: string;
  field: string;
  image: string;
  onRequestChat?: () => void;
}

/**
 * MentorCard — displays mentor information with neobrutalist style badge and action button.
 */
export default function MentorCard({
  name,
  university,
  levels,
  field,
  image,
  onRequestChat,
}: MentorCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl border-[3px] border-black shadow-[3.5px_3.5px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 w-72">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full border-[2.5px] border-black overflow-hidden relative flex-shrink-0 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
          <Image
            src={image}
            alt={name}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <h4 className="font-black text-base text-stone-900 truncate leading-tight">
            {name}
          </h4>
          <p className="text-xs font-bold text-stone-600 truncate">
            {university}
          </p>
        </div>
      </div>

      <div className="flex gap-2 my-4">
        <span className="bg-[#B6FF00] text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border-[2px] border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
          {levels}
        </span>
        <span className="bg-[#FFB040] text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border-[2px] border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
          {field}
        </span>
      </div>

      <button
        onClick={onRequestChat}
        className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white py-2.5 rounded-lg font-black text-xs uppercase tracking-wider border-[2.5px] border-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all"
      >
        Request Chat
      </button>
    </div>
  );
}
