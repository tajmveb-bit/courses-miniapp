import HeroSection from "@/components/HeroSection";
import WeekMaterials from "@/components/WeekMaterials";
import SavedMaterials from "@/components/SavedMaterials";

export default function HomePage() {
  return (
    <main className="pt-safe-t pb-8">
      <HeroSection />
      <WeekMaterials />
      <SavedMaterials />
    </main>
  );
}
