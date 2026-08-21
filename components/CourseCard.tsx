"use client";

import Link from "next/link";
import type { Course } from "@/data/courses";
import CourseVisual from "@/components/CourseVisual";
import { hapticSelection } from "@/lib/telegram";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      onClick={() => hapticSelection()}
      className="tap-scale group flex-shrink-0 w-[168px] rounded-3xl bg-white shadow-card overflow-hidden snap-start"
    >
      <CourseVisual
        icon={course.icon}
        gradient={course.gradient}
        className="h-32 w-full"
        iconClassName="w-8 h-8"
      />
      <div className="p-3.5">
        <h3 className="text-sm font-semibold text-ink leading-snug line-clamp-2">
          {course.title}
        </h3>
        <p className="mt-2 text-sm font-semibold text-beige-dark">
          {course.price.toLocaleString("ru-RU")} {course.currency}
        </p>
      </div>
    </Link>
  );
}
