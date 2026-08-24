"use client";

import Link from "next/link";
import { getWeekMaterials, weeks } from "@/data/club";
import MaterialCard from "@/components/MaterialCard";

export default function WeekMaterials() {
  const currentWeek = weeks[0];
  const weekMaterials = getWeekMaterials(currentWeek.id);

  return (
    <section className="mt-8 animate-fade-up [animation-delay:80ms] opacity-0">
      <div className="px-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-ink">Материалы недели</h2>
        <Link href="/materials" className="tap-scale text-sm font-medium text-beige-dark">
          Смотреть все
        </Link>
      </div>

      <div className="mt-4 flex gap-4 overflow-x-auto no-scrollbar px-5 pb-2 snap-x snap-mandatory">
        {weekMaterials.map((material) => (
          <MaterialCard key={material.id} material={material} />
        ))}
      </div>
    </section>
  );
}
