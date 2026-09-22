"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { hapticImpact } from "@/lib/telegram";

export default function HeroSection() {
  return (
    <section className="px-5 pt-6 animate-fade-up">
      <div className="relative rounded-5xl bg-white shadow-soft overflow-hidden">
        <div className="relative h-72 w-full">
          <Image
            src="/images/expert.jpg"
            alt="Эксперт клуба"
            fill
            priority
            sizes="(max-width: 480px) 100vw, 480px"
            className="object-cover object-[50%_8%]"
          />
        </div>

        <div className="relative px-6 pt-5 pb-7">
          <p className="text-2xl">
            Привет! <span className="inline-block">👋</span>
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">
            Клуб «Точка Силы»
          </h1>
          <p className="mt-2 text-sm font-medium text-beige-dark">Нумерология и Матрица судьбы</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft max-w-[90%]">
            Рассчитайте свою личную Матрицу судьбы: предназначения, роковую ошибку, прогнозы и
            совместимость — по методике, без общих гороскопов.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <Link
          href="/matrix"
          onClick={() => hapticImpact("light")}
          className="tap-scale flex w-full items-center justify-center gap-2 rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white shadow-button"
        >
          <Sparkles className="w-5 h-5" strokeWidth={2} />
          Рассчитать Матрицу судьбы
        </Link>
        <Link
          href="/about"
          onClick={() => hapticImpact("light")}
          className="tap-scale flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-base font-semibold text-ink shadow-card"
        >
          Об эксперте
          <ArrowRight className="w-5 h-5" strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
