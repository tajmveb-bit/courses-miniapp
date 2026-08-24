"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "club:progress";
const PROGRESS_EVENT = "club:progress-changed";

interface DiagnosisResult {
  focusId: string;
  completedAt: string;
}

interface ProgressState {
  saved: string[];
  completed: string[];
  reminders: string[];
  diagnosis: DiagnosisResult | null;
}

const EMPTY: ProgressState = { saved: [], completed: [], reminders: [], diagnosis: null };

function readProgress(): ProgressState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return {
      saved: Array.isArray(parsed.saved) ? parsed.saved.filter((id: unknown) => typeof id === "string") : [],
      completed: Array.isArray(parsed.completed)
        ? parsed.completed.filter((id: unknown) => typeof id === "string")
        : [],
      reminders: Array.isArray(parsed.reminders)
        ? parsed.reminders.filter((id: unknown) => typeof id === "string")
        : [],
      diagnosis: parsed.diagnosis && typeof parsed.diagnosis.focusId === "string" ? parsed.diagnosis : null,
    };
  } catch {
    return EMPTY;
  }
}

function writeProgress(state: ProgressState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  } catch {
    // Storage unavailable — progress just won't persist.
  }
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(readProgress());
    setReady(true);

    const handleChange = () => setState(readProgress());
    window.addEventListener(PROGRESS_EVENT, handleChange);
    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  const toggleSaved = useCallback((materialId: string) => {
    setState((prev) => {
      const saved = prev.saved.includes(materialId)
        ? prev.saved.filter((id) => id !== materialId)
        : [...prev.saved, materialId];
      const next = { ...prev, saved };
      writeProgress(next);
      return next;
    });
  }, []);

  const toggleCompleted = useCallback((materialId: string) => {
    setState((prev) => {
      const completed = prev.completed.includes(materialId)
        ? prev.completed.filter((id) => id !== materialId)
        : [...prev.completed, materialId];
      const next = { ...prev, completed };
      writeProgress(next);
      return next;
    });
  }, []);

  const toggleReminder = useCallback((liveId: string) => {
    setState((prev) => {
      const reminders = prev.reminders.includes(liveId)
        ? prev.reminders.filter((id) => id !== liveId)
        : [...prev.reminders, liveId];
      const next = { ...prev, reminders };
      writeProgress(next);
      return next;
    });
  }, []);

  const saveDiagnosis = useCallback((focusId: string) => {
    setState((prev) => {
      const next = { ...prev, diagnosis: { focusId, completedAt: new Date().toISOString() } };
      writeProgress(next);
      return next;
    });
  }, []);

  return {
    ready,
    saved: state.saved,
    completed: state.completed,
    reminders: state.reminders,
    diagnosis: state.diagnosis,
    isSaved: (id: string) => state.saved.includes(id),
    isCompleted: (id: string) => state.completed.includes(id),
    isReminded: (id: string) => state.reminders.includes(id),
    toggleSaved,
    toggleCompleted,
    toggleReminder,
    saveDiagnosis,
  };
}
