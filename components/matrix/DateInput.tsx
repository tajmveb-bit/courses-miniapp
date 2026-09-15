"use client";

import { X } from "lucide-react";
import { formatDateInput } from "@/lib/dateInput";

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function DateInput({ value, onChange, placeholder = "дд.мм.гггг" }: DateInputProps) {
  return (
    <div className="relative w-full">
      <input
        value={value}
        onChange={(e) => onChange(formatDateInput(e.target.value))}
        onFocus={(e) => e.target.select()}
        placeholder={placeholder}
        inputMode="numeric"
        className={`w-full rounded-2xl border border-black/10 bg-cream px-4 py-3 text-base text-ink text-center tracking-wide outline-none focus:border-beige-dark ${
          value.length > 0 ? "pr-10" : ""
        }`}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Очистить дату"
          className="tap-scale absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-ink-soft"
        >
          <X className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
