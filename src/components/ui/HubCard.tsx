import React from "react";
import Link from "next/link";
import { ArrowRight01Icon } from "hugeicons-react";
import { hapticTap } from "@/lib/haptics";

type HubCardSize = "lg" | "md" | "banner";

interface HubCardProps {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  /** Tailwind background token class, e.g. "bg-card-sky". */
  tint: string;
  size?: HubCardSize;
  /** Decorative element on the right of a banner (aria-hidden). */
  decoration?: React.ReactNode;
  id?: string;
}

/*
 * Measured from design/Ticha AI Web View - Explore.png:
 *   lg     226px tall, 80px icon circle, 21px title, 41px arrow
 *   md     200px tall, 64px icon circle, 18px title, 39px arrow
 *   banner  98px tall, 64px icon circle, 20px title, 41px arrow
 * All: 2px ink border, 14px radius, 5px hard shadow.
 */
const SIZES: Record<HubCardSize, { card: string; icon: string; title: string; subtitle: string; arrow: string; arrowIcon: number; arrowPos: string }> = {
  lg: {
    card: "h-[226px] flex-col pt-[25px] pl-[25px] pr-[21px] pb-[15px]",
    icon: "w-20 h-20 border-[3px]",
    title: "mt-[16px] text-[21px]",
    subtitle: "mt-[9px] text-[16px] leading-[21px] max-w-[230px]",
    arrow: "w-[41px] h-[41px]",
    arrowIcon: 22,
    arrowPos: "right-[21px] bottom-[15px]",
  },
  md: {
    card: "h-[200px] flex-col pt-[21px] pl-[22px] pr-[16px] pb-[17px]",
    icon: "w-16 h-16 border-[3px]",
    title: "mt-[17px] text-[18px]",
    subtitle: "mt-[9px] text-[16px] leading-[21px] max-w-[175px]",
    arrow: "w-[39px] h-[39px]",
    arrowIcon: 20,
    arrowPos: "right-[16px] bottom-[17px]",
  },
  banner: {
    card: "h-[98px] items-center pl-[22px] pr-[17px]",
    icon: "w-16 h-16 border-[3px]",
    title: "text-[20px]",
    subtitle: "mt-[8px] text-[15px] leading-none",
    arrow: "w-[41px] h-[41px]",
    arrowIcon: 22,
    arrowPos: "",
  },
};

export default function HubCard({ href, title, subtitle, icon, tint, size = "md", decoration, id }: HubCardProps) {
  const s = SIZES[size];
  const iconCircle = (
    <span className={`${s.icon} shrink-0 rounded-full bg-white border-ink flex items-center justify-center`} aria-hidden="true">
      {icon}
    </span>
  );
  const arrow = (
    <span className={`${s.arrow} shrink-0 rounded-full bg-white border-[2.5px] border-ink flex items-center justify-center transition-transform group-hover:translate-x-0.5`} aria-hidden="true">
      <ArrowRight01Icon size={s.arrowIcon} className="text-ink" />
    </span>
  );

  return (
    <Link
      href={href}
      id={id}
      onClick={() => hapticTap()}
      className={`group relative flex ${s.card} ${tint} border-2 border-ink rounded-[14px] shadow-[5px_5px_0_0_var(--color-ink)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[6px_7px_0_0_var(--color-ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0_0_var(--color-ink)] outline-none focus-visible:ring-[3px] focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-cream overflow-hidden`}
    >
      {size === "banner" ? (
        <>
          {iconCircle}
          <span className="ml-[20px] flex flex-col min-w-0">
            <span className={`${s.title} font-bold text-ink leading-none`}>{title}</span>
            <span className={`${s.subtitle} font-normal text-ink`}>{subtitle}</span>
          </span>
          {decoration && <span className="ml-auto mr-6 pointer-events-none" aria-hidden="true">{decoration}</span>}
          <span className={decoration ? "" : "ml-auto"}>{arrow}</span>
        </>
      ) : (
        <>
          {iconCircle}
          <span className={`${s.title} font-bold text-ink leading-none`}>{title}</span>
          <span className={`${s.subtitle} font-normal text-ink`}>{subtitle}</span>
          <span className={`absolute ${s.arrowPos}`}>{arrow}</span>
        </>
      )}
    </Link>
  );
}
