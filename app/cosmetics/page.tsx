"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import { openWhatsApp } from "@/lib/whatsapp";
import { hapticImpact, hapticNotification } from "@/lib/telegram";

const TOPICS = [
  "Состав продукта",
  "Домашний уход",
  "Совместимость средств",
  "Порядок нанесения",
  "Продукт для кожи",
  "Продукт для волос",
];

export default function CosmeticsPage() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const handleSubmit = () => {
    if (!details.trim()) return;
    const message = `Разбор косметики\nТема: ${topic}\n\n${details}`;
    openWhatsApp(message);
    setStatus("sent");
    setDetails("");
    hapticNotification("success");
  };

  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Разбор косметики</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Пришлите название, ссылку или состав средства — запрос уйдёт в WhatsApp.
        </p>
      </div>

      <div className="px-5 mt-5 animate-fade-up [animation-delay:60ms] opacity-0">
        <p className="text-xs font-medium text-ink-soft mb-2">Тема обращения</p>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              className={`tap-scale rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                topic === t ? "bg-beige-dark text-white shadow-button" : "bg-white text-ink-soft shadow-card"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <p className="text-xs font-medium text-ink-soft mt-5 mb-2">Название, ссылка или состав</p>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={5}
          placeholder="Например: название крема или список ингредиентов на упаковке"
          className="w-full rounded-3xl bg-white p-4 text-sm text-ink shadow-card placeholder:text-ink-soft/60 outline-none focus:ring-2 focus:ring-beige-dark resize-none"
        />

        <div className="mt-4">
          <Disclaimer text="Разбор объясняет назначение ключевых компонентов и место продукта в уходе, но не обещает лечение или гарантированный результат." />
        </div>

        {status === "sent" && (
          <p className="mt-3 text-xs text-beige-dark">Открылся WhatsApp — отправьте сообщение, чтобы завершить запрос.</p>
        )}

        <button
          type="button"
          onClick={() => {
            hapticImpact("medium");
            handleSubmit();
          }}
          disabled={!details.trim()}
          className="tap-scale mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white shadow-button disabled:opacity-50"
        >
          Отправить на разбор в WhatsApp
          <Send className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </main>
  );
}
