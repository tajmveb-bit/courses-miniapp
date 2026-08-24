"use client";

import { materials } from "@/data/club";
import { useProgress } from "@/lib/progress";
import MaterialCard from "@/components/MaterialCard";

export default function SavedMaterials() {
  const { saved, ready } = useProgress();

  if (!ready || saved.length === 0) return null;

  const savedMaterials = materials.filter((material) => saved.includes(material.id));
  if (savedMaterials.length === 0) return null;

  return (
    <section className="mt-8 animate-fade-up [animation-delay:120ms] opacity-0">
      <div className="px-5 flex items-center gap-2">
        <h2 className="text-xl font-semibold text-ink">Сохранённое</h2>
      </div>

      <div className="mt-4 flex gap-4 overflow-x-auto no-scrollbar px-5 pb-2 snap-x snap-mandatory">
        {savedMaterials.map((material) => (
          <MaterialCard key={material.id} material={material} />
        ))}
      </div>
    </section>
  );
}
