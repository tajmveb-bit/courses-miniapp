"use client";

import { useState } from "react";
import Link from "next/link";
import { getCourseBySlug } from "@/data/courses";
import CourseVisual from "@/components/CourseVisual";
import CourseCharacteristics from "@/components/CourseCharacteristics";
import CourseModules from "@/components/CourseModules";
import FavoriteButton from "@/components/FavoriteButton";
import BackButton from "@/components/BackButton";
import PaymentSheet from "@/components/PaymentSheet";
import { hapticImpact } from "@/lib/telegram";

interface CoursePageProps {
  params: { slug: string };
}

export default function CoursePage({ params }: CoursePageProps) {
  const course = getCourseBySlug(params.slug);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!course) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-lg font-semibold text-ink">Курс не найден</p>
        <Link
          href="/courses"
          className="tap-scale rounded-full bg-beige-dark px-6 py-3 text-sm font-semibold text-white"
        >
          К списку курсов
        </Link>
      </main>
    );
  }

  const handleBuyClick = () => {
    hapticImpact("medium");
    setSheetOpen(true);
  };

  return (
    <main className="pb-40">
      <div className="relative animate-fade-up">
        <CourseVisual
          icon={course.icon}
          gradient={course.gradient}
          className="h-72 w-full"
          iconClassName="w-14 h-14"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),20px)]">
          <BackButton fallbackHref="/courses" />
          <FavoriteButton courseId={course.id} variant="icon" />
        </div>
      </div>

      <div className="px-5">
        <div className="-mt-6 relative rounded-t-5xl bg-cream pt-6">
          <h1 className="text-2xl font-semibold tracking-tight text-ink leading-tight">
            {course.title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {course.shortDescription}
          </p>

          <p className="mt-5 text-sm leading-relaxed text-ink-soft whitespace-pre-line">
            {course.fullDescription}
          </p>

          <div className="mt-6">
            <CourseCharacteristics items={course.characteristics} />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-ink">Программа курса</h2>
            <div className="mt-4">
              <CourseModules modules={course.modules} />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 px-5 pb-[max(env(safe-area-inset-bottom),16px)] pt-4">
        <div className="mx-auto max-w-md rounded-4xl bg-white/95 backdrop-blur-xl shadow-lifted px-4 pt-3 pb-4 border border-black/[0.03]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-ink-soft">Стоимость курса</p>
              <p className="text-lg font-semibold text-ink">
                {course.price.toLocaleString("ru-RU")} {course.currency}
              </p>
            </div>
            <button
              type="button"
              onClick={handleBuyClick}
              className="tap-scale flex-1 rounded-full bg-beige-dark px-6 py-4 text-base font-semibold text-white shadow-button"
            >
              Купить курс
            </button>
          </div>
          <div className="mt-2 flex justify-center">
            <FavoriteButton courseId={course.id} variant="pill" />
          </div>
        </div>
      </div>

      <PaymentSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </main>
  );
}
