export interface MatrixResult {
  day: number;
  month: number;
  year: number;
  /** 5 предназначений — по одному на каждую сферу жизни */
  destinies: {
    personal: number; // starPoint5 — день
    spiritual: number; // starPoint1 — месяц
    money: number; // starPoint2 — год
    relationships: number; // starPoint3
    health: number; // starPoint4
  };
  /** Роковая ошибка */
  fatalMistake: number; // starPoint21
  /** 7 чакр */
  chakras: number[]; // starPoint5,7,8,9,10,11,2
  /** Код души */
  soulCode: number[]; // starPointNew1,2,3
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

  const starPoint1 = month;
  const starPoint2 = reduceTo22(yearSum);
  const starPoint5 = reduceTo22(day);
  const starPoint3 = reduceTo22(starPoint1 + starPoint2 + starPoint5);
  const starPoint4 = reduceTo22(starPoint1 + starPoint2 + starPoint3 + starPoint5);

  const starPoint8 = reduceTo22(starPoint1 + starPoint5);
  const starPoint10 = reduceTo22(starPoint1 + starPoint2);
  const starPoint20 = reduceTo22(starPoint3 + starPoint2);
  const starPoint21 = reduceTo22(starPoint3 + starPoint4);
  const starPoint19 = reduceTo22(starPoint5 + starPoint4);

  const starPoint7 = reduceTo22(starPoint8 + starPoint5);
  const starPoint9 = reduceTo22(starPoint8 + starPoint10);
  const starPoint11 = reduceTo22(starPoint2 + starPoint10);

  return {
    day,
    month,
    year: starPoint2,
    destinies: {
      personal: starPoint5,
      spiritual: starPoint1,
      money: starPoint2,
      relationships: starPoint3,
      health: starPoint4,
    },
    fatalMistake: starPoint21,
    chakras: [starPoint5, starPoint7, starPoint8, starPoint9, starPoint10, starPoint11, starPoint2],
    soulCode: [
      reduceTo22(starPoint5 + starPoint2 + starPoint1 + starPoint3 + starPoint4),
      reduceTo22(starPoint8 + starPoint10 + starPoint20 + starPoint19 + starPoint21),
      reduceTo22(
        reduceTo22(starPoint5 + starPoint2 + starPoint1 + starPoint3 + starPoint4) +
          reduceTo22(starPoint8 + starPoint10 + starPoint20 + starPoint19 + starPoint21)
      ),
    ],
    mainEnergy: starPoint5,
  };
}
