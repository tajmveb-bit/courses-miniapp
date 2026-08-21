"use client";

import { courses } from "@/data/courses";
import { useFavorites } from "@/lib/favorites";
import CourseCard from "@/components/CourseCard";

export default function FavoritesSection() {
  const { favorites, ready } = useFavorites();

  if (!ready || favorites.length === 0) return null;

  const favoriteCourses = courses.filter((course) => favorites.includes(course.id));
  if (favoriteCourses.length === 0) return null;

  return (
    <section className="mt-8 animate-fade-up [animation-delay:120ms] opacity-0">
      <div className="px-5 flex items-center gap-2">
        <h2 className="text-xl font-semibold text-ink">Избранное</h2>
      </div>

      <div className="mt-4 flex gap-4 overflow-x-auto no-scrollbar px-5 pb-2 snap-x snap-mandatory">
        {favoriteCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
