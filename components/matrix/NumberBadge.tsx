"use client";

import { hapticSelection } from "@/lib/telegram";

interface NumberBadgeProps {
  value: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const SIZE_CLASSES: Record<NonNullable<NumberBadgeProps["size"]>, string> = {
  sm: "w-9 h-9 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-16 h-16 text-xl",
};

export default function NumberBadge({ value, label, size = "md", onClick }: NumberBadgeProps) {
  return (
    <button
      type="button"
      onClick={() => {
        hapticSelection();
        onClick?.();
      }}
      className="tap-scale flex flex-col items-center gap-1.5"
    >
      <span
        className={`flex items-center justify-center rounded-full bg-beige-dark font-semibold text-white shadow-button ${SIZE_CLASSES[size]}`}
      >
        {value}
      </span>
      {label && <span className="text-[11px] text-ink-soft text-center leading-tight max-w-[64px]">{label}</span>}
    </button>
  );
}
