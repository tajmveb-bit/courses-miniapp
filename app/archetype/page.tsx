"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import BackButton from "@/components/BackButton";
import {
  ARCHETYPE_QUESTIONS,
  ARCHETYPES,
  ARCHETYPE_ORDER,
  type ArchetypeKey,
} from "@/data/archetypes";
import { hapticImpact, hapticSelection, requestBotAccess } from "@/lib/telegram";

const ROMAN = ["I", "II", "III", "IV"];
const STEP_NUM = ["01", "02", "03", "04"];

type Phase = "intro" | "quiz" | "result";

function emptyScores(): Record<ArchetypeKey, number> {
  const scores = {} as Record<ArchetypeKey, number>;
  ARCHETYPE_ORDER.forEach((k) => (scores[k] = 0));
  return scores;
}

export default function ArchetypePage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState<Record<ArchetypeKey, number>>(emptyScores());
  const [picks, setPicks] = useState<ArchetypeKey[]>([]);

  const restart = () => {
    setIdx(0);
    setScores(emptyScores());
    setPicks([]);
    setPhase("quiz");
  };

  const choose = (key: ArchetypeKey) => {
    hapticSelection();
    setScores((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    setPicks((prev) => [...prev, key]);
    if (idx + 1 < ARCHETYPE_QUESTIONS.length) {
      setIdx((i) => i + 1);
    } else {
      setPhase("result");
    }
  };

  const goBack = () => {
    if (idx === 0) return;
    hapticImpact("light");
    const lastKey = picks[picks.length - 1];
    setScores((prev) => ({ ...prev, [lastKey]: prev[lastKey] - 1 }));
    setPicks((prev) => prev.slice(0, -1));
    setIdx((i) => i - 1);
  };

  const sorted = ARCHETYPE_ORDER.slice().sort((a, b) => scores[b] - scores[a]);
  const primary = ARCHETYPES[sorted[0]];
  const secondary = ARCHETYPES[sorted[1]];
  const question = ARCHETYPE_QUESTIONS[idx];
  const progress = (idx / ARCHETYPE_QUESTIONS.length) * 100;

  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 flex items-center gap-3 animate-fade-up">
        <BackButton fallbackHref="/more" />
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Тест на архетип</h1>
      </div>

      {phase === "intro" && (
        <div className="px-5 mt-4 animate-fade-up [animation-delay:60ms] opacity-0">
          <div className="rounded-4xl bg-white shadow-soft p-6">
            <p className="text-sm text-ink-soft leading-relaxed">
              Двенадцать вопросов о том, как вы на самом деле принимаете решения. В конце — ваш
              архетип, подходящие сферы и первый шаг.
            </p>
            <button
              type="button"
              onClick={() => {
                hapticImpact("medium");
                restart();
              }}
              className="tap-scale mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white pulse-glow"
            >
              <Sparkles className="w-5 h-5" strokeWidth={2} />
              Начать тест
            </button>

            <div className="mt-6 flex justify-center gap-8 border-t border-black/5 pt-5">
              <div className="text-center">
                <p className="text-xs text-ink-soft">Вопросов</p>
                <p className="mt-0.5 text-lg font-semibold text-ink">12</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-ink-soft">Минут</p>
                <p className="mt-0.5 text-lg font-semibold text-ink">3</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-ink-soft">Архетипов</p>
                <p className="mt-0.5 text-lg font-semibold text-ink">8</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === "quiz" && (
        <div className="px-5 mt-4 animate-fade-up [animation-delay:60ms] opacity-0">
          <div className="h-1 rounded-full bg-beige-light overflow-hidden">
            <div
              className="h-full rounded-full bg-beige-dark transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-beige-dark">
            Вопрос {idx + 1} из {ARCHETYPE_QUESTIONS.length}
          </p>
          <p className="mt-2 text-xl font-semibold leading-snug text-ink">{question.text}</p>

          <div className="mt-5 flex flex-col gap-2.5">
            {question.options.map((opt, i) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => choose(opt.key)}
                className="tap-scale flex items-start gap-3 rounded-3xl bg-white p-4 shadow-card text-left"
              >
                <span className="text-sm font-semibold text-beige-dark italic min-w-[20px]">{ROMAN[i]}</span>
                <span className="text-sm leading-relaxed text-ink">{opt.label}</span>
              </button>
            ))}
          </div>

          {idx > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="tap-scale mt-5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-soft"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
              Назад
            </button>
          )}
        </div>
      )}

      {phase === "result" && (
        <>
          <div className="px-5 mt-4 animate-fade-up [animation-delay:60ms] opacity-0">
            <div className="rounded-4xl bg-white shadow-soft p-6 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-beige-dark">Ваш архетип</p>
              <h2 className="mt-2 text-3xl font-semibold text-ink">{primary.name}</h2>
              <p className="mt-1 text-sm font-medium italic text-beige-dark">{primary.subtitle}</p>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{primary.lead}</p>
            </div>
          </div>

          <div className="px-5 mt-6 animate-fade-up [animation-delay:80ms] opacity-0">
            <h3 className="text-lg font-semibold text-ink mb-3">Как это работает в вас</h3>
            <div className="flex flex-col gap-3">
              <div className="rounded-3xl bg-white shadow-card p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-beige-dark">В плюсе</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{primary.plus}</p>
              </div>
              <div className="rounded-3xl bg-white shadow-card p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-beige-dark">В минусе</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{primary.minus}</p>
              </div>
            </div>
          </div>

          <div className="px-5 mt-6 animate-fade-up [animation-delay:100ms] opacity-0">
            <h3 className="text-lg font-semibold text-ink mb-3">Где ваша энергия работает</h3>
            <p className="text-sm leading-relaxed text-ink-soft mb-3">{primary.sphereIntro}</p>
            <div className="flex flex-wrap gap-2">
              {primary.spheres.map((s) => (
                <span key={s} className="rounded-full bg-white px-3.5 py-2 text-xs font-medium text-ink shadow-card">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="px-5 mt-6 animate-fade-up [animation-delay:120ms] opacity-0">
            <h3 className="text-lg font-semibold text-ink mb-3">Куда двигаться</h3>
            <div className="flex flex-col gap-2.5">
              {primary.steps.map((step, i) => (
                <div key={step} className="rounded-3xl bg-white shadow-card p-4 flex gap-3">
                  <span className="text-sm font-semibold italic text-beige-dark min-w-[24px]">{STEP_NUM[i]}</span>
                  <span className="text-sm leading-relaxed text-ink-soft">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 mt-6 animate-fade-up [animation-delay:140ms] opacity-0">
            <h3 className="text-lg font-semibold text-ink mb-3">Что чаще всего мешает</h3>
            <div className="rounded-3xl bg-white shadow-card p-5">
              <p className="text-sm leading-relaxed text-ink-soft">{primary.blocker}</p>
            </div>
          </div>

          <div className="px-5 mt-5 animate-fade-up [animation-delay:150ms] opacity-0">
            <div className="rounded-3xl bg-cream p-4">
              <p className="text-sm leading-relaxed text-ink-soft">
                <span className="font-semibold text-ink">Ваш второй архетип: {secondary.name}.</span> Он
                звучит тише, но включается в стрессе и в отношениях. Чистых архетипов не бывает:
                сильные решения обычно рождаются там, где два ваших начала работают вместе, а не
                спорят.
              </p>
            </div>
          </div>

          <div className="px-5 mt-8 animate-fade-up [animation-delay:160ms] opacity-0">
            <div className="rounded-4xl bg-beige-dark p-6 text-center text-white shadow-lifted">
              <p className="text-xs font-medium uppercase tracking-wide text-beige-light">Следующий шаг</p>
              <h3 className="mt-2 text-lg font-semibold">Архетип — это верхний слой</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Тест показывает, как вы действуете. Ваша дата рождения в Матрице судьбы показывает,
                почему именно так и где энергия уходит впустую — это уже личный разбор.
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
                  requestBotAccess("consult");
                }}
                className="tap-scale mt-2.5 w-full rounded-full px-6 py-3 text-sm font-medium text-white/80"
              >
                Или записаться на личную консультацию
              </button>
            </div>
          </div>

          <div className="px-5 mt-6 animate-fade-up [animation-delay:180ms] opacity-0">
            <button
              type="button"
              onClick={() => {
                hapticImpact("light");
                setPhase("intro");
              }}
              className="tap-scale flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-ink shadow-card"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={2} />
              Пройти заново
            </button>
          </div>
        </>
      )}
    </main>
  );
}
