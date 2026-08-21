"use client";

import { useEffect } from "react";
import Script from "next/script";
import { initTelegramApp } from "@/lib/telegram";

export default function TelegramInit() {
  useEffect(() => {
    initTelegramApp();
  }, []);

  return (
    <Script
      src="https://telegram.org/js/telegram-web-app.js"
      strategy="beforeInteractive"
      onLoad={initTelegramApp}
    />
  );
}
