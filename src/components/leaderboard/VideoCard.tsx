"use client";

import React from "react";
import Image from "next/image";

interface VideoCardProps {
  title: string;
  channel: string;
  views: string;
  time: string;
  image: string;
  duration: string;
  onPlay?: () => void;
}

/**
 * VideoCard — Displays a neobrutalist video preview card with inline SVGs for icons.
 */
export default function VideoCard({
  title,
  channel,
  views,
  time,
  image,
  duration,
  onPlay,
}: VideoCardProps) {
  return (
    <div className="bg-white p-3.5 rounded-xl border-[3.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Thumbnail Area */}
      <div className="relative mb-3.5 rounded-lg overflow-hidden group border-[2.5px] border-black aspect-video bg-[#FAF7EC]">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="360px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#FFD9E0] flex items-center justify-center font-black text-stone-500 uppercase tracking-widest text-xs">
            No Thumbnail
          </div>
        )}
        {/* Play Button Overlay */}
        <div
          onClick={onPlay}
          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
        >
          <div className="bg-white border-[2px] border-black p-3 rounded-full text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-transform">
            <svg className="w-6 h-6 fill-current text-black" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Duration Badge */}
        <span className="absolute bottom-1.5 right-1.5 bg-black text-white text-[10px] font-black tracking-wider px-1.5 py-0.5 rounded border border-white">
          {duration}
        </span>
      </div>

      {/* Info Area */}
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full border-[2px] border-black overflow-hidden relative flex-shrink-0">
          <Image
            src="/images/amadou-avatar.png"
            alt={channel}
            fill
            sizes="36px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-black text-stone-900 line-clamp-2 text-sm leading-snug">
            {title}
          </h4>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600 mt-1">
            <span>{channel}</span>
            <span>•</span>
            <div className="flex items-center gap-0.5">
              <svg className="w-3.5 h-3.5 stroke-[2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.793 8.322 7.7 5.25 12 5.25c4.3 0 8.207 3.072 9.964 6.428.083.158.083.33 0 .488-1.757 3.356-5.664 6.428-9.964 6.428-4.3 0-8.207-3.072-9.964-6.428z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>{views}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-0.5">
              <svg className="w-3.5 h-3.5 stroke-[2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              </svg>
              <span>{time}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
