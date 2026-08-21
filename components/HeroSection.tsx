"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { hapticImpact } from "@/lib/telegram";

const EXPERT_NAME = "Алина";
const EXPERT_TAGLINE = "Эксперт в сфере красоты и ухода за кожей";
const EXPERT_INTRO =
  "Я создаю обучающие программы и делюсь знаниями, которые помогают женщинам быть уверенными и ухоженными каждый день.";

export default function HeroSection() {
  return (
    <section className="px-5 pt-6 animate-fade-up">
      <div className="relative rounded-5xl bg-white shadow-soft overflow-hidden">
        <div className="relative px-6 pt-7 pb-0">
          <p className="text-2xl">
            Привет! <span className="inline-block">👋</span>
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">
            Я — {EXPERT_NAME}
          </h1>
          <p className="mt-2 text-sm font-medium text-beige-dark">{EXPERT_TAGLINE}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft max-w-[85%]">
            {EXPERT_INTRO}
          </p>
        </div>

        <div className="relative mt-5 h-56 w-full">
          <Image
            src="/images/expert.webp"
            alt={EXPERT_NAME}
            fill
            priority
            sizes="(max-width: 480px) 100vw, 480px"
            className="object-cover object-top"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>
      </div>

      <Link
        href="/courses"
        onClick={() => hapticImpact("light")}
        className="tap-scale mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white shadow-button"
      >
        Смотреть курсы
        <ArrowRight className="w-5 h-5" strokeWidth={2} />
      </Link>
    </section>
  );
}
