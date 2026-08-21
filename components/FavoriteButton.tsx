"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { hapticImpact } from "@/lib/telegram";

interface FavoriteButtonProps {
  courseId: string;
  variant?: "pill" | "icon";
}

export default function FavoriteButton({ courseId, variant = "pill" }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, ready } = useFavorites();
  const active = ready && isFavorite(courseId);

  const handleClick = () => {
    hapticImpact("light");
    toggleFavorite(courseId);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={active ? "Убрать из избранного" : "Добавить в избранное"}
        className="tap-scale flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-card"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            active ? "fill-beige-dark text-beige-dark" : "text-ink"
          }`}
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
      <Heart
        className={`w-4 h-4 transition-colors ${
          active ? "fill-beige-dark text-beige-dark" : "text-ink-soft"
        }`}
        strokeWidth={1.8}
      />
      {active ? "В избранном" : "Добавить в избранное"}
    </button>
  );
}
