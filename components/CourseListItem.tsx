"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Course } from "@/data/courses";
import CourseVisual from "@/components/CourseVisual";
import { hapticSelection } from "@/lib/telegram";

interface CourseListItemProps {
  course: Course;
}

export default function CourseListItem({ course }: CourseListItemProps) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      onClick={() => hapticSelection()}
      className="tap-scale flex items-stretch gap-4 rounded-3xl bg-white p-3 shadow-card"
    >
      <CourseVisual
        icon={course.icon}
        gradient={course.gradient}
        className="w-24 h-24 flex-shrink-0 rounded-2xl"
        iconClassName="w-7 h-7"
      />

      <div className="flex flex-1 flex-col justify-center min-w-0 py-1">
        <h3 className="text-[15px] font-semibold text-ink leading-snug line-clamp-2">
          {course.title}
        </h3>
        <p className="mt-1 text-[13px] text-ink-soft leading-relaxed line-clamp-2">
          {course.shortDescription}
        </p>
        <p className="mt-2 text-[15px] font-semibold text-beige-dark">
          {course.price.toLocaleString("ru-RU")} {course.currency}
        </p>
      </div>

      <div className="flex items-center pr-1">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-beige-light">
          <ArrowRight className="w-4 h-4 text-beige-dark" strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}
