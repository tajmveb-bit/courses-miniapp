"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import BackButton from "@/components/BackButton";
import NumberBadge from "@/components/matrix/NumberBadge";
import DateInput from "@/components/matrix/DateInput";
import UnlockGate from "@/components/matrix/UnlockGate";
import EnergyGraphChart from "@/components/matrix/EnergyGraphChart";
import ForecastEventSheet from "@/components/matrix/ForecastEventSheet";
import { parseBirthDate } from "@/lib/matrix";
import { calculateForecast, calculateEnergyCode, MONTH_NAMES, type ForecastResult } from "@/lib/forecast";
import { getForecastEvent } from "@/data/matrixForecastEvents";
import { getEnergyGraphLevel } from "@/data/matrixEnergyGraph";
import { getSavedBirthDate, saveBirthDate } from "@/lib/dateInput";
import { hapticImpact, hapticSelection } from "@/lib/telegram";

const now = new Date();

export default function ForecastPage() {
  const [dateInput, setDateInput] = useState("");
  const [targetYear, setTargetYear] = useState(now.getFullYear());
  const [targetMonth, setTargetMonth] = useState(now.getMonth() + 1);
  const [targetDay, setTargetDay] = useState(now.getDate());
  const [result, setResult] = useState<ForecastResult | null>(null);
  const [energyDigits, setEnergyDigits] = useState<number[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [graphValue, setGraphValue] = useState<number | null>(null);

  const runCalculate = (dob: string, year: number, month: number, day: number) => {
    const parsedBirth = parseBirthDate(dob);
    if (!parsedBirth) return;
    const forecast = calculateForecast(parsedBirth.day, parsedBirth.month, year, month, day);
    setResult(forecast);
    setEnergyDigits(calculateEnergyCode(parsedBirth.day, parsedBirth.month, Number(parsedBirth.year)));
  };

  useEffect(() => {
    const saved = getSavedBirthDate();
    if (saved) setDateInput(saved);
  }, []);

  const parsedBirth = parseBirthDate(dateInput);

  // Recalculate as soon as a full birth date is present, so typing a new one over an old one
  // updates the forecast immediately without requiring a separate button press.
  useEffect(() => {
    if (!parsedBirth) return;
    runCalculate(dateInput, targetYear, targetMonth, targetDay);
    saveBirthDate(dateInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateInput]);

  const handleCalculate = () => {
    if (!parsedBirth) return;
    hapticImpact("medium");
    runCalculate(dateInput, targetYear, targetMonth, targetDay);
    saveBirthDate(dateInput);
  };

  const selectedEvent = selectedEventId ? getForecastEvent(selectedEventId) ?? null : null;
  const graphLevel = graphValue !== null ? getEnergyGraphLevel(graphValue) : null;

  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 flex items-center gap-3 animate-fade-up">
        <BackButton fallbackHref="/matrix" />
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Прогноз</h1>
      </div>

      <div className="px-5 mt-4 animate-fade-up [animation-delay:60ms] opacity-0">
        <UnlockGate section="forecast" title="Прогноз">
          <div className="rounded-4xl bg-white shadow-soft p-6">
            <p className="text-sm leading-relaxed text-ink-soft mb-4">
              Введите дату рождения и день, на который хотите узнать прогноз.
            </p>
            <DateInput value={dateInput} onChange={setDateInput} label="Дата рождения" />

            <div className="mt-3 grid grid-cols-3 gap-2">
              <input
                type="number"
                value={targetYear}
                onChange={(e) => setTargetYear(Number(e.target.value))}
                className="rounded-2xl border border-black/10 bg-cream px-2 py-3 text-sm text-ink text-center outline-none focus:border-beige-dark"
              />
              <select
                value={targetMonth}
                onChange={(e) => setTargetMonth(Number(e.target.value))}
                className="rounded-2xl border border-black/10 bg-cream px-1 py-3 text-sm text-ink text-center outline-none focus:border-beige-dark"
              >
                {MONTH_NAMES.map((m, i) => (
                  <option key={i} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                max={31}
                value={targetDay}
                onChange={(e) => setTargetDay(Number(e.target.value))}
                className="rounded-2xl border border-black/10 bg-cream px-2 py-3 text-sm text-ink text-center outline-none focus:border-beige-dark"
              />
            </div>

            <button
              type="button"
              disabled={!parsedBirth}
              onClick={handleCalculate}
              className="tap-scale mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white shadow-button disabled:opacity-40"
            >
              <Sparkles className="w-5 h-5" strokeWidth={2} />
              Рассчитать прогноз
            </button>
          </div>

          {result && (
            <>
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-ink mb-3">Ваши персональные арканы</h2>
                <div className="rounded-4xl bg-white shadow-soft p-5 flex justify-around">
                  <div className="flex flex-col items-center gap-1.5">
                    <NumberBadge
                      value={result.personalYearArcana}
                      size="lg"
                      onClick={() => {
                        hapticSelection();
                        setSelectedEventId(result.personalYearArcana);
                      }}
                    />
                    <span className="text-xs text-ink-soft">Год {result.targetYear}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <NumberBadge
                      value={result.personalMonthArcana}
                      size="lg"
                      onClick={() => {
                        hapticSelection();
                        setSelectedEventId(result.personalMonthArcana);
                      }}
                    />
                    <span className="text-xs text-ink-soft">{MONTH_NAMES[result.targetMonth - 1]}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <NumberBadge
                      value={result.personalDayArcana}
                      size="lg"
                      onClick={() => {
                        hapticSelection();
                        setSelectedEventId(result.personalDayArcana);
                      }}
                    />
                    <span className="text-xs text-ink-soft">{result.targetDay} число</span>
                  </div>
                </div>
                <p className="mt-2 text-center text-xs text-ink-soft">
                  Нажмите на цифру, чтобы увидеть события в плюсе и минусе
                </p>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-ink mb-3">График жизненной энергии</h2>
                <div className="rounded-4xl bg-white shadow-soft p-5">
                  <EnergyGraphChart digits={energyDigits} onSelectValue={setGraphValue} />
                  {graphLevel && (
                    <div className="mt-3 rounded-3xl bg-cream p-4">
                      <p className="text-sm font-semibold text-ink">
                        {graphLevel.value} · {graphLevel.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{graphLevel.text}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </UnlockGate>
      </div>

      <ForecastEventSheet event={selectedEvent} onClose={() => setSelectedEventId(null)} />
    </main>
  );
}
