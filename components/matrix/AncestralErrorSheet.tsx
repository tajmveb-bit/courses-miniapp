"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { AncestralError } from "@/data/matrixAncestralErrors";

interface AncestralErrorSheetProps {
  data: { label: string; error: AncestralError } | null;
  onClose: () => void;
}

export default function AncestralErrorSheet({ data, onClose }: AncestralErrorSheetProps) {
  return (
    <AnimatePresence>
      {data && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-5xl bg-white px-6 pb-[max(env(safe-area-inset-bottom),24px)] pt-3 shadow-lifted"
          >
            <div className="mx-auto h-1.5 w-10 rounded-full bg-beige-light" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="tap-scale absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-beige-light"
            >
              <X className="w-4 h-4 text-ink-soft" strokeWidth={2} />
            </button>
            <div className="mt-6 pb-2">
              <p className="text-xs font-medium uppercase tracking-wide text-beige-dark">{data.label}</p>
              <h3 className="mt-1 text-2xl font-semibold text-ink">{data.error.name}</h3>

              <p className="mt-4 text-sm font-semibold text-ink">Проблемы в роду</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{data.error.problems}</p>

              <p className="mt-4 text-sm font-semibold text-ink">Задача</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{data.error.task}</p>

              <p className="mt-4 text-sm font-semibold text-ink">Рекомендации</p>
              <ul className="mt-1 flex flex-col gap-1.5">
                {data.error.recommendations.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink-soft">
                    <span className="text-beige-dark">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
