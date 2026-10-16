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
  openTelegramLink?: (url: string) => void;
  openLink?: (url: string, options?: { try_instant_view?: boolean }) => void;
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

// Opens a t.me link via Telegram's own in-app handler when running inside the Mini App
// (so it switches to the bot chat instead of bouncing out to a browser), falling back to a
// plain new tab outside Telegram.
export function openTelegramBot(startParam?: string): void {
  const url = `https://t.me/Saifer_taro_bot${startParam ? `?start=${startParam}` : ""}`;
  const webApp = getTelegramWebApp();
  if (webApp?.openTelegramLink) {
    webApp.openTelegramLink(url);
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

// Routes a client to the sales bot for a specific product. A plain ?start= deep link only
// delivers its payload the FIRST time a person ever opens the bot — Telegram silently drops it
// for anyone who already has a chat with it (returning buyers), just switching to the existing
// chat with nothing sent. So this tries a direct server-side message first (works for anyone
// who has messaged the bot before, i.e. every repeat buyer) and only falls back to the deep link
// when that's not possible — no tgUserId available, or the send fails (genuinely first contact).
export async function requestBotAccess(productId: string): Promise<void> {
  const tgUserId = getTelegramWebApp()?.initDataUnsafe?.user?.id;
  if (tgUserId) {
    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tgUserId, productId }),
      });
      const data = await res.json();
      if (data?.ok) {
        openTelegramBot();
        return;
      }
    } catch {
      // fall through to the deep link below
    }
  }
  openTelegramBot(productId);
}

// Opens a regular (non-t.me) URL — e.g. a PDF on our own domain — via Telegram's own
// external-link handler so it doesn't try to load it inside the Mini App's own WebView.
// Accepts a relative path too (resolved against the current origin — openLink needs an
// absolute URL).
export function openExternalLink(url: string): void {
  const absolute = typeof window !== "undefined" ? new URL(url, window.location.href).toString() : url;
  const webApp = getTelegramWebApp();
  if (webApp?.openLink) {
    webApp.openLink(absolute);
  } else {
    window.open(absolute, "_blank", "noopener,noreferrer");
  }
}
