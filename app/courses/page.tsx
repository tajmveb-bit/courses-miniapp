"use client";

import { useMemo, useState } from "react";
import { courses } from "@/data/courses";
import CategoryTabs, { type CategoryFilter } from "@/components/CategoryTabs";
import CourseListItem from "@/components/CourseListItem";

export default function CoursesPage() {
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filteredCourses = useMemo(() => {
    if (category === "all") return courses;
    if (category === "popular") return courses.filter((course) => course.popular);
    return courses.filter((course) => course.category === category);
  }, [category]);

  return (
    <main className="pt-safe-t pb-8">
      <div className="px-5 pt-6 animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Курсы</h1>
      </div>

      <div className="mt-5 animate-fade-up [animation-delay:60ms] opacity-0">
        <CategoryTabs active={category} onChange={setCategory} />
      </div>

      <div className="mt-5 flex flex-col gap-3 px-5 animate-fade-up [animation-delay:120ms] opacity-0">
        {filteredCourses.map((course) => (
          <CourseListItem key={course.id} course={course} />
        ))}

        {filteredCourses.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-soft">
            В этой категории пока нет курсов
          </p>
        )}
      </div>
    </main>
  );
}
