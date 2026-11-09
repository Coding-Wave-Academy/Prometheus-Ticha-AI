import React from "react";

/**
 * Ticha AI logo: tilted "1%" badge + wordmark + tagline, drawn as inline SVG
 * to match design/Ticha AI Web View - Explore.png (badge 56×50, wordmark ~36px).
 * Replace the badge path with the designer's master vector when available.
 */
export function TichaBadge({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="1.5 1 53 45" className={className} aria-hidden="true" focusable="false">
      {/* lime underside gives the badge its 3D lift */}
      <rect x="4" y="13" width="44" height="31" rx="8" transform="rotate(-8 26 28)" fill="var(--color-primary)" stroke="var(--color-ink)" strokeWidth="3" />
      <rect x="4" y="9" width="44" height="31" rx="8" transform="rotate(-8 26 24)" fill="#FFFFFF" stroke="var(--color-ink)" strokeWidth="3" />
      <text x="25" y="32" textAnchor="middle" transform="rotate(-8 25 26)" fontFamily="var(--font-plus-jakarta), system-ui, sans-serif" fontWeight="800" fontSize="17" fill="var(--color-ink)">1%</text>
      {/* sparkle + rays */}
      <path d="M47 1.5l1.6 4.2 4.2 1.6-4.2 1.6-1.6 4.2-1.6-4.2-4.2-1.6 4.2-1.6z" fill="var(--color-primary)" stroke="var(--color-ink)" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M52.5 13.5l2.5-1M50.5 16.5l2 1.5" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function TichaLogo({ showTagline = true }: { showTagline?: boolean }) {
  return (
    <span className="flex items-center gap-[13px] select-none">
      <TichaBadge className="w-14 h-[50px] shrink-0 -translate-y-[4px]" />
      <span className="flex flex-col">
        <span className="text-[36px] leading-[1] font-extrabold tracking-[-0.02em] text-ink">
          Ticha <span className="text-primary-deep">AI</span>
        </span>
        {showTagline && (
          <span className="mt-[6px] text-[13px] leading-none font-medium text-ink whitespace-nowrap">
            Small Steps. Big Mastery.
          </span>
        )}
      </span>
    </span>
  );
}
