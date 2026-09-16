"use client";

import { useCallback, useEffect, useState } from "react";
import type { Section } from "@/lib/unlockCodes";

function storageKey(section: Section) {
  return `matrix:unlocked:${section}`;
}

// Fires whenever any instance of this hook unlocks, so other instances mounted elsewhere on the
// same page (e.g. a page reading `unlocked` directly alongside its own <UnlockGate>) pick up the
// change immediately instead of only on their own next mount.
function eventName(section: Section) {
  return `matrix-unlock-changed:${section}`;
}

function readUnlocked(section: Section): boolean {
  try {
    return window.localStorage.getItem(storageKey(section)) === "yes";
  } catch {
    return false;
  }
}

export function useMatrixUnlock(section: Section) {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUnlocked(readUnlocked(section));
    const onChange = () => setUnlocked(readUnlocked(section));
    window.addEventListener(eventName(section), onChange);
    return () => window.removeEventListener(eventName(section), onChange);
  }, [section]);

  const tryUnlock = useCallback(
    async (code: string) => {
      setChecking(true);
      setError(null);
      try {
        const res = await fetch("/api/matrix-unlock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, section }),
        });
        const data = await res.json();
        if (data.valid) {
          try {
            window.localStorage.setItem(storageKey(section), "yes");
          } catch {
            // ignore
          }
          setUnlocked(true);
          window.dispatchEvent(new Event(eventName(section)));
          return true;
        }
        setError("Неверный или уже использованный код. Проверьте и попробуйте ещё раз.");
        return false;
      } catch {
        setError("Не удалось проверить код. Попробуйте позже.");
        return false;
      } finally {
        setChecking(false);
      }
    },
    [section]
  );

  return { unlocked, checking, error, tryUnlock };
}
