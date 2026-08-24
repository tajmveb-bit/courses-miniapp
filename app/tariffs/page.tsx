"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import BackButton from "@/components/BackButton";
import AccessRequestSheet from "@/components/AccessRequestSheet";
import { tariffs } from "@/data/club";
import { hapticImpact } from "@/lib/telegram";

export default function TariffsPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedTariff = tariffs.find((t) => t.id === selected);

  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 flex items-center gap-3 animate-fade-up">
        <BackButton fallbackHref="/" />
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Тарифы</h1>
      </div>

      <p className="px-5 mt-3 text-sm leading-relaxed text-ink-soft animate-fade-up [animation-delay:40ms] opacity-0">
        Оплата проходит вне приложения — по заявке администратор свяжется с вами и согласует
        способ оплаты.
      </p>

      <div className="mt-5 flex flex-col gap-3 px-5 animate-fade-up [animation-delay:80ms] opacity-0">
        {tariffs.map((tariff) => (
          <div
            key={tariff.id}
            className={`rounded-4xl bg-white p-5 shadow-card ${tariff.highlight ? "ring-2 ring-beige-dark" : ""}`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">{tariff.title}</h2>
              {tariff.highlight && (
                <span className="rounded-full bg-beige-dark px-3 py-1 text-[11px] font-semibold text-white">
                  Популярный
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-ink-soft">{tariff.purpose}</p>

            <ul className="mt-4 flex flex-col gap-2">
              {tariff.composition.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-beige-dark" strokeWidth={2.2} />
                  {item}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => {
                hapticImpact("medium");
                setSelected(tariff.id);
              }}
              className="tap-scale mt-5 w-full rounded-full bg-beige-dark px-6 py-3.5 text-sm font-semibold text-white shadow-button"
            >
              Запросить доступ
            </button>
          </div>
        ))}
      </div>

      {selectedTariff && (
        <AccessRequestSheet
          open={!!selected}
          onClose={() => setSelected(null)}
          tariffId={selectedTariff.id}
          tariffTitle={selectedTariff.title}
        />
      )}
    </main>
  );
}
