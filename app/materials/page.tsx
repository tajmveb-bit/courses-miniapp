"use client";

import { useMemo, useState } from "react";
import { getWeekMaterials, weeks } from "@/data/club";
import WeekTabs from "@/components/WeekTabs";
import MaterialListItem from "@/components/MaterialListItem";

export default function MaterialsPage() {
  const [weekId, setWeekId] = useState(weeks[0].id);

  const weekMaterials = useMemo(() => getWeekMaterials(weekId), [weekId]);
  const activeWeek = weeks.find((w) => w.id === weekId);

  return (
    <main className="pt-safe-t pb-8">
      <div className="px-5 pt-6 animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Материалы недели</h1>
      </div>

      <div className="mt-5 animate-fade-up [animation-delay:60ms] opacity-0">
        <WeekTabs active={weekId} onChange={setWeekId} />
      </div>

      {activeWeek && (
        <p className="mt-4 px-5 text-sm leading-relaxed text-ink-soft animate-fade-up [animation-delay:80ms] opacity-0">
          {activeWeek.goal}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3 px-5 animate-fade-up [animation-delay:120ms] opacity-0">
        {weekMaterials.map((material) => (
          <MaterialListItem key={material.id} material={material} />
        ))}
      </div>
    </main>
  );
}
