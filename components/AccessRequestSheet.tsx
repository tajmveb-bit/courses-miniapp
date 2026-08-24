"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Send, X } from "lucide-react";
import { postWithAuth } from "@/lib/apiClient";
import { hapticImpact, hapticNotification } from "@/lib/telegram";

interface AccessRequestSheetProps {
  open: boolean;
  onClose: () => void;
  tariffId: string;
  tariffTitle: string;
}

export default function AccessRequestSheet({ open, onClose, tariffId, tariffTitle }: AccessRequestSheetProps) {
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async () => {
    setStatus("sending");
    try {
      await postWithAuth("/api/access/request", { tariffId, contact });
      setStatus("sent");
      hapticNotification("success");
    } catch {
      setStatus("error");
      hapticNotification("error");
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStatus("idle");
      setContact("");
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="relative w-full max-w-md rounded-t-5xl bg-white px-6 pb-[max(env(safe-area-inset-bottom),24px)] pt-3 shadow-lifted"
          >
            <div className="mx-auto h-1.5 w-10 rounded-full bg-beige-light" />

            <button
              type="button"
              onClick={handleClose}
              aria-label="Закрыть"
              className="tap-scale absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-beige-light"
            >
              <X className="w-4 h-4 text-ink-soft" strokeWidth={2} />
            </button>

            {status === "sent" ? (
              <div className="mt-6 flex flex-col items-center text-center pb-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-beige-light">
                  <Check className="w-7 h-7 text-beige-dark" strokeWidth={1.8} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">Заявка отправлена</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft max-w-[300px]">
                  Мы свяжемся с вами, чтобы согласовать оплату и подключить тариф.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="tap-scale mt-6 w-full rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white shadow-button"
                >
                  Понятно
                </button>
              </div>
            ) : (
              <div className="mt-6 pb-2">
                <h3 className="text-lg font-semibold text-ink">Запросить доступ</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Тариф «{tariffTitle}». Оплата проходит вне приложения — оставьте контакт, и
                  администратор свяжется с вами, чтобы согласовать оплату.
                </p>

                <label className="mt-4 block text-xs font-medium text-ink-soft">
                  Как с вами удобнее связаться
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Телефон, @username или email"
                  className="mt-1.5 w-full rounded-2xl bg-beige-light/60 px-4 py-3.5 text-sm text-ink placeholder:text-ink-soft/60 outline-none focus:ring-2 focus:ring-beige-dark"
                />

                {status === "error" && (
                  <p className="mt-2 text-xs text-red-500">
                    Не получилось отправить заявку. Попробуйте ещё раз.
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => {
                    hapticImpact("medium");
                    handleSubmit();
                  }}
                  disabled={status === "sending"}
                  className="tap-scale mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white shadow-button disabled:opacity-60"
                >
                  {status === "sending" ? "Отправляем..." : "Отправить заявку"}
                  <Send className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
