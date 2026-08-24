"use client";

import Link from "next/link";
import { Lock, Percent } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import { DISCOUNT_WARNING, discountCategories, getTasksAndChecklists } from "@/data/club";
import { useProgress } from "@/lib/progress";
import { hapticImpact } from "@/lib/telegram";

export default function DiscountsPage() {
  const { completed, ready } = useProgress();

  const tasksAndChecklists = getTasksAndChecklists();
  const doneCount = ready ? tasksAndChecklists.filter((m) => completed.includes(m.id)).length : 0;

  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Мои скидки</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Скидки открываются за выполнение заданий и чек-листов клуба. Точную цену и условия
          уточняет администратор.
        </p>
      </div>

      <div className="mx-5 mt-4 rounded-3xl bg-white p-4 shadow-card animate-fade-up [animation-delay:40ms] opacity-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">Выполнено заданий и чек-листов</p>
          <p className="text-sm font-medium text-beige-dark">
            {doneCount}/{tasksAndChecklists.length}
          </p>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-beige-light overflow-hidden">
          <div
            className="h-full rounded-full bg-beige-dark transition-all"
            style={{ width: `${tasksAndChecklists.length ? (doneCount / tasksAndChecklists.length) * 100 : 0}%` }}
          />
        </div>
        <Link
          href="/tasks"
          onClick={() => hapticImpact("light")}
          className="tap-scale mt-3 inline-flex text-xs font-semibold text-beige-dark"
        >
          Перейти к заданиям →
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-3 px-5 animate-fade-up [animation-delay:80ms] opacity-0">
        {discountCategories.map((discount) => {
          const unlocked = doneCount >= discount.requiredCompleted;
          return (
            <div
              key={discount.id}
              className={`flex items-center gap-4 rounded-3xl bg-white p-4 shadow-card ${unlocked ? "" : "opacity-60"}`}
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-beige-light">
                {unlocked ? (
                  <Percent className="w-5 h-5 text-beige-dark" strokeWidth={1.8} />
                ) : (
                  <Lock className="w-5 h-5 text-beige-dark" strokeWidth={1.8} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">{discount.title}</p>
                <p className="mt-0.5 text-[13px] text-ink-soft leading-snug">
                  {unlocked
                    ? discount.description
                    : `Откроется после ${discount.requiredCompleted} заданий/чек-листов (сейчас ${doneCount})`}
                </p>
              </div>
              <span className="flex-shrink-0 text-lg font-semibold text-beige-dark">
                {unlocked ? `-${discount.percent}%` : `${discount.percent}%`}
              </span>
            </div>
          );
        })}

        <Disclaimer text={DISCOUNT_WARNING} />
      </div>
    </main>
  );
}
