import { Droplet, Shield, Sparkles, Sun } from "lucide-react";
import type { CourseIcon } from "@/data/courses";

const ICONS: Record<CourseIcon, typeof Droplet> = {
  droplet: Droplet,
  sparkles: Sparkles,
  shield: Shield,
  sun: Sun,
};

interface CourseVisualProps {
  icon: CourseIcon;
  gradient: [string, string];
  className?: string;
  iconClassName?: string;
}

export default function CourseVisual({
  icon,
  gradient,
  className = "",
  iconClassName = "w-10 h-10",
}: CourseVisualProps) {
  const Icon = ICONS[icon];

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(140deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
      }}
    >
      <div
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/25 blur-2xl"
        aria-hidden
      />
      <div
        className="absolute -left-8 -bottom-8 w-28 h-28 rounded-full bg-white/15 blur-2xl"
        aria-hidden
      />
      <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white/35 backdrop-blur-sm">
        <Icon className={`${iconClassName} text-white drop-shadow-sm`} strokeWidth={1.6} />
      </div>
    </div>
  );
}
