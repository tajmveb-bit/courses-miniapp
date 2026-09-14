"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import BackButton from "@/components/BackButton";
import NumberBadge from "@/components/matrix/NumberBadge";
import StarChart from "@/components/matrix/StarChart";
import EnergySheet from "@/components/matrix/EnergySheet";
import FatalMistakeSheet from "@/components/matrix/FatalMistakeSheet";
import { calculateMatrix, type MatrixResult } from "@/lib/matrix";
import { getArcanaEnergy, getFatalMistake } from "@/data/matrixArcana";
import { hapticImpact } from "@/lib/telegram";

const DESTINY_LABELS: { key: keyof MatrixResult["destinies"]; label: string }[] = [
  { key: "personal", label: "Личность" },
  { key: "spiritual", label: "Духовность" },
  { key: "money", label: "Деньги" },
  { key: "relationships", label: "Отношения" },
  { key: "health", label: "Здоровье" },
];

function formatDateInput(raw: string): string {
  let value = raw.replace(/\D/g, "");
  if (value.length >= 2) value = value.slice(0, 2) + "." + value.slice(2);
  if (value.length >= 5) value = value.slice(0, 5) + "." + value.slice(5);
  return value.slice(0, 10);
}

export default function MatrixPage() {
  const [dateInput, setDateInput] = useState("");
  const [result, setResult] = useState<MatrixResult | null>(null);
  const [selectedEnergyId, setSelectedEnergyId] = useState<number | null>(null);
  const [showFatalMistake, setShowFatalMistake] = useState(false);

  const handleCalculate = () => {
    const calculated = calculateMatrix(dateInput);
    if (!calculated) return;
    hapticImpact("medium");
    setResult(calculated);
  };

  const selectedEnergy = selectedEnergyId ? getArcanaEnergy(selectedEnergyId) ?? null : null;
  const fatalMistakeEntry = result ? getFatalMistake(result.fatalMistake) ?? null : null;

  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 flex items-center gap-3 animate-fade-up">
        <BackButton fallbackHref="/more" />
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Матрица судьбы</h1>
      </div>

      <div className="px-5 mt-6 animate-fade-up [animation-delay:60ms] opacity-0">
        <div className="rounded-4xl bg-white shadow-soft p-6">
          <p className="text-sm text-ink-soft leading-relaxed">
            Введите дату рождения, чтобы рассчитать свою личную матрицу: предназначения,
            роковую ошибку, чакры и код души.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <input
              value={dateInput}
              onChange={(e) => setDateInput(formatDateInput(e.target.value))}
              placeholder="дд.мм.гггг"
              inputMode="numeric"
              className="flex-1 rounded-2xl border border-black/10 bg-cream px-4 py-3 text-lg text-ink text-center tracking-wide outline-none focus:border-beige-dark"
            />
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

      {result && (
        <>
          <div className="px-5 mt-6 animate-fade-up [animation-delay:100ms] opacity-0">
            <button
              type="button"
              onClick={() => setSelectedEnergyId(result.mainEnergy)}
              className="tap-scale w-full rounded-4xl bg-white shadow-soft p-6 text-left flex items-center gap-4"
            >
              <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-beige-dark text-2xl font-semibold text-white shadow-button">
                {result.mainEnergy}
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-beige-dark">
                  Ваша главная энергия
                </p>
                <p className="mt-1 text-lg font-semibold text-ink">
                  {getArcanaEnergy(result.mainEnergy)?.name}
                </p>
                <p className="mt-0.5 text-xs text-ink-soft">Нажмите, чтобы узнать больше</p>
              </div>
            </button>
          </div>

          <div className="px-5 mt-6 animate-fade-up [animation-delay:120ms] opacity-0">
            <h2 className="text-lg font-semibold text-ink mb-3">Звезда</h2>
            <div className="rounded-4xl bg-white shadow-soft p-5">
              <StarChart result={result} onSelectPoint={(value) => setSelectedEnergyId(value)} />
              <p className="mt-4 text-center text-xs text-ink-soft">
                Нажмите на любую цифру, чтобы узнать её значение
              </p>
            </div>
          </div>

          <div className="px-5 mt-6 animate-fade-up [animation-delay:140ms] opacity-0">
            <h2 className="text-lg font-semibold text-ink mb-3">5 предназначений</h2>
            <div className="grid grid-cols-2 gap-3">
              {DESTINY_LABELS.map(({ key, label }) => {
                const value = result.destinies[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedEnergyId(value)}
                    className="tap-scale flex items-center gap-3 rounded-3xl bg-white p-4 shadow-card text-left"
                  >
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-beige-light text-base font-semibold text-beige-dark">
                      {value}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-ink-soft">{label}</p>
                      <p className="text-sm font-semibold text-ink leading-snug line-clamp-2">
                        {getArcanaEnergy(value)?.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-5 mt-6 animate-fade-up [animation-delay:180ms] opacity-0">
            <button
              type="button"
              onClick={() => setShowFatalMistake(true)}
              className="tap-scale w-full rounded-3xl bg-white p-4 shadow-card flex items-center gap-3"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-beige-light text-base font-semibold text-beige-dark">
                {result.fatalMistake}
              </span>
              <div className="min-w-0 text-left">
                <p className="text-xs text-ink-soft">Роковая ошибка</p>
                <p className="text-sm font-semibold text-ink truncate">
                  {getFatalMistake(result.fatalMistake)?.name}
                </p>
              </div>
            </button>
          </div>

          <div className="px-5 mt-6 animate-fade-up [animation-delay:220ms] opacity-0">
            <h2 className="text-lg font-semibold text-ink mb-3">Чакры</h2>
            <div className="rounded-3xl bg-white p-4 shadow-card flex justify-between flex-wrap gap-y-3">
              {result.chakras.map((value, i) => (
                <NumberBadge key={i} value={value} size="sm" onClick={() => setSelectedEnergyId(value)} />
              ))}
            </div>
          </div>

          <div className="px-5 mt-6 animate-fade-up [animation-delay:260ms] opacity-0">
            <h2 className="text-lg font-semibold text-ink mb-3">Код души</h2>
            <div className="rounded-3xl bg-white p-4 shadow-card flex justify-center gap-6">
              {result.soulCode.map((value, i) => (
                <NumberBadge key={i} value={value} size="md" onClick={() => setSelectedEnergyId(value)} />
              ))}
            </div>
          </div>

          <div className="px-5 mt-6 flex flex-col gap-3 animate-fade-up [animation-delay:280ms] opacity-0">
            <Link
              href="/matrix/karmic-knots"
              className="tap-scale flex items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-card"
            >
              <div>
                <p className="text-sm font-semibold text-ink">Кармические узлы</p>
                <p className="mt-0.5 text-xs text-ink-soft">Справочник комбинаций из 3 арканов</p>
              </div>
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-beige-light">
                <ArrowRight className="w-4 h-4 text-beige-dark" strokeWidth={2} />
              </span>
            </Link>

            <Link
              href="/matrix/spiritual-sphere"
              className="tap-scale flex items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-card"
            >
              <div>
                <p className="text-sm font-semibold text-ink">Сфера духовности</p>
                <p className="mt-0.5 text-xs text-ink-soft">Задача по месяцу рождения и энергии</p>
              </div>
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-beige-light">
                <ArrowRight className="w-4 h-4 text-beige-dark" strokeWidth={2} />
              </span>
            </Link>
          </div>
        </>
      )}

      <EnergySheet energy={selectedEnergy} onClose={() => setSelectedEnergyId(null)} />
      <FatalMistakeSheet entry={showFatalMistake ? fatalMistakeEntry : null} onClose={() => setShowFatalMistake(false)} />
    </main>
  );
}
