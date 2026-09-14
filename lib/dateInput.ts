export function formatDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join(".");
}

const BIRTHDATE_KEY = "matrix:birthdate";

export function getSavedBirthDate(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(BIRTHDATE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveBirthDate(value: string): void {
  try {
    window.localStorage.setItem(BIRTHDATE_KEY, value);
  } catch {
    // ignore
  }
}
