"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, MessageCircleQuestion, Grid2x2 } from "lucide-react";
import { hapticSelection } from "@/lib/telegram";

const NAV_ITEMS = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/materials", label: "Материалы", icon: BookOpen },
  { href: "/ask", label: "Вопрос", icon: MessageCircleQuestion },
  { href: "/more", label: "Ещё", icon: Grid2x2 },
] as const;

const HIDDEN_ON = [/^\/materials\/[^/]+/];

export default function BottomNavigation() {
  const pathname = usePathname();

  if (HIDDEN_ON.some((pattern) => pattern.test(pathname ?? ""))) return null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-2">
      <div className="mx-auto max-w-md rounded-4xl bg-white/90 backdrop-blur-xl shadow-lifted border border-black/[0.03] px-2 py-2 flex items-center justify-around">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => hapticSelection()}
              className="relative flex flex-col items-center justify-center gap-1 rounded-3xl px-5 py-2 tap-scale"
            >
              {active && <span className="absolute inset-0 rounded-3xl bg-beige-light animate-scale-in" />}
              <Icon
                className={`relative w-5 h-5 transition-colors ${active ? "text-beige-dark" : "text-ink-soft"}`}
                strokeWidth={active ? 2.1 : 1.8}
              />
              <span
                className={`relative text-[11px] font-medium transition-colors ${
                  active ? "text-beige-dark" : "text-ink-soft"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
