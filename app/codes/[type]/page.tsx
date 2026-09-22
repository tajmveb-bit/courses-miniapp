"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import BackButton from "@/components/BackButton";
import DateInput from "@/components/matrix/DateInput";
import UnlockGate from "@/components/matrix/UnlockGate";
import { calculateMatrix, type MatrixResult } from "@/lib/matrix";
import { getArcanaEnergy } from "@/data/matrixArcana";
import { getCodeConfig } from "@/data/matrixCodes";
import { getSavedBirthDate, saveBirthDate } from "@/lib/dateInput";
import { hapticImpact } from "@/lib/telegram";

export default function CodePage() {
  const params = useParams<{ type: string }>();
  const config = getCodeConfig(params.type);

  const [dateInput, setDateInput] = useState("");
  const [result, setResult] = useState<MatrixResult | null>(null);

  useEffect(() => {
    const saved = getSavedBirthDate();
    if (saved) setDateInput(saved);
  }, []);

  useEffect(() => {
    if (dateInput.length !== 10) return;
    const calculated = calculateMatrix(dateInput);
    if (!calculated) return;
    setResult(calculated);
    saveBirthDate(dateInput);
  }, [dateInput]);

  if (!config) notFound();

  const handleCalculate = () => {
    const calculated = calculateMatrix(dateInput);
    if (!calculated) return;
    hapticImpact("medium");
    setResult(calculated);
    saveBirthDate(dateInput);
  };

  const value = result ? config.getValue(result) : null;
  const energy = value !== null ? getArcanaEnergy(value) : null;

  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 flex items-center gap-3 animate-fade-up">
        <BackButton fallbackHref="/more" />
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{config.title}</h1>
      </div>

      <div className="px-5 mt-6 animate-fade-up [animation-delay:60ms] opacity-0">
        <div className="rounded-4xl bg-white shadow-soft p-6">
          <p className="text-sm text-ink-soft leading-relaxed">{config.intro}</p>
          <div className="mt-4 flex items-center gap-3">
            <DateInput value={dateInput} onChange={setDateInput} />
          </div>
          <button
            type="button"
            disabled={dateInput.length !== 10}
            onClick={handleCalculate}
            className="tap-scale mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white shadow-button disabled:opacity-40"
          >
            <Sparkles className="w-5 h-5" strokeWidth={2} />
            Рассчитать
          </button>
        </div>
      </div>

      {result && value !== null && (
        <div className="px-5 mt-6 animate-fade-up [animation-delay:100ms] opacity-0">
          <div className="rounded-4xl bg-white shadow-soft p-6 flex items-center gap-4 mb-4">
            <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-beige-dark text-2xl font-semibold text-white shadow-button">
              {value}
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-beige-dark">{config.title}</p>
              <p className="mt-1 text-lg font-semibold text-ink">{energy?.name}</p>
            </div>
          </div>

          <UnlockGate section={config.section} title={config.title} price="5 000 ₸" description="Полная расшифровка">
            {energy && (
              <div className="rounded-4xl bg-white shadow-soft p-6 flex flex-col gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-beige-dark">Таланты</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{energy.talents}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-beige-dark">В минусе</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{energy.pastLife}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-beige-dark">Как пройти программу</p>
                  <ul className="mt-1.5 flex flex-col gap-1.5">
                    {energy.steps.map((step, i) => (
                      <li key={i} className="text-sm leading-relaxed text-ink-soft flex gap-2">
                        <span className="text-beige-dark">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </UnlockGate>
        </div>
      )}
    </main>
  );
}
