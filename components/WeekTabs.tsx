"use client";

import { weeks } from "@/data/club";
import { hapticSelection } from "@/lib/telegram";

interface WeekTabsProps {
  active: string;
  onChange: (weekId: string) => void;
}

export default function WeekTabs({ active, onChange }: WeekTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-1">
      {weeks.map((week) => {
        const isActive = week.id === active;
        return (
          <button
            key={week.id}
            type="button"
            onClick={() => {
              hapticSelection();
              onChange(week.id);
            }}
            className={`tap-scale flex-shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive ? "bg-beige-dark text-white shadow-button" : "bg-white text-ink-soft shadow-card"
            }`}
          >
            Неделя {week.index}
          </button>
        );
      })}
    </div>
  );
}
