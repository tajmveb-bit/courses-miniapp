"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock3, X } from "lucide-react";

interface PaymentSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function PaymentSheet({ open, onClose }: PaymentSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
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
              onClick={onClose}
              aria-label="Закрыть"
              className="tap-scale absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-beige-light"
            >
              <X className="w-4 h-4 text-ink-soft" strokeWidth={2} />
            </button>

            <div className="mt-6 flex flex-col items-center text-center pb-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-beige-light">
                <Clock3 className="w-7 h-7 text-beige-dark" strokeWidth={1.6} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">
                Оплата будет доступна совсем скоро
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft max-w-[300px]">
                Функция оплаты находится в разработке. Мы сообщим, как только сможете
                оформить покупку прямо в приложении.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="tap-scale mt-6 w-full rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white shadow-button"
              >
                Понятно
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
