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
