"use client";

import { getWeekMaterials, weeks, focuses } from "@/data/club";
import { useProgress } from "@/lib/progress";

export default function ProgressPage() {
  const { completed, saved, diagnosis, ready } = useProgress();

  const focus = diagnosis ? focuses[diagnosis.focusId] : null;

  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Мой прогресс</h1>
      </div>

      {focus && (
        <div className="mx-5 mt-5 rounded-4xl bg-white shadow-card p-5 animate-fade-up [animation-delay:40ms] opacity-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-beige-dark">Мой стартовый фокус</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">{focus.title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{focus.description}</p>
        </div>
      )}

      <div className="mx-5 mt-4 grid grid-cols-2 gap-3 animate-fade-up [animation-delay:80ms] opacity-0">
        <div className="rounded-3xl bg-white p-4 shadow-card">
          <p className="text-2xl font-semibold text-ink">{ready ? completed.length : "—"}</p>
          <p className="mt-0.5 text-xs text-ink-soft">Материалов выполнено</p>
        </div>
        <div className="rounded-3xl bg-white p-4 shadow-card">
          <p className="text-2xl font-semibold text-ink">{ready ? saved.length : "—"}</p>
          <p className="mt-0.5 text-xs text-ink-soft">Сохранено на потом</p>
        </div>
      </div>

      <div className="mx-5 mt-5 flex flex-col gap-3 animate-fade-up [animation-delay:120ms] opacity-0">
        {weeks.map((week) => {
          const weekMaterials = getWeekMaterials(week.id);
          const done = weekMaterials.filter((m) => completed.includes(m.id)).length;
          return (
            <div key={week.id} className="rounded-3xl bg-white p-4 shadow-card">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">
                  Неделя {week.index} · {week.title}
                </p>
                <p className="text-sm text-beige-dark font-medium">
                  {done}/{weekMaterials.length}
                </p>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-beige-light overflow-hidden">
                <div
                  className="h-full rounded-full bg-beige-dark transition-all"
                  style={{ width: `${weekMaterials.length ? (done / weekMaterials.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
