"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { postWithAuth } from "@/lib/apiClient";
import { hapticImpact, hapticNotification } from "@/lib/telegram";

const FORMATS = ["Консультация", "Кожа", "Волосы", "Процедура", "Домашний уход"];

export default function SalonPage() {
  const [form, setForm] = useState({ name: "", city: "", contact: "", topic: "", time: "" });
  const [format, setFormat] = useState(FORMATS[0]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.contact.trim()) return;
    setStatus("sending");
    try {
      await postWithAuth("/api/salon", { ...form, format });
      setStatus("sent");
      hapticNotification("success");
    } catch {
      setStatus("error");
      hapticNotification("error");
    }
  };

  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Записаться в салон</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Если после материалов клуба вы не можете определить приоритет самостоятельно, запишитесь
          на диагностику «Формула ухоженности».
        </p>
      </div>

      {status === "sent" ? (
        <div className="mx-5 mt-6 rounded-4xl bg-white shadow-soft p-6 text-center animate-fade-up">
          <p className="text-base font-semibold text-ink">Заявка отправлена</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Мы свяжемся с вами, чтобы согласовать удобное время.
          </p>
        </div>
      ) : (
        <div className="px-5 mt-5 flex flex-col gap-3 animate-fade-up [animation-delay:60ms] opacity-0">
          <input
            value={form.name}
            onChange={update("name")}
            placeholder="Имя"
            className="w-full rounded-2xl bg-white px-4 py-3.5 text-sm text-ink shadow-card placeholder:text-ink-soft/60 outline-none focus:ring-2 focus:ring-beige-dark"
          />
          <input
            value={form.city}
            onChange={update("city")}
            placeholder="Город"
            className="w-full rounded-2xl bg-white px-4 py-3.5 text-sm text-ink shadow-card placeholder:text-ink-soft/60 outline-none focus:ring-2 focus:ring-beige-dark"
          />
          <input
            value={form.contact}
            onChange={update("contact")}
            placeholder="Телефон, @username или email"
            className="w-full rounded-2xl bg-white px-4 py-3.5 text-sm text-ink shadow-card placeholder:text-ink-soft/60 outline-none focus:ring-2 focus:ring-beige-dark"
          />
          <input
            value={form.topic}
            onChange={update("topic")}
            placeholder="Какая задача вас интересует"
            className="w-full rounded-2xl bg-white px-4 py-3.5 text-sm text-ink shadow-card placeholder:text-ink-soft/60 outline-none focus:ring-2 focus:ring-beige-dark"
          />
          <input
            value={form.time}
            onChange={update("time")}
            placeholder="Удобное время"
            className="w-full rounded-2xl bg-white px-4 py-3.5 text-sm text-ink shadow-card placeholder:text-ink-soft/60 outline-none focus:ring-2 focus:ring-beige-dark"
          />

          <p className="text-xs font-medium text-ink-soft mt-1">Желаемый формат</p>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={`tap-scale rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  format === f ? "bg-beige-dark text-white shadow-button" : "bg-white text-ink-soft shadow-card"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <p className="text-xs leading-relaxed text-ink-soft/80 mt-1">
            Отправляя заявку, вы соглашаетесь на обратную связь по указанному контакту.
          </p>

          {status === "error" && (
            <p className="text-xs text-red-500">Не получилось отправить заявку. Попробуйте ещё раз.</p>
          )}

          <button
            type="button"
            onClick={() => {
              hapticImpact("medium");
              handleSubmit();
            }}
            disabled={status === "sending" || !form.contact.trim()}
            className="tap-scale mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white shadow-button disabled:opacity-50"
          >
            {status === "sending" ? "Отправляем..." : "Отправить заявку"}
            <Send className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      )}
    </main>
  );
}
