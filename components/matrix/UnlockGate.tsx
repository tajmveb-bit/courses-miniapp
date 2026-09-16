"use client";

import { useState } from "react";
import { Lock, MessageCircle } from "lucide-react";
import { useMatrixUnlock } from "@/lib/matrixUnlock";
import type { Section } from "@/lib/unlockCodes";
import { openWhatsApp } from "@/lib/whatsapp";
import { hapticImpact, hapticNotification } from "@/lib/telegram";

interface UnlockGateProps {
  section: Section;
  title?: string;
  price?: string;
  description?: string;
  children?: React.ReactNode;
}

export default function UnlockGate({
  section,
  title = "Полный разбор",
  price = "15 000 ₸",
  description = "Подробная расшифровка событий и график жизненной энергии доступны после оплаты",
  children = null,
}: UnlockGateProps) {
  const { unlocked, checking, error, tryUnlock } = useMatrixUnlock(section);
  const [code, setCode] = useState("");

  if (unlocked) return <>{children}</>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await tryUnlock(code);
    hapticNotification(ok ? "success" : "error");
  };

  return (
    <div className="rounded-4xl bg-white shadow-soft p-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-beige-light">
        <Lock className="w-6 h-6 text-beige-dark" strokeWidth={1.8} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        {description} — {price}. Напишите в WhatsApp, чтобы оформить доступ, и вы получите код
        разблокировки.
      </p>

      <button
        type="button"
        onClick={() => {
          hapticImpact("light");
          openWhatsApp(`Здравствуйте! Хочу получить доступ к разделу «${title}» в Матрице судьбы.`);
        }}
        className="tap-scale mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white shadow-button"
      >
        <MessageCircle className="w-5 h-5" strokeWidth={2} />
        Написать в WhatsApp
      </button>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2">
        <p className="text-xs text-ink-soft">Уже оплатили? Введите код из WhatsApp</p>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Код доступа"
            className="w-0 flex-1 min-w-0 rounded-2xl border border-black/10 bg-cream px-4 py-3 text-base text-ink text-center tracking-wide outline-none focus:border-beige-dark"
          />
          <button
            type="submit"
            disabled={checking || code.trim().length === 0}
            className="tap-scale flex-shrink-0 rounded-2xl bg-beige-light px-4 py-3 text-sm font-semibold text-beige-dark disabled:opacity-40"
          >
            {checking ? "..." : "Ввести"}
          </button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </form>
    </div>
  );
}
