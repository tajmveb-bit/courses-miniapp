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

/**
 * Позиции 27 точек звезды в процентах (left, top).
 * Форма повторяет оригинальную раскладку сайта, но 5 вершин большой пентаграммы выровнены
 * в точный правильный пятиугольник (равные радиусы и углы от центра) — в исходных координатах
 * они были немного неровными, из-за чего звезда визуально смотрелась "кривой". Остальные точки
 * пересчитаны той же трансформацией (поворот/масштаб/сдвиг), чтобы сохранить их положение
 * относительно звезды.
 */
export const STAR_POINT_POSITIONS: Record<number, { left: number; top: number; size: "lg" | "md" | "sm" }> = {
  1: { left: 50, top: 15, size: "lg" },
  2: { left: 83.3, top: 39.2, size: "lg" },
  3: { left: 70.6, top: 78.3, size: "lg" },
  4: { left: 29.4, top: 78.3, size: "lg" },
  5: { left: 16.7, top: 39.2, size: "lg" },
  6: { left: 49.7, top: 51.2, size: "md" },
  7: { left: 31.8, top: 39.8, size: "md" },
  8: { left: 40.7, top: 39.8, size: "md" },
  9: { left: 49.6, top: 39.7, size: "md" },
  10: { left: 58.6, top: 39.6, size: "md" },
  11: { left: 68, top: 39.5, size: "md" },
  12: { left: 44.4, top: 50.9, size: "sm" },
  13: { left: 51.1, top: 45.7, size: "sm" },
  14: { left: 57.8, top: 50.8, size: "sm" },
  15: { left: 46.8, top: 58, size: "sm" },
  16: { left: 55.3, top: 58.2, size: "sm" },
  17: { left: 42.1, top: 31.8, size: "sm" },
  18: { left: 58.8, top: 31.6, size: "sm" },
  19: { left: 34.1, top: 58.5, size: "sm" },
  20: { left: 68, top: 58.1, size: "sm" },
  21: { left: 50.9, top: 70.1, size: "sm" },
  22: { left: 29.8, top: 53.7, size: "sm" },
  23: { left: 33, top: 65.6, size: "sm" },
  24: { left: 44.3, top: 74.2, size: "sm" },
  25: { left: 58.1, top: 74.1, size: "sm" },
  26: { left: 69, top: 65.3, size: "sm" },
  27: { left: 74.3, top: 53.7, size: "sm" },
};

/** Порядок вершин большой пентаграммы (1→3→5→2→4→1) — образует классическую 5-конечную звезду. */
export const PENTAGRAM_ORDER = [1, 3, 5, 2, 4, 1];
