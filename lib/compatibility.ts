import { reduceTo22 } from "@/lib/matrix";

export interface PersonDate {
  day: number;
  month: number;
  year: string;
}

function yearSum(year: string): number {
  return year.split("").reduce((s, d) => s + Number(d), 0);
}

/** 1-е предназначение (аркан дня) двух партнёров. */
export function meetingArcana(a: PersonDate, b: PersonDate): number {
  return reduceTo22(reduceTo22(a.day) + reduceTo22(b.day));
}

/** 2-е предназначение (месяц) двух партнёров. */
export function conflictArcana(a: PersonDate, b: PersonDate): number {
  return reduceTo22(a.month + b.month);
}

/** 3-е предназначение (год) двух партнёров. */
export function businessArcana(a: PersonDate, b: PersonDate): number {
  const yA = reduceTo22(yearSum(a.year));
  const yB = reduceTo22(yearSum(b.year));
  return reduceTo22(yA + yB);
}

function repeatedDigitSum(n: number): number {
  let num = n;
  while (num > 9) {
    num = String(num)
      .split("")
      .reduce((s, d) => s + Number(d), 0);
  }
  return num;
}

/** Число жизненного пути — полная сумма цифр даты рождения до однозначного числа. */
export function lifePathNumber(p: PersonDate): number {
  const digits = `${p.day}${p.month}${p.year}`.split("").map(Number);
  return repeatedDigitSum(digits.reduce((s, d) => s + d, 0));
}

export type RelationshipType = "судьба" | "карма" | "кармические близнецы";

export interface CompatibilityResult {
  lifePathA: number;
  lifePathB: number;
  compatibilityNumber: number;
  type: RelationshipType;
}

export function calculateCompatibilityNumber(a: PersonDate, b: PersonDate): CompatibilityResult {
  const lifePathA = lifePathNumber(a);
  const lifePathB = lifePathNumber(b);
  const compatibilityNumber = repeatedDigitSum(lifePathA + lifePathB);

  let type: RelationshipType = "карма";
  if (lifePathA === lifePathB) {
    type = "кармические близнецы";
  } else if ([1, 2, 9].includes(compatibilityNumber)) {
    type = "судьба";
  }

  return { lifePathA, lifePathB, compatibilityNumber, type };
}
