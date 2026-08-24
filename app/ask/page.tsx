"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import { postWithAuth } from "@/lib/apiClient";
import { hapticImpact, hapticNotification } from "@/lib/telegram";

const TOPICS = ["Кожа", "Волосы", "Домашний уход", "Процедуры", "Продукты", "Энергия и привычки", "Другое"];

export default function AskPage() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setStatus("sending");
    try {
      await postWithAuth("/api/ask", { topic, message });
      setStatus("sent");
      setMessage("");
      hapticNotification("success");
    } catch {
      setStatus("error");
      hapticNotification("error");
    }
  };

  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Задать вопрос</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Выберите тему и опишите ситуацию — ответ придёт лично или в общий разбор.
        </p>
      </div>

      <div className="px-5 mt-5 animate-fade-up [animation-delay:60ms] opacity-0">
        <p className="text-xs font-medium text-ink-soft mb-2">Тема</p>
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

        <p className="text-xs font-medium text-ink-soft mt-5 mb-2">Ваш вопрос</p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Опишите ситуацию подробнее..."
          className="w-full rounded-3xl bg-white p-4 text-sm text-ink shadow-card placeholder:text-ink-soft/60 outline-none focus:ring-2 focus:ring-beige-dark resize-none"
        />

        <div className="mt-4">
          <Disclaimer text="Клуб носит информационно-образовательный характер. По фотографиям и переписке нельзя поставить медицинский диагноз. При выраженных или необычных симптомах обратитесь к профильному специалисту очно." />
        </div>

        {status === "error" && (
          <p className="mt-3 text-xs text-red-500">Не получилось отправить вопрос. Попробуйте ещё раз.</p>
        )}
        {status === "sent" && (
          <p className="mt-3 text-xs text-beige-dark">Вопрос отправлен! Мы ответим лично или в общем разборе.</p>
        )}

        <button
          type="button"
          onClick={() => {
            hapticImpact("medium");
            handleSubmit();
          }}
          disabled={status === "sending" || !message.trim()}
          className="tap-scale mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white shadow-button disabled:opacity-50"
        >
          {status === "sending" ? "Отправляем..." : "Отправить вопрос"}
          <Send className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </main>
  );
}
