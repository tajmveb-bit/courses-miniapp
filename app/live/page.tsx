"use client";

import { Bell, BellRing, Radio } from "lucide-react";
import { liveSessions } from "@/data/club";
import { useProgress } from "@/lib/progress";
import { hapticImpact } from "@/lib/telegram";

export default function LivePage() {
  const { isReminded, toggleReminder } = useProgress();

  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Эфиры и расписание</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Живые разборы и вопросы участниц. После эфира — краткое резюме в материалах.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3 px-5 animate-fade-up [animation-delay:80ms] opacity-0">
        {liveSessions.map((session) => {
          const reminded = isReminded(session.id);
          return (
            <div key={session.id} className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-card">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-beige-light">
                <Radio className="w-5 h-5 text-beige-dark" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">
                  {session.date} · {session.time}
                </p>
                <p className="mt-0.5 text-[13px] text-ink-soft leading-snug">{session.topic}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  hapticImpact("light");
                  toggleReminder(session.id);
                }}
                aria-label="Напомнить"
                className={`tap-scale flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                  reminded ? "bg-beige-dark" : "bg-beige-light"
                }`}
              >
                {reminded ? (
                  <BellRing className="w-4 h-4 text-white" strokeWidth={2} />
                ) : (
                  <Bell className="w-4 h-4 text-beige-dark" strokeWidth={1.8} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
