export interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramHapticFeedback {
  impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
  notificationOccurred: (type: "error" | "success" | "warning") => void;
  selectionChanged: () => void;
}

export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  disableVerticalSwipes?: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  enableClosingConfirmation?: () => void;
  colorScheme?: "light" | "dark";
  viewportHeight?: number;
  viewportStableHeight?: number;
  initData?: string;
  initDataUnsafe?: {
    user?: TelegramWebAppUser;
  };
  HapticFeedback?: TelegramHapticFeedback;
  BackButton?: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

export function initTelegramApp(): void {
  const webApp = getTelegramWebApp();
  if (!webApp) return;

  try {
    webApp.ready();
    webApp.expand();
    webApp.setHeaderColor?.("#F7F3ED");
    webApp.setBackgroundColor?.("#F7F3ED");
    webApp.disableVerticalSwipes?.();
  } catch {
    // Telegram bridge unavailable (e.g. running in a regular browser) — safe to ignore.
  }
}

export function hapticSelection(): void {
  getTelegramWebApp()?.HapticFeedback?.selectionChanged();
}

export function hapticImpact(style: "light" | "medium" | "heavy" | "rigid" | "soft" = "light"): void {
  getTelegramWebApp()?.HapticFeedback?.impactOccurred(style);
}

export function hapticNotification(type: "error" | "success" | "warning" = "success"): void {
  getTelegramWebApp()?.HapticFeedback?.notificationOccurred(type);
}
