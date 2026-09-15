"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "matrix:unlocked";
// Fires whenever any instance of this hook unlocks, so other instances mounted elsewhere on the
// same page (e.g. a page reading `unlocked` directly alongside its own <UnlockGate>) pick up the
// change immediately instead of only on their own next mount.
const UNLOCK_EVENT = "matrix-unlock-changed";

function readUnlocked(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "yes";
  } catch {
    return false;
  }
}

export function useMatrixUnlock() {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUnlocked(readUnlocked());
    const onChange = () => setUnlocked(readUnlocked());
    window.addEventListener(UNLOCK_EVENT, onChange);
    return () => window.removeEventListener(UNLOCK_EVENT, onChange);
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
        try {
          window.localStorage.setItem(STORAGE_KEY, "yes");
        } catch {
          // ignore
        }
        setUnlocked(true);
        window.dispatchEvent(new Event(UNLOCK_EVENT));
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
