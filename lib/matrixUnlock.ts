"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "matrix:unlocked";

export function useMatrixUnlock() {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setUnlocked(window.localStorage.getItem(STORAGE_KEY) === "yes");
    } catch {
      // localStorage unavailable — stays locked.
    }
  }, []);

  const tryUnlock = useCallback(async (code: string) => {
    setChecking(true);
    setError(null);
    try {
      const res = await fetch("/api/matrix-unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.valid) {
        setUnlocked(true);
        try {
          window.localStorage.setItem(STORAGE_KEY, "yes");
        } catch {
          // ignore
        }
        return true;
      }
      setError("Неверный код. Проверьте и попробуйте ещё раз.");
      return false;
    } catch {
      setError("Не удалось проверить код. Попробуйте позже.");
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  return { unlocked, checking, error, tryUnlock };
}
