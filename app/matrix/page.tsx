"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Lock, Phone, MessageCircle } from "lucide-react";
import BackButton from "@/components/BackButton";
import NumberBadge from "@/components/matrix/NumberBadge";
import StarChart from "@/components/matrix/StarChart";
import DateInput from "@/components/matrix/DateInput";
import EnergySheet from "@/components/matrix/EnergySheet";
import FatalMistakeSheet from "@/components/matrix/FatalMistakeSheet";
import AncestralErrorSheet from "@/components/matrix/AncestralErrorSheet";
import UnlockGate from "@/components/matrix/UnlockGate";
import { useMatrixUnlock } from "@/lib/matrixUnlock";
import { calculateMatrix, type MatrixResult } from "@/lib/matrix";
import { getArcanaEnergy, getFatalMistake } from "@/data/matrixArcana";
import { getAncestralError } from "@/data/matrixAncestralErrors";
import { getSavedBirthDate, saveBirthDate } from "@/lib/dateInput";
import { hapticImpact, hapticSelection } from "@/lib/telegram";
import { openWhatsApp } from "@/lib/whatsapp";
import { calculatePersonalYearArcana } from "@/lib/forecast";

const CURRENT_YEAR = new Date().getFullYear();

// Заблокированные разделы остаются на виду (номер + подпись), но вместо расшифровки — замочек,
// чтобы было видно, что тут серьёзное содержание, а не просто пустая страница.
function LockedLabel() {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-beige-dark/70">
      <Lock className="w-3.5 h-3.5" strokeWidth={2} />
      Открыть
    </span>
  );
}

const ANCESTRAL_LABELS: { label: string; point: number }[] = [
  { label: "Ошибка отца по мужской линии", point: 8 },
  { label: "Ошибка матери по мужской линии", point: 10 },
  { label: "Ошибка отца по женской линии", point: 20 },
  { label: "Ошибка матери по женской линии", point: 19 },
];

const DESTINY_LABELS: { key: keyof MatrixResult["destinies"]; label: string }[] = [
  { key: "personal", label: "Личность" },
  { key: "spiritual", label: "Духовность" },
  { key: "money", label: "Деньги" },
  { key: "relationships", label: "Отношения" },
  { key: "health", label: "Здоровье" },
];

export default function MatrixPage() {
  const [dateInput, setDateInput] = useState("");
  const [result, setResult] = useState<MatrixResult | null>(null);
  const [selectedEnergyId, setSelectedEnergyId] = useState<number | null>(null);
  const [showFatalMistake, setShowFatalMistake] = useState(false);
  const [ancestralLabel, setAncestralLabel] = useState<string | null>(null);
  const { unlocked } = useMatrixUnlock("matrix");
  const unlockCtaRef = useRef<HTMLDivElement>(null);

  const goToUnlock = () => {
    hapticImpact("light");
    unlockCtaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useEffect(() => {
    const saved = getSavedBirthDate();
    if (saved) setDateInput(saved);
  }, []);

  // Recalculate as soon as a full date is present, so typing a new date over an old one
  // updates the results immediately without requiring a separate button press.
  useEffect(() => {
    if (dateInput.length !== 10) return;
    const calculated = calculateMatrix(dateInput);
    if (!calculated) return;
    setResult(calculated);
    saveBirthDate(dateInput);
  }, [dateInput]);

  const handleCalculate = () => {
    const calculated = calculateMatrix(dateInput);
    if (!calculated) return;
    hapticImpact("medium");
    setResult(calculated);
    saveBirthDate(dateInput);
  };

  const selectedEnergy = selectedEnergyId ? getArcanaEnergy(selectedEnergyId) ?? null : null;
  const fatalMistakeEntry = result ? getFatalMistake(result.fatalMistake) ?? null : null;
  const personalYearArcana = result ? calculatePersonalYearArcana(result.day, result.month, CURRENT_YEAR) : null;
  const ancestralSheetData =
    result && ancestralLabel
      ? (() => {
          const item = ANCESTRAL_LABELS.find((a) => a.label === ancestralLabel);
          if (!item) return null;
          const error = getAncestralError(result.points[item.point]);
          return error ? { label: item.label, error } : null;
        })()
      : null;

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

          <div className="px-5 mt-6 animate-fade-up [animation-delay:110ms] opacity-0">
            <button
              type="button"
              onClick={() => personalYearArcana !== null && setSelectedEnergyId(personalYearArcana)}
              className="tap-scale w-full rounded-4xl bg-white shadow-soft p-6 text-left flex items-center gap-4"
            >
              <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-beige-dark text-2xl font-semibold text-white shadow-button">
                {personalYearArcana}
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-beige-dark">
                  Ваше число {CURRENT_YEAR} года
                </p>
                <p className="mt-1 text-lg font-semibold text-ink">
                  {personalYearArcana !== null ? getArcanaEnergy(personalYearArcana)?.name : ""}
                </p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  Полный прогноз по месяцам и дням — в разделе «Прогноз»
                </p>
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
                    onClick={() => (unlocked ? setSelectedEnergyId(value) : goToUnlock())}
                    className="tap-scale flex items-center gap-3 rounded-3xl bg-white p-4 shadow-card text-left"
                  >
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-beige-light text-base font-semibold text-beige-dark">
                      {value}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-ink-soft">{label}</p>
                      {unlocked ? (
                        <p className="text-sm font-semibold text-ink leading-snug line-clamp-2">
                          {getArcanaEnergy(value)?.name}
                        </p>
                      ) : (
                        <LockedLabel />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => (unlocked ? setShowFatalMistake(true) : goToUnlock())}
              className="tap-scale mt-3 w-full rounded-3xl bg-white p-4 shadow-card flex items-center gap-3"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-beige-light text-base font-semibold text-beige-dark">
                {result.fatalMistake}
              </span>
              <div className="min-w-0 text-left">
                <p className="text-xs text-ink-soft">Роковая ошибка</p>
                {unlocked ? (
                  <p className="text-sm font-semibold text-ink truncate">
                    {getFatalMistake(result.fatalMistake)?.name}
                  </p>
                ) : (
                  <LockedLabel />
                )}
              </div>
            </button>

            <h2 className="text-lg font-semibold text-ink mb-3 mt-6">Родовые ошибки</h2>
            <div className="grid grid-cols-2 gap-3">
              {ANCESTRAL_LABELS.map(({ label, point }) => {
                const value = result.points[point];
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      hapticSelection();
                      setAncestralLabel(label);
                    }}
                    className="tap-scale flex items-center gap-3 rounded-3xl bg-white p-4 shadow-card text-left"
                  >
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-beige-light text-base font-semibold text-beige-dark">
                      {value}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-ink-soft leading-tight">{label}</p>
                      <p className="text-sm font-semibold text-ink truncate">
                        {getAncestralError(value)?.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <h2 className="text-lg font-semibold text-ink mb-3 mt-6">Чакры</h2>
            <div className="rounded-3xl bg-white p-4 shadow-card flex justify-between flex-wrap gap-y-3">
              {result.chakras.map((value, i) => (
                <NumberBadge key={i} value={value} size="sm" onClick={() => setSelectedEnergyId(value)} />
              ))}
            </div>

            <h2 className="text-lg font-semibold text-ink mb-3 mt-6">Код души</h2>
            <div className="rounded-3xl bg-white p-4 shadow-card flex justify-center gap-6">
              {result.soulCode.map((value, i) => (
                <NumberBadge key={i} value={value} size="md" onClick={() => setSelectedEnergyId(value)} />
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/matrix/forecast"
                className="tap-scale flex items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-card"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">Прогноз</p>
                  <p className="mt-0.5 text-xs text-ink-soft">Персональный год, месяц, день и график энергии</p>
                </div>
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-beige-light">
                  {unlocked ? (
                    <ArrowRight className="w-4 h-4 text-beige-dark" strokeWidth={2} />
                  ) : (
                    <Lock className="w-4 h-4 text-beige-dark" strokeWidth={2} />
                  )}
                </span>
              </Link>

              <Link
                href="/matrix/karmic-knots"
                className="tap-scale flex items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-card"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">Кармические узлы</p>
                  <p className="mt-0.5 text-xs text-ink-soft">Справочник комбинаций из 3 арканов</p>
                </div>
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-beige-light">
                  {unlocked ? (
                    <ArrowRight className="w-4 h-4 text-beige-dark" strokeWidth={2} />
                  ) : (
                    <Lock className="w-4 h-4 text-beige-dark" strokeWidth={2} />
                  )}
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
                  {unlocked ? (
                    <ArrowRight className="w-4 h-4 text-beige-dark" strokeWidth={2} />
                  ) : (
                    <Lock className="w-4 h-4 text-beige-dark" strokeWidth={2} />
                  )}
                </span>
              </Link>

              <Link
                href="/matrix/relationships"
                className="tap-scale flex items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-card"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">Сфера отношений</p>
                  <p className="mt-0.5 text-xs text-ink-soft">Энергии в контексте партнёрства</p>
                </div>
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-beige-light">
                  {unlocked ? (
                    <ArrowRight className="w-4 h-4 text-beige-dark" strokeWidth={2} />
                  ) : (
                    <Lock className="w-4 h-4 text-beige-dark" strokeWidth={2} />
                  )}
                </span>
              </Link>

              <Link
                href="/matrix/compatibility"
                className="tap-scale flex items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-card"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">Совместимость</p>
                  <p className="mt-0.5 text-xs text-ink-soft">Расчёт для двух партнёров</p>
                </div>
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-beige-light">
                  {unlocked ? (
                    <ArrowRight className="w-4 h-4 text-beige-dark" strokeWidth={2} />
                  ) : (
                    <Lock className="w-4 h-4 text-beige-dark" strokeWidth={2} />
                  )}
                </span>
              </Link>
            </div>
          </div>

          {!unlocked && (
            <div ref={unlockCtaRef} className="px-5 mt-6 animate-fade-up [animation-delay:280ms] opacity-0">
              <UnlockGate
                section="matrix"
                title="Полный разбор матрицы"
                description="Расшифровка 5 предназначений и роковой ошибки"
              />
            </div>
          )}

          <div className="px-5 mt-6 animate-fade-up [animation-delay:300ms] opacity-0">
            <div className="rounded-4xl bg-beige-dark p-6 text-center text-white shadow-lifted">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
                <Phone className="w-6 h-6 text-white" strokeWidth={1.8} />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Личная консультация с Анастасией</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Часовая встреча, на которой разбираем всю вашу матрицу целиком: предназначения,
                прогнозы, отношения, финансы и любые вопросы, которые для вас важны — 50 000 ₸.
              </p>
              <button
                type="button"
                onClick={() => {
                  hapticImpact("light");
                  openWhatsApp("Здравствуйте! Хочу записаться на личную консультацию с Анастасией по Матрице судьбы.");
                }}
                className="tap-scale mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-base font-semibold text-beige-dark shadow-button"
              >
                <MessageCircle className="w-5 h-5" strokeWidth={2} />
                Записаться в WhatsApp
              </button>
            </div>
          </div>
        </>
      )}

      <EnergySheet energy={selectedEnergy} onClose={() => setSelectedEnergyId(null)} />
      <FatalMistakeSheet entry={showFatalMistake ? fatalMistakeEntry : null} onClose={() => setShowFatalMistake(false)} />
      <AncestralErrorSheet data={ancestralSheetData} onClose={() => setAncestralLabel(null)} />
    </main>
  );
}
