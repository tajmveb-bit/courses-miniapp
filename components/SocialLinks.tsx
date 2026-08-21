"use client";

import { Instagram, Send, Youtube } from "lucide-react";
import { hapticSelection } from "@/lib/telegram";

// Placeholder links — replace with the expert's real profiles later.
export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/",
  telegram: "https://t.me/",
  youtube: "https://youtube.com/",
  vk: "https://vk.com/",
};

function VkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M13.5 17.2c-5.3 0-8.4-3.7-8.5-9.8h2.7c.1 4.4 2 6.3 3.5 6.7V7.4h2.5v3.9c1.5-.2 3-1.9 3.5-3.9h2.5c-.4 2.5-2.2 4.2-3.5 4.9 1.3.6 3.3 2.1 4.1 4.9h-2.8c-.6-1.9-2-3.4-4-3.6v3.6h-.3z"
        fill="currentColor"
      />
    </svg>
  );
}

const SOCIALS = [
  { key: "instagram", label: "Instagram", href: SOCIAL_LINKS.instagram, Icon: Instagram },
  { key: "telegram", label: "Telegram", href: SOCIAL_LINKS.telegram, Icon: Send },
  { key: "youtube", label: "YouTube", href: SOCIAL_LINKS.youtube, Icon: Youtube },
  { key: "vk", label: "VK", href: SOCIAL_LINKS.vk, Icon: VkIcon },
] as const;

export default function SocialLinks() {
  return (
    <div className="flex items-center gap-3">
      {SOCIALS.map(({ key, label, href, Icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => hapticSelection()}
          aria-label={label}
          className="tap-scale flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-card"
        >
          <Icon className="w-5 h-5 text-ink" strokeWidth={1.8} />
        </a>
      ))}
    </div>
  );
}
