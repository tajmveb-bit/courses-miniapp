"use client";

import Link from "next/link";
import { Check, MessageCircleQuestion } from "lucide-react";
import { getMaterialById, materialTypeLabels } from "@/data/club";
import MaterialVisual from "@/components/MaterialVisual";
import SaveButton from "@/components/SaveButton";
import BackButton from "@/components/BackButton";
import { useProgress } from "@/lib/progress";
import { hapticImpact } from "@/lib/telegram";

interface MaterialPageProps {
  params: { id: string };
}

export default function MaterialPage({ params }: MaterialPageProps) {
  const material = getMaterialById(params.id);
  const { isCompleted, toggleCompleted } = useProgress();

  if (!material) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-lg font-semibold text-ink">Материал не найден</p>
        <Link href="/materials" className="tap-scale rounded-full bg-beige-dark px-6 py-3 text-sm font-semibold text-white">
          К материалам
        </Link>
      </main>
    );
  }

  const done = isCompleted(material.id);

  return (
    <main className="pb-32">
      <div className="relative animate-fade-up">
        <MaterialVisual type={material.type} className="h-64 w-full" iconClassName="w-12 h-12" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),20px)]">
          <BackButton fallbackHref="/materials" />
          <SaveButton materialId={material.id} variant="icon" />
        </div>
      </div>

      <div className="px-5">
        <div className="-mt-6 relative rounded-t-5xl bg-cream pt-6">
          <span className="text-xs font-medium uppercase tracking-wide text-beige-dark">
            День {material.day} · {materialTypeLabels[material.type]}
          </span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink leading-tight">
            {material.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{material.why}</p>

          <div className="mt-6 flex flex-col gap-2.5 rounded-3xl bg-white p-4 shadow-card">
            {material.points.map((point) => (
              <div key={point} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-beige-dark" />
                <p className="text-sm leading-relaxed text-ink-soft">{point}</p>
              </div>
            ))}
          </div>

          {material.checklistItems && (
            <div className="mt-4 flex flex-col gap-2 rounded-3xl bg-white p-4 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-beige-dark">Чек-лист</p>
              {material.checklistItems.map((item) => (
                <div key={item} className="flex items-center gap-2.5 py-1">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 border-beige-dark/40" />
                  <p className="text-sm text-ink-soft">{item}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 rounded-3xl bg-beige-light/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-beige-dark">Действие</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">{material.action}</p>
            {material.linkHref && (
              <Link
                href={material.linkHref}
                onClick={() => hapticImpact("light")}
                className="tap-scale mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-beige-dark"
              >
                {material.linkLabel ?? "Перейти"} →
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 px-5 pb-[max(env(safe-area-inset-bottom),16px)] pt-4">
        <div className="mx-auto max-w-md rounded-4xl bg-white/95 backdrop-blur-xl shadow-lifted px-4 pt-3 pb-4 border border-black/[0.03] flex items-center gap-3">
          <Link
            href="/ask"
            onClick={() => hapticImpact("light")}
            aria-label="Задать вопрос"
            className="tap-scale flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-beige-light"
          >
            <MessageCircleQuestion className="w-5 h-5 text-beige-dark" strokeWidth={1.8} />
          </Link>
          <button
            type="button"
            onClick={() => {
              hapticImpact("medium");
              toggleCompleted(material.id);
            }}
            className={`tap-scale flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold shadow-button ${
              done ? "bg-beige-light text-beige-dark" : "bg-beige-dark text-white"
            }`}
          >
            <Check className="w-5 h-5" strokeWidth={2.2} />
            {done ? "Выполнено" : "Отметить как выполненное"}
          </button>
        </div>
      </div>
    </main>
  );
}
