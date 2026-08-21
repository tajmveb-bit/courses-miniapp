import HeroSection from "@/components/HeroSection";
import PopularCourses from "@/components/PopularCourses";
import FavoritesSection from "@/components/FavoritesSection";

export default function HomePage() {
  return (
    <main className="pt-safe-t pb-8">
      <HeroSection />
      <PopularCourses />
      <FavoritesSection />
    </main>
  );
}
