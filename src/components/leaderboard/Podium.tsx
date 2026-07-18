"use client";

import React from "react";
import Image from "next/image";
import { PodiumUser } from "@/types/leaderboard";

interface PodiumProps {
  users: [PodiumUser, PodiumUser, PodiumUser]; // [1st, 2nd, 3rd]
}

/**
 * Podium — three-column Olympic-style podium.
 * 1st place (centre) is elevated, has a larger avatar and gold block.
 * 2nd (left) and 3rd (right) sit slightly lower.
 */
export default function Podium({ users }: PodiumProps) {
  const [first, second, third] = users;

  const PodiumColumn = ({
    user,
    position,
  }: {
    user: PodiumUser;
    position: "left" | "center" | "right";
  }) => {
    const isCenter = position === "center";
    const avatarSize = isCenter ? 80 : 64;
    const avatarBorder = isCenter ? "border-[4px]" : "border-[3px]";
    const blockBg = isCenter ? "bg-[#965A18]" : "bg-[#E2E4D9]";
    const blockBorder = isCenter ? "border-[4px]" : "border-[3.5px]";
    const blockShadow = isCenter
      ? "shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
      : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
    const numberClass = isCenter
      ? "text-5xl font-black text-white drop-shadow-[2px_2px_0px_#000]"
      : "text-3xl font-black text-black";
    const nameClass = isCenter
      ? "text-[11px] font-black uppercase tracking-tight text-white/90"
      : "text-[10px] font-black uppercase tracking-tight text-[#1A1A1A]";
    const rounding = isCenter
      ? "rounded-t-xl"
      : position === "left"
      ? "rounded-l-xl"
      : "rounded-r-xl";
    const offset = isCenter ? "relative top-[-10px] z-10" : "relative top-[3px]";
    const padding = isCenter ? "p-6" : "p-4";

    return (
      <div className={`flex flex-col items-center gap-3 ${offset}`}>
        <div
          className={`rounded-full ${avatarBorder} border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative z-10`}
          style={{ width: avatarSize, height: avatarSize }}
        >
          <Image
            src={user.avatar}
            alt={user.name}
            width={avatarSize}
            height={avatarSize}
            className="object-cover"
          />
        </div>
        <div
          className={`${blockBg} w-full ${blockBorder} border-black ${rounding} ${padding} text-center space-y-0.5 ${blockShadow} active:translate-y-[1px] cursor-pointer`}
        >
          <div className={numberClass}>{user.rank}</div>
          <div className={nameClass}>{user.name}</div>
        </div>
      </div>
    );
  };

  return (
    <section className="w-full grid grid-cols-3 items-end gap-0.5 mb-10 relative">
      <PodiumColumn user={second} position="left" />
      <PodiumColumn user={first}  position="center" />
      <PodiumColumn user={third}  position="right" />
    </section>
  );
}
