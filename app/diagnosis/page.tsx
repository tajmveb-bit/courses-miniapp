"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import BackButton from "@/components/BackButton";
import { diagnosisQuestions, focuses } from "@/data/club";
import { useProgress } from "@/lib/progress";
import { hapticImpact, hapticSelection } from "@/lib/telegram";

export default function DiagnosisPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { saveDiagnosis } = useProgress();

  const question = diagnosisQuestions[step];
  const isLastStep = step === diagnosisQuestions.length - 1;

  const focusId = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(answers).forEach((optionId) => {
      const option = diagnosisQuestions.flatMap((q) => q.options).find((o) => o.id === optionId);
      if (!option) return;
      counts[option.focusId] = (counts[option.focusId] ?? 0) + 1;
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return entries[0]?.[0] ?? "unsure";
  }, [answers]);

  const finished = Object.keys(answers).length === diagnosisQuestions.length;

  const handleSelect = (optionId: string, optionFocusId: string) => {
    hapticSelection();
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);

    if (isLastStep) {
      const counts: Record<string, number> = {};
      Object.values(next).forEach((id) => {
        const option = diagnosisQuestions.flatMap((q) => q.options).find((o) => o.id === id);
        if (option) counts[option.focusId] = (counts[option.focusId] ?? 0) + 1;
      });
      const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? optionFocusId;
      saveDiagnosis(best);
    } else {
      setStep((s) => s + 1);
    }
  };

  const focus = focuses[focusId];

  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 flex items-center gap-3 animate-fade-up">
        <BackButton fallbackHref="/" />
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Мини-диагностика</h1>
      </div>

      {!finished ? (
        <div className="px-5 mt-6 animate-fade-up [animation-delay:60ms] opacity-0">
          <div className="flex items-center gap-1.5 mb-5">
            {diagnosisQuestions.map((q, index) => (
              <span
                key={q.id}
                className={`h-1.5 flex-1 rounded-full ${index <= step ? "bg-beige-dark" : "bg-beige-light"}`}
              />
            ))}
          </div>

          <p className="text-xs text-ink-soft">
            Вопрос {step + 1} из {diagnosisQuestions.length}
          </p>
          <h2 className="mt-1.5 text-xl font-semibold text-ink leading-snug">{question.question}</h2>

          <div className="mt-5 flex flex-col gap-2.5">
            {question.options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id, option.focusId)}
                className="tap-scale flex items-center justify-between gap-3 rounded-3xl bg-white p-4 text-left shadow-card"
              >
                <span className="text-sm text-ink leading-snug">{option.label}</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0 text-beige-dark" strokeWidth={2} />
              </button>
            ))}
          </div>

          <p className="mt-5 text-xs leading-relaxed text-ink-soft/80">
            Диагностика нужна для персонализации материалов клуба. Это не медицинская диагностика
            и не постановка диагноза.
          </p>
        </div>
      ) : (
        <div className="px-5 mt-6 animate-fade-up [animation-delay:60ms] opacity-0">
          <div className="rounded-4xl bg-white shadow-soft p-6 flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-beige-light">
              <Sparkles className="w-6 h-6 text-beige-dark" strokeWidth={1.8} />
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-beige-dark">
              Ваш стартовый фокус
            </p>
            <h2 className="mt-1 text-xl font-semibold text-ink">{focus?.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{focus?.description}</p>

            <Link
              href="/materials"
              onClick={() => hapticImpact("light")}
              className="tap-scale mt-6 w-full rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white shadow-button"
            >
              Открыть материалы недели
            </Link>
            <Link href="/salon" onClick={() => hapticImpact("light")} className="tap-scale mt-3 text-sm font-medium text-ink-soft">
              Или записаться на диагностику в салоне
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
