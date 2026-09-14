import { reduceTo22 } from "@/lib/matrix";

export interface ForecastResult {
  personalYearArcana: number;
  personalMonthArcana: number;
  personalDayArcana: number;
  targetYear: number;
  targetMonth: number;
  targetDay: number;
}

export function calculateForecast(
  day: number,
  month: number,
  targetYear: number,
  targetMonth: number,
  targetDay: number
): ForecastResult {
  const dayArcana = reduceTo22(day);
  const yearSum = String(targetYear)
    .split("")
    .reduce((sum, d) => sum + Number(d), 0);

  const personalYearArcana = reduceTo22(reduceTo22(dayArcana + month) + reduceTo22(yearSum));
  const personalMonthArcana = reduceTo22(personalYearArcana + targetMonth);
  const personalDayArcana = reduceTo22(personalMonthArcana + targetDay);

  return { personalYearArcana, personalMonthArcana, personalDayArcana, targetYear, targetMonth, targetDay };
}

/** Код энергии = (ДДММ) × ГГГГ, возвращает массив цифр результата. */
export function calculateEnergyCode(day: number, month: number, birthYear: number): number[] {
  const ddmm = Number(`${day}${String(month).padStart(2, "0")}`);
  const code = ddmm * birthYear;
  return String(code).split("").map(Number);
}

export const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
