"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import BackButton from "@/components/BackButton";
import NumberBadge from "@/components/matrix/NumberBadge";
import UnlockGate from "@/components/matrix/UnlockGate";
import EnergyGraphChart from "@/components/matrix/EnergyGraphChart";
import ForecastEventSheet from "@/components/matrix/ForecastEventSheet";
import { parseBirthDate } from "@/lib/matrix";
import { calculateForecast, calculateEnergyCode, MONTH_NAMES, type ForecastResult } from "@/lib/forecast";
import { getForecastEvent } from "@/data/matrixForecastEvents";
import { getEnergyGraphLevel } from "@/data/matrixEnergyGraph";
import { hapticImpact, hapticSelection } from "@/lib/telegram";

function formatDateInput(raw: string): string {
  let value = raw.replace(/\D/g, "");
  if (value.length >= 2) value = value.slice(0, 2) + "." + value.slice(2);
  if (value.length >= 5) value = value.slice(0, 5) + "." + value.slice(5);
  return value.slice(0, 10);
}

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

  const parsedBirth = parseBirthDate(dateInput);

  const handleCalculate = () => {
    if (!parsedBirth) return;
    hapticImpact("medium");
    const forecast = calculateForecast(parsedBirth.day, parsedBirth.month, targetYear, targetMonth, targetDay);
    setResult(forecast);
    setEnergyDigits(calculateEnergyCode(parsedBirth.day, parsedBirth.month, Number(parsedBirth.year)));
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
        <div className="rounded-4xl bg-white shadow-soft p-6">
          <p className="text-sm leading-relaxed text-ink-soft mb-4">
            Введите дату рождения и день, на который хотите узнать прогноз.
          </p>
          <input
            value={dateInput}
            onChange={(e) => setDateInput(formatDateInput(e.target.value))}
            placeholder="Дата рождения: дд.мм.гггг"
            inputMode="numeric"
            className="w-full rounded-2xl border border-black/10 bg-cream px-4 py-3 text-base text-ink text-center tracking-wide outline-none focus:border-beige-dark"
          />

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
      </div>

      {result && (
        <>
          <div className="px-5 mt-6 animate-fade-up [animation-delay:100ms] opacity-0">
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

          <div className="px-5 mt-6 animate-fade-up [animation-delay:140ms] opacity-0">
            <h2 className="text-lg font-semibold text-ink mb-3">Полный разбор и график энергии</h2>
            <UnlockGate>
              <div className="rounded-4xl bg-white shadow-soft p-5">
                <p className="text-sm font-semibold text-ink mb-2">График жизненной энергии</p>
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
            </UnlockGate>
          </div>
        </>
      )}

      <ForecastEventSheet event={selectedEvent} onClose={() => setSelectedEventId(null)} />
    </main>
  );
}
