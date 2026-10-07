"use client";

import { MessageCircle } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import { hapticImpact, openTelegramBot } from "@/lib/telegram";

const TOPICS = ["Матрица судьбы", "Прогноз", "Отношения", "Совместимость", "Консультация", "Другое"];

export default function AskPage() {
  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Задать вопрос</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Бот Сайфер ответит на основные вопросы и подскажет, что подойдёт именно вам — пишите
          прямо туда, в приложении переписку мы не ведём.
        </p>
      </div>

      <div className="px-5 mt-5 animate-fade-up [animation-delay:60ms] opacity-0">
        <p className="text-xs font-medium text-ink-soft mb-2">Можно спросить, например, про:</p>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink-soft shadow-card"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5">
          <Disclaimer text="Клуб носит информационно-образовательный характер. Разборы не заменяют очную консультацию и не являются предсказанием будущего в буквальном смысле." />
        </div>

        <button
          type="button"
          onClick={() => {
            hapticImpact("medium");
            openTelegramBot("ask");
          }}
          className="tap-scale mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white shadow-button"
        >
          <MessageCircle className="w-5 h-5" strokeWidth={2} />
          Задать вопрос боту
        </button>
      </div>
    </main>
  );
}
