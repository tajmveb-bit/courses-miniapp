"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import BackButton from "@/components/BackButton";
import TextDetailSheet from "@/components/matrix/TextDetailSheet";
import { parseBirthDate } from "@/lib/matrix";
import {
  meetingArcana,
  conflictArcana,
  businessArcana,
  calculateCompatibilityNumber,
  type PersonDate,
  type CompatibilityResult,
} from "@/lib/compatibility";
import {
  getMeetingReason,
  getConflictReason,
  getBusinessCompatibility,
  getLifePathCompatibility,
} from "@/data/matrixCompatibility";
import { hapticImpact, hapticSelection } from "@/lib/telegram";

function formatDateInput(raw: string): string {
  let value = raw.replace(/\D/g, "");
  if (value.length >= 2) value = value.slice(0, 2) + "." + value.slice(2);
  if (value.length >= 5) value = value.slice(0, 5) + "." + value.slice(5);
  return value.slice(0, 10);
}

interface SheetData {
  eyebrow: string;
  title: string;
  task?: string;
  text: string;
}

export default function CompatibilityPage() {
  const [dateA, setDateA] = useState("");
  const [dateB, setDateB] = useState("");
  const [meeting, setMeeting] = useState<number | null>(null);
  const [conflict, setConflict] = useState<number | null>(null);
  const [business, setBusiness] = useState<number | null>(null);
  const [lifePath, setLifePath] = useState<CompatibilityResult | null>(null);
  const [sheet, setSheet] = useState<SheetData | null>(null);

  const parsedA = parseBirthDate(dateA);
  const parsedB = parseBirthDate(dateB);

  const handleCalculate = () => {
    if (!parsedA || !parsedB) return;
    hapticImpact("medium");
    const a: PersonDate = parsedA;
    const b: PersonDate = parsedB;
    setMeeting(meetingArcana(a, b));
    setConflict(conflictArcana(a, b));
    setBusiness(businessArcana(a, b));
    setLifePath(calculateCompatibilityNumber(a, b));
  };

  const openMeeting = () => {
    if (meeting === null) return;
    hapticSelection();
    const e = getMeetingReason(meeting);
    if (e) setSheet({ eyebrow: `Причина встречи · ${e.id}`, title: e.name, task: e.task, text: e.text });
  };

  const openConflict = () => {
    if (conflict === null) return;
    hapticSelection();
    const e = getConflictReason(conflict);
    if (e) setSheet({ eyebrow: `Причина ссор · ${e.id}`, title: e.name, text: e.text });
  };

  const openBusiness = () => {
    if (business === null) return;
    hapticSelection();
    const e = getBusinessCompatibility(business);
    if (e) setSheet({ eyebrow: "Бизнес-совместимость", title: e.name, text: e.text });
  };

  const openLifePath = () => {
    if (!lifePath) return;
    hapticSelection();
    const e = getLifePathCompatibility(lifePath.compatibilityNumber);
    if (e) setSheet({ eyebrow: `Тип отношений: ${lifePath.type}`, title: e.name, text: e.text });
  };

  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 flex items-center gap-3 animate-fade-up">
        <BackButton fallbackHref="/matrix" />
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Совместимость</h1>
      </div>

      <div className="px-5 mt-4 animate-fade-up [animation-delay:60ms] opacity-0">
        <div className="rounded-4xl bg-white shadow-soft p-6">
          <p className="text-sm leading-relaxed text-ink-soft mb-4">
            Введите даты рождения двух партнёров, чтобы узнать причину встречи, возможные
            конфликты, деловую совместимость и тип отношений.
          </p>
          <div className="flex flex-col gap-3">
            <input
              value={dateA}
              onChange={(e) => setDateA(formatDateInput(e.target.value))}
              placeholder="Партнёр 1: дд.мм.гггг"
              inputMode="numeric"
              className="w-full rounded-2xl border border-black/10 bg-cream px-4 py-3 text-base text-ink text-center tracking-wide outline-none focus:border-beige-dark"
            />
            <input
              value={dateB}
              onChange={(e) => setDateB(formatDateInput(e.target.value))}
              placeholder="Партнёр 2: дд.мм.гггг"
              inputMode="numeric"
              className="w-full rounded-2xl border border-black/10 bg-cream px-4 py-3 text-base text-ink text-center tracking-wide outline-none focus:border-beige-dark"
            />
          </div>
          <button
            type="button"
            disabled={!parsedA || !parsedB}
            onClick={handleCalculate}
            className="tap-scale mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white shadow-button disabled:opacity-40"
          >
            <Heart className="w-5 h-5" strokeWidth={2} />
            Рассчитать совместимость
          </button>
        </div>
      </div>

      {meeting !== null && conflict !== null && business !== null && lifePath && (
        <div className="px-5 mt-6 flex flex-col gap-3 animate-fade-up [animation-delay:100ms] opacity-0">
          <button
            type="button"
            onClick={openMeeting}
            className="tap-scale flex items-center gap-3 rounded-3xl bg-white p-4 shadow-card text-left"
          >
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-beige-light text-base font-semibold text-beige-dark">
              {meeting}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Причина встречи</p>
              <p className="mt-0.5 text-xs text-ink-soft">{getMeetingReason(meeting)?.name}</p>
            </div>
          </button>

          <button
            type="button"
            onClick={openConflict}
            className="tap-scale flex items-center gap-3 rounded-3xl bg-white p-4 shadow-card text-left"
          >
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-beige-light text-base font-semibold text-beige-dark">
              {conflict}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Причина ссор</p>
              <p className="mt-0.5 text-xs text-ink-soft">{getConflictReason(conflict)?.name}</p>
            </div>
          </button>

          <button
            type="button"
            onClick={openBusiness}
            className="tap-scale flex items-center gap-3 rounded-3xl bg-white p-4 shadow-card text-left"
          >
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-beige-light text-base font-semibold text-beige-dark">
              {business}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Бизнес-совместимость</p>
              <p className="mt-0.5 text-xs text-ink-soft">{getBusinessCompatibility(business)?.name}</p>
            </div>
          </button>

          <button
            type="button"
            onClick={openLifePath}
            className="tap-scale flex items-center gap-3 rounded-3xl bg-white p-4 shadow-card text-left"
          >
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-beige-light text-base font-semibold text-beige-dark">
              {lifePath.compatibilityNumber}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Тип отношений: {lifePath.type}</p>
              <p className="mt-0.5 text-xs text-ink-soft">{getLifePathCompatibility(lifePath.compatibilityNumber)?.name}</p>
            </div>
          </button>
        </div>
      )}

      <TextDetailSheet data={sheet} onClose={() => setSheet(null)} />
    </main>
  );
}
