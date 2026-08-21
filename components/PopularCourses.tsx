"use client";

import Link from "next/link";
import { getPopularCourses } from "@/data/courses";
import CourseCard from "@/components/CourseCard";

export default function PopularCourses() {
  const popular = getPopularCourses();

  return (
    <section className="mt-8 animate-fade-up [animation-delay:80ms] opacity-0">
      <div className="px-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-ink">Популярные курсы</h2>
        <Link
          href="/courses"
          className="tap-scale text-sm font-medium text-beige-dark"
        >
          Смотреть все
        </Link>
      </div>

      <div className="mt-4 flex gap-4 overflow-x-auto no-scrollbar px-5 pb-2 snap-x snap-mandatory">
        {popular.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
