"use client";

import { useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import type { Module } from "@/data/courses";
import { hapticSelection } from "@/lib/telegram";

interface CourseModulesProps {
  modules: Module[];
}

export default function CourseModules({ modules }: CourseModulesProps) {
  const [openId, setOpenId] = useState<string | null>(modules[0]?.id ?? null);

  const toggle = (id: string) => {
    hapticSelection();
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-3">
      {modules.map((module) => {
        const isOpen = module.id === openId;
        return (
          <div
            key={module.id}
            className="rounded-3xl bg-white shadow-card overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggle(module.id)}
              className="tap-scale flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
            >
              <span className="text-[15px] font-semibold text-ink">{module.title}</span>
              <ChevronDown
                className={`w-5 h-5 flex-shrink-0 text-beige-dark transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className="grid transition-all duration-300 ease-out"
              style={{
                gridTemplateRows: isOpen ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-0.5 px-5 pb-4">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between gap-3 rounded-2xl px-2 py-2.5"
                    >
                      <span className="text-sm text-ink-soft leading-snug">
                        {lesson.title}
                      </span>
                      <span className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-ink-soft/70">{lesson.duration}</span>
                        <Lock className="w-3.5 h-3.5 text-ink-soft/50" strokeWidth={2} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
