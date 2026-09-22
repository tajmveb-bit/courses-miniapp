import Link from "next/link";
import { Sparkles, User, ShieldCheck, Coins, Clover, Heart, HeartPulse, Moon } from "lucide-react";
import { CODES } from "@/data/matrixCodes";

const ITEMS = [
  { href: "/matrix", label: "Матрица судьбы", icon: Sparkles },
  { href: "/about", label: "Об эксперте", icon: User },
  { href: "/rules", label: "Правила клуба", icon: ShieldCheck },
] as const;

const CODE_ICONS = {
  money: Coins,
  luck: Clover,
  relationships: Heart,
  health: HeartPulse,
  spiritual: Moon,
} as const;

export default function MorePage() {
  return (
    <main className="pt-safe-t pb-8">
      <div className="px-5 pt-6 animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Ещё</h1>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 px-5 animate-fade-up [animation-delay:60ms] opacity-0">
        {ITEMS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="tap-scale flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-card">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-beige-light">
              <Icon className="w-5 h-5 text-beige-dark" strokeWidth={1.8} />
            </div>
            <p className="text-sm font-semibold text-ink leading-snug">{label}</p>
          </Link>
        ))}
      </div>

      <div className="px-5 mt-8 animate-fade-up [animation-delay:100ms] opacity-0">
        <h2 className="text-lg font-semibold text-ink mb-1">Коды по дате рождения</h2>
        <p className="text-xs text-ink-soft mb-3">Отдельные разборы — 5 000 ₸ каждый</p>
        <div className="grid grid-cols-2 gap-3">
          {CODES.map(({ type, title }) => {
            const Icon = CODE_ICONS[type as keyof typeof CODE_ICONS];
            return (
              <Link
                key={type}
                href={`/codes/${type}`}
                className="tap-scale flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-card"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-beige-light">
                  <Icon className="w-5 h-5 text-beige-dark" strokeWidth={1.8} />
                </div>
                <p className="text-sm font-semibold text-ink leading-snug">{title}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
