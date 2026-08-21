"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "alina-courses:favorites";

function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeFavorites(ids: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage unavailable — ignore, favorites just won't persist.
  }
}

const FAVORITES_EVENT = "alina-courses:favorites-changed";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFavorites(readFavorites());
    setReady(true);

    const handleChange = () => setFavorites(readFavorites());
    window.addEventListener(FAVORITES_EVENT, handleChange);
    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  const toggleFavorite = useCallback((courseId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId];
      writeFavorites(next);
      window.dispatchEvent(new Event(FAVORITES_EVENT));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (courseId: string) => favorites.includes(courseId),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite, ready };
}
