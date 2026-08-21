"use client";

import { hapticSelection } from "@/lib/telegram";

export type CategoryFilter = "all" | "beginner" | "advanced" | "popular";

const TABS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "beginner", label: "Для начинающих" },
  { value: "advanced", label: "Продвинутые" },
  { value: "popular", label: "Популярное" },
];

interface CategoryTabsProps {
  active: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
}

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-1">
      {TABS.map((tab) => {
        const isActive = tab.value === active;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => {
              hapticSelection();
              onChange(tab.value);
            }}
            className={`tap-scale flex-shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-beige-dark text-white shadow-button"
                : "bg-white text-ink-soft shadow-card"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
