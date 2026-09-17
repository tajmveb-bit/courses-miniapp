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
  title: "Код Красоты — клуб ухода 35+",
  description: "Спокойная система ухода за кожей и волосами для женщин 35+ с поддержкой специалиста",
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
