import { Award, BookOpen, Infinity as InfinityIcon, Layers } from "lucide-react";
import type { CourseCharacteristic } from "@/data/courses";

const ICONS = {
  book: BookOpen,
  layers: Layers,
  infinity: InfinityIcon,
  award: Award,
} as const;

interface CourseCharacteristicsProps {
  items: CourseCharacteristic[];
}

export default function CourseCharacteristics({ items }: CourseCharacteristicsProps) {
  return (
    <div className="flex flex-col gap-2.5 rounded-3xl bg-white p-2 shadow-card">
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        return (
          <div key={item.title} className="flex items-center gap-3 rounded-2xl px-3 py-2.5">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-beige-light">
              <Icon className="w-5 h-5 text-beige-dark" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink leading-snug">{item.title}</p>
              <p className="mt-0.5 text-xs text-ink-soft leading-snug">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
