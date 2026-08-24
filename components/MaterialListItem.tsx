"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { Material } from "@/data/club";
import { materialTypeLabels } from "@/data/club";
import MaterialVisual from "@/components/MaterialVisual";
import { useProgress } from "@/lib/progress";
import { hapticSelection } from "@/lib/telegram";

interface MaterialListItemProps {
  material: Material;
}

export default function MaterialListItem({ material }: MaterialListItemProps) {
  const { isCompleted, ready } = useProgress();
  const done = ready && isCompleted(material.id);

  return (
    <Link
      href={`/materials/${material.id}`}
      onClick={() => hapticSelection()}
      className="tap-scale flex items-stretch gap-4 rounded-3xl bg-white p-3 shadow-card"
    >
      <MaterialVisual type={material.type} className="w-24 h-24 flex-shrink-0 rounded-2xl" iconClassName="w-7 h-7" />

      <div className="flex flex-1 flex-col justify-center min-w-0 py-1">
        <span className="text-[11px] font-medium uppercase tracking-wide text-beige-dark">
          День {material.day} · {materialTypeLabels[material.type]}
        </span>
        <h3 className="mt-0.5 text-[15px] font-semibold text-ink leading-snug line-clamp-2">
          {material.title}
        </h3>
        <p className="mt-1 text-[13px] text-ink-soft leading-relaxed line-clamp-2">{material.action}</p>
      </div>

      <div className="flex items-center pr-1">
        <span
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
            done ? "bg-beige-dark" : "bg-beige-light"
          }`}
        >
          {done ? (
            <Check className="w-4 h-4 text-white" strokeWidth={2.4} />
          ) : (
            <ArrowRight className="w-4 h-4 text-beige-dark" strokeWidth={2} />
          )}
        </span>
      </div>
    </Link>
  );
}
