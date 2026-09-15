"use client";

import { useRef } from "react";
import { X } from "lucide-react";

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

function splitValue(value: string): [string, string, string] {
  const parts = value.split(".");
  return [parts[0] ?? "", parts[1] ?? "", parts[2] ?? ""];
}

function combine(day: string, month: string, year: string): string {
  if (!day && !month && !year) return "";
  return `${day}.${month}.${year}`;
}

const segmentClass =
  "bg-transparent text-center text-base text-ink outline-none placeholder:text-ink-soft/40";

export default function DateInput({ value, onChange, label }: DateInputProps) {
  const [day, month, year] = splitValue(value);
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const handleDayChange = (raw: string) => {
    const d = raw.replace(/\D/g, "").slice(0, 2);
    onChange(combine(d, month, year));
    if (d.length === 2) monthRef.current?.focus();
  };

  const handleMonthChange = (raw: string) => {
    const m = raw.replace(/\D/g, "").slice(0, 2);
    onChange(combine(day, m, year));
    if (m.length === 2) yearRef.current?.focus();
  };

  const handleYearChange = (raw: string) => {
    const y = raw.replace(/\D/g, "").slice(0, 4);
    onChange(combine(day, month, y));
  };

  const handleMonthKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && month === "") dayRef.current?.focus();
  };

  const handleYearKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && year === "") monthRef.current?.focus();
  };

  // A tap/click on a text input has a native default action that positions the caret at the
  // tap point — in Chromium that's skipped on the very first focusing click (an onFocus select()
  // sticks), but WebKit applies it even then, silently overriding a plain onFocus select(). With
  // maxLength already reached and nothing selected, the browser then blocks further typing
  // entirely, so a tap on an already-filled segment can look like it does nothing. Blocking that
  // native caret placement with preventDefault() and taking focus+select fully into our own
  // hands sidesteps the inconsistency instead of racing it. onFocus is kept for the one case with
  // no mousedown at all: the programmatic focus() from auto-advancing to the next segment.
  const selectAllNow = (e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.select();
  const selectAllOnTap = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const el = e.currentTarget;
    el.focus();
    el.select();
  };

  const hasValue = day.length > 0 || month.length > 0 || year.length > 0;

  const clear = () => {
    onChange("");
    dayRef.current?.focus();
  };

  return (
    <div className="w-full">
      {label && <p className="mb-1.5 text-xs text-ink-soft">{label}</p>}
      <div className="flex items-center justify-center gap-1 rounded-2xl border border-black/10 bg-cream px-4 py-3 focus-within:border-beige-dark">
        <input
          ref={dayRef}
          value={day}
          onChange={(e) => handleDayChange(e.target.value)}
          onFocus={selectAllNow}
          onMouseDown={selectAllOnTap}
          inputMode="numeric"
          placeholder="ДД"
          maxLength={2}
          className={`${segmentClass} w-7`}
        />
        <span className="text-ink-soft">.</span>
        <input
          ref={monthRef}
          value={month}
          onChange={(e) => handleMonthChange(e.target.value)}
          onKeyDown={handleMonthKeyDown}
          onFocus={selectAllNow}
          onMouseDown={selectAllOnTap}
          inputMode="numeric"
          placeholder="ММ"
          maxLength={2}
          className={`${segmentClass} w-7`}
        />
        <span className="text-ink-soft">.</span>
        <input
          ref={yearRef}
          value={year}
          onChange={(e) => handleYearChange(e.target.value)}
          onKeyDown={handleYearKeyDown}
          onFocus={selectAllNow}
          onMouseDown={selectAllOnTap}
          inputMode="numeric"
          placeholder="ГГГГ"
          maxLength={4}
          className={`${segmentClass} w-14`}
        />
        {hasValue && (
          <button
            type="button"
            onClick={clear}
            aria-label="Очистить дату"
            className="tap-scale flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-black/10 text-ink-soft"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}
