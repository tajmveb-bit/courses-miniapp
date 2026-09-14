"use client";

import { formatDateInput } from "@/lib/dateInput";

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function DateInput({ value, onChange, placeholder = "дд.мм.гггг" }: DateInputProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(formatDateInput(e.target.value))}
      placeholder={placeholder}
      inputMode="numeric"
      className="w-full rounded-2xl border border-black/10 bg-cream px-4 py-3 text-base text-ink text-center tracking-wide outline-none focus:border-beige-dark"
    />
  );
}
