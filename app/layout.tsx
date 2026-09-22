import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import TelegramInit from "@/components/TelegramInit";
import BottomNavigation from "@/components/BottomNavigation";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Точка Силы — Матрица судьбы",
  description: "Нумерология и Матрица судьбы: предназначения, прогнозы и совместимость по методике",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F7F3ED",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={manrope.variable} suppressHydrationWarning>
      <body className="font-sans bg-cream text-ink antialiased min-h-screen" suppressHydrationWarning>
        <TelegramInit />
        <div className="mx-auto max-w-md min-h-screen relative pb-[calc(88px+env(safe-area-inset-bottom))]">
          {children}
        </div>
        <BottomNavigation />
      </body>
    </html>
  );
}
