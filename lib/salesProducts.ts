import { Section } from "@/lib/unlockCodes";

export type ProductKind = "section" | "consult" | "qa5";

export interface Product {
  id: string;
  label: string;
  price: number;
  kind: ProductKind;
  section?: Section;
  // Where "Открыть раздел" should land in the app — not every product maps to a page.
  appPath?: string;
}

// Prices mirror what's already charged inside the app itself — the sales bot doesn't
// invent its own pricing, it just sells the same things through a different door.
export const PRODUCTS: Product[] = [
  { id: "matrix", label: "Матрица судьбы", price: 5000, kind: "section", section: "matrix", appPath: "/matrix" },
  { id: "karmic-knots", label: "Кармические узлы", price: 5000, kind: "section", section: "karmic-knots", appPath: "/matrix/karmic-knots" },
  { id: "spiritual-sphere", label: "Сфера духовности", price: 5000, kind: "section", section: "spiritual-sphere", appPath: "/matrix/spiritual-sphere" },
  { id: "relationships", label: "Сфера отношений", price: 5000, kind: "section", section: "relationships", appPath: "/matrix/relationships" },
  { id: "compatibility", label: "Совместимость", price: 5000, kind: "section", section: "compatibility", appPath: "/matrix/compatibility" },
  { id: "code-money", label: "Денежный код", price: 5000, kind: "section", section: "code-money", appPath: "/codes/money" },
  { id: "code-luck", label: "Код удачи", price: 5000, kind: "section", section: "code-luck", appPath: "/codes/luck" },
  { id: "code-relationships", label: "Код отношений", price: 5000, kind: "section", section: "code-relationships", appPath: "/codes/relationships" },
  { id: "code-health", label: "Код здоровья", price: 5000, kind: "section", section: "code-health", appPath: "/codes/health" },
  { id: "code-spiritual", label: "Код духовного пути", price: 5000, kind: "section", section: "code-spiritual", appPath: "/codes/spiritual" },
  { id: "forecast", label: "Полный прогноз", price: 15000, kind: "section", section: "forecast", appPath: "/matrix/forecast" },
  { id: "qa5", label: "5 вопросов по раскладам", price: 3000, kind: "qa5" },
  { id: "consult", label: "Консультация с Анастасией (60 мин)", price: 50000, kind: "consult" },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export const SECTION_PRODUCTS = PRODUCTS.filter((p) => p.kind === "section" && p.id !== "forecast");
