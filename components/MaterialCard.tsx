"use client";

import Link from "next/link";
import type { Material } from "@/data/club";
import { materialTypeLabels } from "@/data/club";
import MaterialVisual from "@/components/MaterialVisual";
import { hapticSelection } from "@/lib/telegram";

interface MaterialCardProps {
  material: Material;
}

export default function MaterialCard({ material }: MaterialCardProps) {
  return (
    <Link
      href={`/materials/${material.id}`}
      onClick={() => hapticSelection()}
      className="tap-scale group flex-shrink-0 w-[168px] rounded-3xl bg-white shadow-card overflow-hidden snap-start"
    >
      <MaterialVisual type={material.type} className="h-32 w-full" iconClassName="w-8 h-8" />
      <div className="p-3.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-beige-dark">
          {materialTypeLabels[material.type]}
        </span>
        <h3 className="mt-1 text-sm font-semibold text-ink leading-snug line-clamp-2">{material.title}</h3>
      </div>
    </Link>
  );
}
