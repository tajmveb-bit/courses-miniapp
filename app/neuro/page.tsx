"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Zap, FileText } from "lucide-react";
import BackButton from "@/components/BackButton";
import {
  calculateConsciousnessNumber,
  getConsciousnessNumber,
  getProtocolStep3,
} from "@/data/consciousnessNumbers";
import { hapticImpact, openExternalLink, openTelegramBot } from "@/lib/telegram";

const PROTOCOL_STEPS_STATIC = [
  {
    title: "Шаг 1. Заметь тень",
    text: 'Как только накрывает эмоция — гнев, обида, ступор, желание всё бросить — скажи себе: «Стоп. Это не я. Это включилась моя программа». Назови её по имени.',
  },
  {
    title: "Шаг 2. Вопрос выбора",
    text: "Задай себе один честный вопрос: «То, что я сейчас хочу сделать, приближает меня к моей жизни или уводит от неё? Я сейчас наполняюсь или сливаю силы?»",
  },
];

export default function NeuroPage() {
  const [dayInput, setDayInput] = useState("");
  const [number, setNumber] = useState<number | null>(null);

  const day = Number(dayInput);
  const canCalculate = dayInput.length > 0 && day >= 1 && day <= 31;

  const handleCalculate = () => {
    if (!canCalculate) return;
    hapticImpact("medium");
    setNumber(calculateConsciousnessNumber(day));
  };

  const result = number !== null ? getConsciousnessNumber(number) : null;
  const step3 = number !== null ? getProtocolStep3(number) : null;

  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 flex items-center gap-3 animate-fade-up">
        <BackButton fallbackHref="/more" />
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Нейронастройка</h1>
      </div>

      <div className="px-5 mt-4 animate-fade-up [animation-delay:40ms] opacity-0">
        <button
          type="button"
          onClick={() => {
            hapticImpact("light");
            openExternalLink("/neuro-nastroika.pdf");
          }}
          className="tap-scale flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-beige-dark shadow-card"
        >
          <FileText className="w-4 h-4" strokeWidth={2} />
          Открыть PDF-плэйбук целиком
        </button>
      </div>

      <div className="px-5 mt-4 animate-fade-up [animation-delay:60ms] opacity-0">
        <div className="rounded-4xl bg-white shadow-soft p-6">
          <p className="text-sm text-ink-soft leading-relaxed">
            Число сознания считается только по дню рождения — месяц и год не нужны. Это
            число показывает, где у тебя обычно утекает энергия и какая «теневая программа»
            включается первой.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <input
              value={dayInput}
              onChange={(e) => setDayInput(e.target.value.replace(/\D/g, "").slice(0, 2))}
              inputMode="numeric"
              placeholder="ДД"
              className="w-20 rounded-2xl border border-black/10 bg-cream px-4 py-3 text-center text-base text-ink outline-none focus:border-beige-dark"
            />
            <p className="text-sm text-ink-soft">День рождения</p>
          </div>
          <button
            type="button"
            disabled={!canCalculate}
            onClick={handleCalculate}
            className="tap-scale mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white shadow-button disabled:opacity-40"
          >
            <Sparkles className="w-5 h-5" strokeWidth={2} />
            Узнать число сознания
          </button>
        </div>
      </div>

      {result && step3 && (
        <>
          <div className="px-5 mt-6 animate-fade-up [animation-delay:100ms] opacity-0">
            <div className="rounded-4xl bg-white shadow-soft p-6 flex items-center gap-4">
              <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-beige-dark text-2xl font-semibold text-white shadow-button">
                {result.id}
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-beige-dark">
                  Число сознания · рождённые {result.birthDays}
                </p>
                <p className="mt-1 text-lg font-semibold text-ink">{result.planet}</p>
                <p className="text-sm text-ink-soft">{result.archetype}</p>
              </div>
            </div>
          </div>

          <div className="px-5 mt-4 animate-fade-up [animation-delay:120ms] opacity-0 flex flex-col gap-3">
            <div className="rounded-3xl bg-white shadow-card p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-beige-dark">Где утекает энергия</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{result.energyLeak}</p>
            </div>

            <div className="rounded-3xl bg-white shadow-card p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-beige-dark">Вирус «{result.virusName}»</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{result.virusText}</p>
            </div>

            <div className="rounded-3xl bg-white shadow-card p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-beige-dark">Деньги</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{result.money}</p>
            </div>

            <div className="rounded-3xl bg-ink p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-beige-light">Задача на нейронастройку</p>
              <p className="mt-2 text-sm leading-relaxed text-white/90">{result.task}</p>
            </div>
          </div>

          <div className="px-5 mt-8 animate-fade-up [animation-delay:140ms] opacity-0">
            <h2 className="text-lg font-semibold text-ink mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-beige-dark" strokeWidth={2} />
              Протокол «Сайфер»
            </h2>
            <p className="text-sm text-ink-soft leading-relaxed mb-3">
              Программу не убрать — это твоя прошивка. Но можно не нажимать «enter», когда
              она предлагает привычную реакцию. Четыре шага.
            </p>
            <div className="flex flex-col gap-3">
              {PROTOCOL_STEPS_STATIC.map((step) => (
                <div key={step.title} className="rounded-3xl bg-white shadow-card p-4">
                  <p className="text-sm font-semibold text-ink">{step.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{step.text}</p>
                </div>
              ))}

              <div className="rounded-3xl bg-white shadow-card p-4">
                <p className="text-sm font-semibold text-ink">Шаг 3. Обратный ход</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  Твоя группа ({step3.group}) — реакция: {step3.reaction}.
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">Вместо этого: {step3.instead}.</p>
              </div>

              <div className="rounded-3xl bg-white shadow-card p-4">
                <p className="text-sm font-semibold text-ink">Шаг 4. Закрепи</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  Вечером запиши три строки: где сегодня включилась тень, что ты выбрал(а) вместо
                  неё и что изменилось. Новая реакция становится привычкой через повторение, а
                  не через одно озарение.
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 mt-8 animate-fade-up [animation-delay:160ms] opacity-0">
            <div className="rounded-4xl bg-beige-dark p-6 text-center text-white shadow-lifted">
              <h3 className="text-lg font-semibold">Это только число сознания</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Малая часть карты — твоё «хочу». А ещё есть «делаю»: задача, деньги,
                отношения и личные периоды в Матрице судьбы.
              </p>
              <Link
                href="/matrix"
                onClick={() => hapticImpact("light")}
                className="tap-scale mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-base font-semibold text-beige-dark shadow-button"
              >
                Рассчитать Матрицу судьбы
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
              <button
                type="button"
                onClick={() => {
                  hapticImpact("light");
                  openTelegramBot("consult");
                }}
                className="tap-scale mt-2.5 w-full rounded-full px-6 py-3 text-sm font-medium text-white/80"
              >
                Или записаться на личную консультацию
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
