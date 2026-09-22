import { redis } from "@/lib/redis";

export const SECTIONS = [
  "matrix",
  "forecast",
  "karmic-knots",
  "spiritual-sphere",
  "relationships",
  "compatibility",
  "code-money",
  "code-luck",
  "code-relationships",
  "code-health",
  "code-spiritual",
] as const;

export type Section = (typeof SECTIONS)[number];

export const SECTION_LABELS: Record<Section, string> = {
  matrix: "Матрица судьбы",
  forecast: "Прогноз",
  "karmic-knots": "Кармические узлы",
  "spiritual-sphere": "Сфера духовности",
  relationships: "Сфера отношений",
  compatibility: "Совместимость",
  "code-money": "Денежный код",
  "code-luck": "Код удачи",
  "code-relationships": "Код отношений",
  "code-health": "Код здоровья",
  "code-spiritual": "Код духовного пути",
};

export function isSection(value: string): value is Section {
  return (SECTIONS as readonly string[]).includes(value);
}

// Avoid 0/O/1/I/L — easy to confuse when a client retypes the code by hand.
const CODE_CHARS = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function randomCode(length = 8): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return out;
}

export interface IssuedCode {
  section: Section;
  label: string;
  code: string;
}

// One batch = one client's purchase: a fresh, single-use code for every gated section, all
// tied to nothing but their own redemption — nobody else's code unlocks the same section twice.
export async function generateCodeBatch(): Promise<IssuedCode[]> {
  const results: IssuedCode[] = [];
  for (const section of SECTIONS) {
    let code = randomCode();
    while (await redis.get(`code:${code}`)) {
      code = randomCode();
    }
    await redis.set(`code:${code}`, section);
    results.push({ section, label: SECTION_LABELS[section], code });
  }
  return results;
}

export async function redeemCode(rawCode: string, section: Section): Promise<boolean> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return false;
  const storedSection = await redis.get(`code:${code}`);
  if (storedSection !== section) return false;
  const result = await redis.setNx(`used:${code}`, "1");
  return result === "OK";
}
