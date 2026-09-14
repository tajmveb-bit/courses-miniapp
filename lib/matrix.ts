export interface MatrixResult {
  day: number;
  month: number;
  year: number;
  /** Все 27 точек звезды: номер точки -> значение (1-22) */
  points: Record<number, number>;
  /** 5 предназначений — по одному на каждую сферу жизни */
  destinies: {
    personal: number; // точка 5 — день
    spiritual: number; // точка 1 — месяц
    money: number; // точка 2 — год
    relationships: number; // точка 3
    health: number; // точка 4
  };
  /** Роковая ошибка */
  fatalMistake: number; // точка 21
  /** 7 чакр */
  chakras: number[]; // точки 5,7,8,9,10,11,2
  /** Код души */
  soulCode: number[];
  /** Главная энергия дня, показывается по умолчанию */
  mainEnergy: number;
}

export function reduceTo22(input: number): number {
  let num = input;
  while (num > 22) {
    num = String(num)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return num;
}

export function parseBirthDate(value: string): { day: number; month: number; year: string } | null {
  const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = match[3];
  if (day < 1 || day > 31 || month < 1 || month > 12) return null;
  return { day, month, year };
}

export function calculateMatrix(dateStr: string): MatrixResult | null {
  const parsed = parseBirthDate(dateStr);
  if (!parsed) return null;
  const { day, month, year: yearStr } = parsed;

  const yearSum = yearStr.split("").reduce((sum, digit) => sum + Number(digit), 0);

  const p1 = month;
  const p2 = reduceTo22(yearSum);
  const p5 = reduceTo22(day);
  const p3 = reduceTo22(p1 + p2 + p5);
  const p4 = reduceTo22(p1 + p2 + p3 + p5);
  const p6 = reduceTo22(p1 + p2 + p3 + p4 + p5);

  const p8 = reduceTo22(p1 + p5);
  const p10 = reduceTo22(p1 + p2);
  const p20 = reduceTo22(p3 + p2);
  const p21 = reduceTo22(p3 + p4);
  const p19 = reduceTo22(p5 + p4);

  const p7 = reduceTo22(p8 + p5);
  const p22 = reduceTo22(p19 + p5);
  const p12 = reduceTo22(p19 + p8);
  const p17 = reduceTo22(p8 + p1);
  const p18 = reduceTo22(p10 + p1);
  const p9 = reduceTo22(p8 + p10);
  const p13 = p9;
  const p11 = reduceTo22(p2 + p10);
  const p27 = reduceTo22(p2 + p20);
  const p14 = reduceTo22(p20 + p10);
  const p26 = reduceTo22(p3 + p20);
  const p25 = reduceTo22(p3 + p21);
  const p16 = reduceTo22(p21 + p20);
  const p24 = reduceTo22(p4 + p21);
  const p23 = reduceTo22(p19 + p4);
  const p15 = reduceTo22(p19 + p21);

  const soul1 = reduceTo22(p5 + p2 + p1 + p3 + p4);
  const soul2 = reduceTo22(p8 + p10 + p20 + p19 + p21);
  const soul3 = reduceTo22(soul1 + soul2);

  const points: Record<number, number> = {
    1: p1, 2: p2, 3: p3, 4: p4, 5: p5, 6: p6, 7: p7, 8: p8, 9: p9, 10: p10,
    11: p11, 12: p12, 13: p13, 14: p14, 15: p15, 16: p16, 17: p17, 18: p18,
    19: p19, 20: p20, 21: p21, 22: p22, 23: p23, 24: p24, 25: p25, 26: p26, 27: p27,
  };

  return {
    day,
    month,
    year: p2,
    points,
    destinies: {
      personal: p5,
      spiritual: p1,
      money: p2,
      relationships: p3,
      health: p4,
    },
    fatalMistake: p21,
    chakras: [p5, p7, p8, p9, p10, p11, p2],
    soulCode: [soul1, soul2, soul3],
    mainEnergy: p5,
  };
}

/** Позиции 27 точек звезды в процентах (left, top) — соответствуют оригинальной раскладке. */
export const STAR_POINT_POSITIONS: Record<number, { left: number; top: number; size: "lg" | "md" | "sm" }> = {
  1: { left: 46.8, top: 12, size: "lg" },
  2: { left: 82, top: 39, size: "lg" },
  3: { left: 66, top: 76, size: "lg" },
  4: { left: 26, top: 76.1, size: "lg" },
  5: { left: 13, top: 39, size: "lg" },
  6: { left: 46.4, top: 49.6, size: "md" },
  7: { left: 28.5, top: 38, size: "md" },
  8: { left: 37.5, top: 38, size: "md" },
  9: { left: 46.5, top: 38, size: "md" },
  10: { left: 55.5, top: 38, size: "md" },
  11: { left: 65, top: 38, size: "md" },
  12: { left: 41.1, top: 49.3, size: "sm" },
  13: { left: 47.9, top: 44.1, size: "sm" },
  14: { left: 54.6, top: 49.3, size: "sm" },
  15: { left: 43.5, top: 56.5, size: "sm" },
  16: { left: 52, top: 56.7, size: "sm" },
  17: { left: 39, top: 30, size: "sm" },
  18: { left: 55.8, top: 30, size: "sm" },
  19: { left: 30.6, top: 56.8, size: "sm" },
  20: { left: 64.8, top: 56.8, size: "sm" },
  21: { left: 47.5, top: 68.7, size: "sm" },
  22: { left: 26.4, top: 52, size: "sm" },
  23: { left: 29.5, top: 64, size: "sm" },
  24: { left: 40.8, top: 72.8, size: "sm" },
  25: { left: 54.7, top: 72.8, size: "sm" },
  26: { left: 65.8, top: 64, size: "sm" },
  27: { left: 71.2, top: 52.4, size: "sm" },
};

/** Порядок вершин большой пентаграммы (1→3→5→2→4→1) — образует классическую 5-конечную звезду. */
export const PENTAGRAM_ORDER = [1, 3, 5, 2, 4, 1];
