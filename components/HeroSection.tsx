"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { hapticImpact } from "@/lib/telegram";
import { openWhatsApp } from "@/lib/whatsapp";

export default function HeroSection() {
  return (
    <section className="px-5 pt-6 animate-fade-up">
      <div className="relative rounded-5xl bg-white shadow-soft overflow-hidden">
        <div className="relative px-6 pt-7 pb-0">
          <p className="text-2xl">
            Привет! <span className="inline-block">👋</span>
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">
            Клуб «Код Красоты»
          </h1>
          <p className="mt-2 text-sm font-medium text-beige-dark">Формула ухоженности 35+</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft max-w-[90%]">
            Спокойная и реалистичная система ухода для женщин 35+: кожа, волосы, энергия,
            привычки и поддержка специалиста. Не нужно быть идеальной — начнём с одного
            понятного шага.
          </p>
        </div>

        <div className="relative mt-5 h-56 w-full">
          <Image
            src="/images/expert.webp"
            alt="Эксперт клуба"
            fill
            priority
            sizes="(max-width: 480px) 100vw, 480px"
            className="object-cover object-top"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <Link
          href="/diagnosis"
          onClick={() => hapticImpact("light")}
          className="tap-scale flex w-full items-center justify-center gap-2 rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white shadow-button"
        >
          <Sparkles className="w-5 h-5" strokeWidth={2} />
          Пройти мини-диагностику
        </Link>
        <button
          type="button"
          onClick={() => {
            hapticImpact("light");
            openWhatsApp("Здравствуйте! Хочу записаться в салон.");
          }}
          className="tap-scale flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-base font-semibold text-ink shadow-card"
        >
          Записаться в салон
          <ArrowRight className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}
