import React from "react";

export type BadgeVariant = "primary" | "white" | "gold" | "dark" | "danger";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export default function Badge({
  variant = "white",
  children,
  className = "",
  ...props
}: BadgeProps) {
  const variantClasses: Record<BadgeVariant, string> = {
    white: "bg-white text-black",
    primary: "bg-[#B6FF00] text-black",
    gold: "bg-[#965A18] text-white",
    dark: "bg-black text-white",
    danger: "bg-[#FF9494] text-black",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-[2.5px] border-black font-extrabold text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] select-none ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
