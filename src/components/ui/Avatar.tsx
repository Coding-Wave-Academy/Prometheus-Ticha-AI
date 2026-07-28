"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  status?: "online" | "offline" | "busy";
  className?: string;
}

export default function Avatar({
  src,
  name = "User",
  size = "md",
  status,
  className = "",
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const getInitials = (n: string) => {
    const parts = n.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs min-w-[32px]",
    md: "w-11 h-11 text-sm min-w-[44px]",
    lg: "w-14 h-14 text-base min-w-[56px]",
  };

  const statusBg = {
    online: "bg-[#B6FF00]",
    offline: "bg-stone-400",
    busy: "bg-[#FF9494]",
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`relative rounded-full border-[2.5px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-[#B6FF00] flex items-center justify-center font-black uppercase text-black ${sizeClasses[size]}`}
      >
        {src && !imageError ? (
          <Image
            src={src}
            alt={name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-[2px] border-black ${statusBg[status]}`}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}
