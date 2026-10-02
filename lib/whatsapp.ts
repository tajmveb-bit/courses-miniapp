const SALON_WHATSAPP_NUMBER = "77014803061";

export function openWhatsApp(message: string): void {
  const url = `https://wa.me/${SALON_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
