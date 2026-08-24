const SALON_WHATSAPP_NUMBER = "77073230860";

export function openWhatsApp(message: string): void {
  const url = `https://wa.me/${SALON_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
