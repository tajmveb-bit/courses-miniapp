import type { MatrixResult } from "@/lib/matrix";
import type { Section } from "@/lib/unlockCodes";

export interface CodeConfig {
  type: string;
  section: Section;
  title: string;
  intro: string;
  getValue: (result: MatrixResult) => number;
}

// Каждый «код» — это уже посчитанное и проверенное значение из Матрицы (предназначение или
// точка звезды), просто вынесенное в отдельную платную карточку со своей расшифровкой
// аркана — никаких новых формул, только другая подача уже готового расчёта.
export const CODES: CodeConfig[] = [
  {
    type: "money",
    section: "code-money",
    title: "Денежный код",
    intro: "Аркан денежного предназначения — показывает вашу программу в сфере денег и финансов.",
    getValue: (result) => result.destinies.money,
  },
  {
    type: "luck",
    section: "code-luck",
    title: "Код удачи",
    intro: "Аркан в самом центре вашей Звезды — ядро вашей личной энергии и внутренней удачи.",
    getValue: (result) => result.points[6],
  },
  {
    type: "relationships",
    section: "code-relationships",
    title: "Код отношений",
    intro: "Аркан предназначения в отношениях — показывает вашу программу в паре и в близких связях.",
    getValue: (result) => result.destinies.relationships,
  },
  {
    type: "health",
    section: "code-health",
    title: "Код здоровья",
    intro: "Аркан предназначения в здоровье — показывает вашу программу в теле и энергии. Зона внимания, а не диагноз — не заменяет консультацию врача.",
    getValue: (result) => result.destinies.health,
  },
  {
    type: "spiritual",
    section: "code-spiritual",
    title: "Код духовного пути",
    intro: "Аркан духовного предназначения — показывает вашу программу развития и внутреннего роста.",
    getValue: (result) => result.destinies.spiritual,
  },
];

export function getCodeConfig(type: string): CodeConfig | undefined {
  return CODES.find((c) => c.type === type);
}
