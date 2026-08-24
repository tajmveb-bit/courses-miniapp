"use client";

import { useState } from "react";
import { Send, Stethoscope } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import { medicalServices } from "@/data/club";
import { postWithAuth } from "@/lib/apiClient";
import { hapticImpact, hapticNotification } from "@/lib/telegram";

export default function MedicalPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [sentId, setSentId] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const handleSubmit = async (serviceId: string) => {
    setError(false);
    try {
      await postWithAuth("/api/medical", { serviceId, note });
      setSentId(serviceId);
      setActiveId(null);
      setNote("");
      hapticNotification("success");
    } catch {
      setError(true);
      hapticNotification("error");
    }
  };

  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Медицинская поддержка</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Медицинский блок отделён от косметологического контента клуба. Консультацию и трактовку
          результатов даёт врач или медицинский партнёр — не косметолог, не администратор и не бот.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3 px-5 animate-fade-up [animation-delay:80ms] opacity-0">
        {medicalServices.map((service) => (
          <div key={service.id} className="rounded-4xl bg-white shadow-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-beige-light">
                <Stethoscope className="w-5 h-5 text-beige-dark" strokeWidth={1.8} />
              </div>
              <h2 className="text-base font-semibold text-ink leading-snug">{service.title}</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{service.description}</p>

            <ul className="mt-3 flex flex-col gap-1.5">
              {service.bullets.map((bullet) => (
                <li key={bullet} className="text-[13px] leading-relaxed text-ink-soft flex gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-beige-dark" />
                  {bullet}
                </li>
              ))}
            </ul>

            {activeId === service.id ? (
              <div className="mt-4">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Кратко опишите цель обращения"
                  className="w-full rounded-2xl bg-beige-light/50 p-3.5 text-sm text-ink placeholder:text-ink-soft/60 outline-none focus:ring-2 focus:ring-beige-dark resize-none"
                />
                {error && <p className="mt-2 text-xs text-red-500">Не получилось отправить. Попробуйте ещё раз.</p>}
                <button
                  type="button"
                  onClick={() => {
                    hapticImpact("medium");
                    handleSubmit(service.id);
                  }}
                  className="tap-scale mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-beige-dark px-6 py-3.5 text-sm font-semibold text-white shadow-button"
                >
                  Отправить заявку
                  <Send className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  hapticImpact("light");
                  setActiveId(service.id);
                  setSentId(null);
                }}
                className="tap-scale mt-4 w-full rounded-full bg-beige-light px-6 py-3 text-sm font-semibold text-beige-dark"
              >
                Оставить заявку
              </button>
            )}

            {sentId === service.id && (
              <p className="mt-3 text-xs font-medium text-beige-dark">Заявка отправлена, мы свяжемся с вами.</p>
            )}
          </div>
        ))}

        <Disclaimer text="В экстренной ситуации чат не заменяет скорую помощь — обратитесь в местную экстренную службу." />
      </div>
    </main>
  );
}
