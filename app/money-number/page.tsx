"use client";

import { MessageCircle, Smartphone } from "lucide-react";
import BackButton from "@/components/BackButton";
import { hapticImpact, requestBotAccess } from "@/lib/telegram";

const POINTS = [
  "рассчитывает твои самые сильные денежные цифры, которые влияют на тебя",
  "убирает все цифры, которые работают тебе в минус и не подходят",
  "собирает тебе новый денежный номер, который работает на масштаб",
];

export default function MoneyNumberPage() {
  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 flex items-center gap-3 animate-fade-up">
        <BackButton fallbackHref="/more" />
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Денежный номер</h1>
      </div>

      <div className="px-5 mt-4 animate-fade-up [animation-delay:60ms] opacity-0">
        <div className="rounded-4xl bg-white shadow-soft p-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-beige-light">
            <Smartphone className="w-6 h-6 text-beige-dark" strokeWidth={1.8} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-center text-ink">
            Твой номер телефона влияет на деньги больше, чем ты думаешь
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Ты видишь его каждый день, годами. В нумерологии считается, что цифры номера несут
            энергию: они либо ведут тебя к росту, либо создают затыки в финансах и масштабе.
          </p>

          <p className="mt-4 text-sm font-semibold text-ink">Что делает Анастасия:</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {POINTS.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink-soft">
                <span className="text-beige-dark">✦</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-3xl bg-cream p-4">
            <p className="text-sm font-semibold text-ink">💎 Матрица судьбы + денежный номер — 150 000 ₸</p>
            <p className="mt-1 text-xs text-ink-soft">Консультация 2 часа, офлайн в Астане или онлайн.</p>
          </div>

          <button
            type="button"
            onClick={() => {
              hapticImpact("light");
              requestBotAccess("money-number");
            }}
            className="tap-scale pulse-glow mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white"
          >
            <MessageCircle className="w-5 h-5" strokeWidth={2} />
            Записаться в Telegram
          </button>
        </div>
      </div>
    </main>
  );
}
