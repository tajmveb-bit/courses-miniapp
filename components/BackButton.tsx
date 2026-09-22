"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { hapticSelection } from "@/lib/telegram";

interface BackButtonProps {
  fallbackHref?: string;
  className?: string;
  variant?: "light" | "solid";
}

export default function BackButton({
  fallbackHref = "/",
  className = "",
  variant = "light",
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    hapticSelection();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Назад"
      className={`tap-scale flex h-11 w-11 items-center justify-center rounded-full shadow-card ${
        variant === "solid" ? "bg-beige-dark" : "bg-white/90 backdrop-blur-sm"
      } ${className}`}
    >
      <ChevronLeft
        className={`w-5 h-5 ${variant === "solid" ? "text-white" : "text-ink"}`}
        strokeWidth={2}
      />
    </button>
  );
}
