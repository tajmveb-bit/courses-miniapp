"use client";

import { materials, weeks } from "@/data/club";
import MaterialListItem from "@/components/MaterialListItem";

export default function TasksPage() {
  const tasks = materials.filter((m) => m.type === "task" || m.type === "checklist");

  return (
    <main className="pt-safe-t pb-8">
      <div className="px-5 pt-6 animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Задания и чек-листы</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Каждое задание занимает 10–20 минут и даёт понятный результат.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-6 px-5 animate-fade-up [animation-delay:80ms] opacity-0">
        {weeks.map((week) => {
          const weekTasks = tasks.filter((t) => t.weekId === week.id);
          if (weekTasks.length === 0) return null;
          return (
            <div key={week.id}>
              <p className="text-xs font-semibold uppercase tracking-wide text-beige-dark">
                Неделя {week.index}
              </p>
              <div className="mt-2.5 flex flex-col gap-3">
                {weekTasks.map((task) => (
                  <MaterialListItem key={task.id} material={task} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
