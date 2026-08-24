import { BookOpen, ClipboardList, ListChecks, MessageCircle } from "lucide-react";
import type { MaterialType } from "@/data/club";

const ICONS: Record<MaterialType, typeof BookOpen> = {
  lesson: BookOpen,
  task: ListChecks,
  checklist: ClipboardList,
  review: MessageCircle,
};

const GRADIENTS: Record<MaterialType, [string, string]> = {
  lesson: ["#EFE7DC", "#C9A77E"],
  task: ["#F7F3ED", "#B08F63"],
  checklist: ["#EFE7DC", "#8C7355"],
  review: ["#F7F3ED", "#C9A77E"],
};

interface MaterialVisualProps {
  type: MaterialType;
  className?: string;
  iconClassName?: string;
}

export default function MaterialVisual({
  type,
  className = "",
  iconClassName = "w-10 h-10",
}: MaterialVisualProps) {
  const Icon = ICONS[type];
  const gradient = GRADIENTS[type];

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(140deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
      }}
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/25 blur-2xl" aria-hidden />
      <div className="absolute -left-8 -bottom-8 w-28 h-28 rounded-full bg-white/15 blur-2xl" aria-hidden />
      <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white/35 backdrop-blur-sm">
        <Icon className={`${iconClassName} text-white drop-shadow-sm`} strokeWidth={1.6} />
      </div>
    </div>
  );
}
