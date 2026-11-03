"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Compass, MessageCircle, Sun, Flower2, Users2 } from "lucide-react";
import { hapticImpact } from "@/lib/telegram";

const GOLD = "#8A6F42";

const STEPS = [
  {
    n: "1",
    title: "Введи дату рождения",
    text: "Только дата — без регистрации и анкет.",
  },
  {
    n: "2",
    title: "Получи свою Матрицу",
    text: "Предназначение, роковая ошибка, денежный канал и прогноз — простыми словами.",
  },
  {
    n: "3",
    title: "Разбери её в клубе",
    text: "Задай вопрос эксперту или закажи полный разбор по методу «Сайфер».",
  },
];

const FEATURES = [
  { href: "/matrix/forecast", title: "Прогноз на год и день", text: "Энергия каждого периода и как её использовать.", icon: Sun, delay: "0s" },
  { href: "/neuro", title: "Нейронастройка", text: "Практики под твои теневые программы.", icon: Flower2, delay: ".6s" },
  { href: "/matrix/compatibility", title: "Совместимость", text: "Пара, партнёр по бизнесу, ребёнок.", icon: Users2, delay: "1.2s" },
  { href: "/ask", title: "Вопрос эксперту", text: "Личный ответ по твоей Матрице.", icon: MessageCircle, delay: "1.8s" },
];

export default function HeroSection() {
  return (
    <>
      <div className="px-5 pt-5 pb-2 flex items-center justify-between animate-fade-up">
        <div className="flex flex-col gap-0.5">
          <span className="font-serif text-2xl font-semibold tracking-tight text-beige-dark">
            Точка Силы
          </span>
          <span className="text-[11px] tracking-[2px] uppercase text-ink-soft">Клуб «Точка Силы»</span>
        </div>
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black/10">
          <svg className="gs-spin absolute inset-0" width="40" height="40" viewBox="0 0 40 40" aria-hidden>
            <circle cx="20" cy="20" r="19" fill="none" stroke={GOLD} strokeWidth="1.2" strokeDasharray="6 10" />
          </svg>
          <Sparkles className="w-4 h-4" style={{ color: GOLD }} strokeWidth={2} />
        </div>
      </div>

      <section className="px-5 animate-fade-up [animation-delay:60ms] opacity-0">
        <div className="relative rounded-5xl bg-white shadow-soft overflow-hidden">
          <div className="relative w-full aspect-video bg-ink">
            <video
              src="/videos/hero.mp4"
              poster="/images/hero-poster.jpg"
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>

          <div className="relative px-6 pt-5 pb-7">
            <p className="text-sm text-ink-soft">Привет! Рада, что ты здесь</p>
            <h1 className="mt-1 font-serif text-[34px] leading-[1.05] font-semibold tracking-tight text-ink">
              Твоя дата рождения — <span className="italic text-beige-dark">это код.</span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              В клубе «Точка Силы» мы расшифровываем его вместе: предназначение, деньги,
              отношения и твой путь на год вперёд — по Матрице судьбы, а не по общему гороскопу.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Нумерология", "Матрица судьбы", "Метод «Сайфер»"].map((tag) => (
                <span key={tag} className="rounded-full bg-beige-light px-3 py-1.5 text-xs font-semibold text-beige-dark">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-4 px-5 animate-fade-up [animation-delay:100ms] opacity-0">
        <div className="relative rounded-[18px] bg-beige-dark overflow-hidden py-3.5">
          <div className="gs-marquee flex w-max gap-0 whitespace-nowrap">
            {[0, 1].map((i) => (
              <span key={i} className="font-serif italic text-[19px] pr-5" style={{ color: "#F3E6CF" }}>
                Предназначение ✦ Деньги ✦ Отношения ✦ Кармические задачи ✦ Совместимость ✦ Прогноз на год ✦
              </span>
            ))}
          </div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(90deg, #6E2436 0%, rgba(110,36,54,0) 14%, rgba(110,36,54,0) 86%, #6E2436 100%)" }}
          />
        </div>
      </div>

      <div className="mt-4 px-5 flex flex-col gap-2.5 animate-fade-up [animation-delay:140ms] opacity-0">
        <Link
          href="/matrix"
          onClick={() => hapticImpact("light")}
          className="tap-scale relative overflow-hidden flex w-full items-center justify-center gap-2 rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white"
        >
          <span
            className="gs-shine absolute inset-y-0 left-0 w-[34%] pointer-events-none"
            style={{ background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.45), rgba(255,255,255,0))" }}
          />
          <Sparkles className="w-5 h-5" strokeWidth={2} />
          Рассчитать мою Матрицу
        </Link>
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href="/matrix/compatibility"
            onClick={() => hapticImpact("light")}
            className="tap-scale flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3.5 text-sm font-semibold text-ink shadow-card"
          >
            <Compass className="w-4 h-4" style={{ color: "#6E2436" }} strokeWidth={2} />
            Совместимость
          </Link>
          <Link
            href="/ask"
            onClick={() => hapticImpact("light")}
            className="tap-scale flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3.5 text-sm font-semibold text-ink shadow-card"
          >
            <MessageCircle className="w-4 h-4" style={{ color: "#6E2436" }} strokeWidth={2} />
            Задать вопрос
          </Link>
        </div>
      </div>

      <div className="mt-9 px-5">
        <span className="text-[11px] tracking-[2px] uppercase font-bold" style={{ color: GOLD }}>
          Что такое Матрица судьбы
        </span>
        <h2 className="mt-2 font-serif text-[28px] leading-[1.1] font-semibold text-ink">
          Карта твоих энергий, <span className="italic text-beige-dark">собранная из одной даты</span>
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
          Из числа, месяца и года рождения складывается схема из 22 арканов. Она показывает, где
          твоя сила, что мешает расти и какие задачи повторяются в жизни, пока их не проработаешь.
        </p>
      </div>

      <div className="mt-5 px-5 flex flex-col gap-2.5">
        {STEPS.map((step) => (
          <div key={step.n} className="flex items-start gap-3.5 rounded-[22px] bg-white p-[18px]">
            <div
              className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full font-serif text-xl font-semibold ${
                step.n === "3" ? "bg-beige-dark text-white" : "bg-beige-light text-beige-dark"
              }`}
            >
              {step.n}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-bold text-ink">{step.title}</span>
              <span className="text-[13px] leading-relaxed text-ink-soft">{step.text}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-11 px-5">
        <span className="text-[11px] tracking-[2px] uppercase font-bold" style={{ color: GOLD }}>
          Внутри клуба
        </span>
        <h2 className="mt-2 font-serif text-[28px] leading-[1.1] font-semibold text-ink">
          Каждый день — <span className="italic text-beige-dark">шаг к себе</span>
        </h2>
      </div>

      <div className="mt-4 px-5 grid grid-cols-2 gap-2.5">
        {FEATURES.map(({ href, title, text, icon: Icon, delay }) => (
          <Link key={href} href={href} onClick={() => hapticImpact("light")} className="tap-scale flex flex-col gap-2.5 rounded-[22px] bg-white p-[18px]">
            <Icon className="float-soft w-[26px] h-[26px]" style={{ color: GOLD, animationDelay: delay }} strokeWidth={1.8} />
            <span className="text-[15px] font-bold leading-tight text-ink">{title}</span>
            <span className="text-[13px] leading-snug text-ink-soft">{text}</span>
          </Link>
        ))}
      </div>

      <div className="mt-9 px-5">
        <div className="relative overflow-hidden rounded-4xl bg-white p-[22px] flex flex-col gap-3.5">
          <svg width="120" height="120" viewBox="0 0 120 120" className="absolute -right-5 -top-5 opacity-55" aria-hidden>
            <circle className="gs-line" cx="60" cy="60" r="44" fill="none" stroke="#E2D4BC" strokeWidth="1" />
            <path className="gs-line" d="M60 16L98 82H22z" fill="none" stroke="#E2D4BC" strokeWidth="1" />
            <path className="gs-line" d="M60 104L22 38h76z" fill="none" stroke="#E2D4BC" strokeWidth="1" />
          </svg>
          <div className="flex items-center gap-3.5">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2" style={{ borderColor: "#E2D4BC" }}>
              <Image src="/images/expert.jpg" alt="Анастасия Гафке" width={64} height={64} className="h-full w-full object-cover object-[64%_30%]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] tracking-[1.6px] uppercase font-bold" style={{ color: GOLD }}>
                Ведущая клуба
              </span>
              <span className="font-serif text-2xl font-semibold leading-tight text-ink">Анастасия Гафке</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-ink-soft">
            Автор метода «Сайфер», в котором Матрица судьбы соединяется с 64 Генными Ключами. 20
            лет в бизнесе и собственный путь от выгорания к ясности — в основе методики.
          </p>
          <Link
            href="/about"
            onClick={() => hapticImpact("light")}
            className="tap-scale flex h-[50px] items-center justify-center gap-2 rounded-full border border-black/10 text-sm font-semibold text-ink"
          >
            Об эксперте
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>
      </div>

      <div className="mt-4 px-5 pb-2">
        <div className="relative overflow-hidden rounded-4xl bg-ink p-6 flex flex-col gap-3.5">
          <svg className="gs-star absolute right-7 top-[22px]" width="14" height="14" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" fill="#E8D7B5" />
          </svg>
          <svg className="gs-star2 absolute right-[62px] top-[52px]" width="10" height="10" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" fill="#E8D7B5" />
          </svg>
          <svg className="gs-star absolute right-10 top-[84px] [animation-delay:1.4s]" width="8" height="8" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" fill="#E8D7B5" />
          </svg>
          <h2 className="font-serif text-[26px] leading-[1.1] font-semibold max-w-[250px]" style={{ color: "#F3EEE6" }}>
            Начни с одной даты. <span className="italic" style={{ color: "#E8D7B5" }}>Остальное — расскажет Матрица.</span>
          </h2>
          <Link
            href="/matrix"
            onClick={() => hapticImpact("light")}
            className="tap-scale relative overflow-hidden flex h-14 items-center justify-center gap-2 rounded-full text-base font-bold text-ink"
            style={{ background: "#E8D7B5" }}
          >
            <span
              className="gs-shine absolute inset-y-0 left-0 w-[34%] pointer-events-none"
              style={{ background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.7), rgba(255,255,255,0))" }}
            />
            Рассчитать Матрицу
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </>
  );
}
