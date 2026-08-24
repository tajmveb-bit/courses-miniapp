"use client";

import { Bookmark } from "lucide-react";
import { useProgress } from "@/lib/progress";
import { hapticImpact } from "@/lib/telegram";

interface SaveButtonProps {
  materialId: string;
  variant?: "pill" | "icon";
}

export default function SaveButton({ materialId, variant = "pill" }: SaveButtonProps) {
  const { isSaved, toggleSaved, ready } = useProgress();
  const active = ready && isSaved(materialId);

  const handleClick = () => {
    hapticImpact("light");
    toggleSaved(materialId);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={active ? "Убрать из сохранённого" : "Сохранить материал"}
        className="tap-scale flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-card"
      >
        <Bookmark
          className={`w-5 h-5 transition-colors ${active ? "fill-beige-dark text-beige-dark" : "text-ink"}`}
          strokeWidth={1.8}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="tap-scale flex items-center justify-center gap-2 text-sm font-medium text-ink-soft"
    >
      <Bookmark
        className={`w-4 h-4 transition-colors ${active ? "fill-beige-dark text-beige-dark" : "text-ink-soft"}`}
        strokeWidth={1.8}
      />
      {active ? "Сохранено" : "Сохранить материал"}
    </button>
  );
}
