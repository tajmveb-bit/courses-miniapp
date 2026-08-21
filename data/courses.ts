export type CourseCategory = "beginner" | "advanced";

export type CourseIcon = "droplet" | "sparkles" | "shield" | "sun";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface CourseCharacteristic {
  icon: "book" | "layers" | "infinity" | "award";
  title: string;
  description: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  currency: string;
  category: CourseCategory;
  popular: boolean;
  icon: CourseIcon;
  gradient: [string, string];
  lessonsCount: number;
  level: string;
  characteristics: CourseCharacteristic[];
  modules: Module[];
}

export const courses: Course[] = [
  {
    id: "1",
    slug: "uhod-za-kozhey-s-nulya",
    title: "Уход за кожей с нуля",
    shortDescription: "Базовый курс для тех, кто хочет научиться правильно ухаживать за кожей.",
    fullDescription:
      "Курс создан для тех, кто хочет разобраться в базовых принципах ухода за кожей и построить свой собственный уход без лишних трат и ошибок. Вы узнаете, как определить свой тип кожи, какие средства и в какой последовательности использовать утром и вечером, а также разберётесь в составах и научитесь читать этикетки как профессионал.",
    price: 4990,
    currency: "₽",
    category: "beginner",
    popular: true,
    icon: "droplet",
    gradient: ["#EFE7DC", "#C9A77E"],
    lessonsCount: 12,
    level: "Для начинающих",
    characteristics: [
      { icon: "book", title: "12 уроков", description: "Подробные видеоуроки" },
      { icon: "layers", title: "Для начинающих", description: "Подходит для любого уровня" },
      { icon: "infinity", title: "Доступ навсегда", description: "Учитесь в удобное время" },
      { icon: "award", title: "Сертификат", description: "После прохождения курса" },
    ],
    modules: [
      {
        id: "m1",
        title: "Модуль 1. Основы ухода",
        lessons: [
          { id: "l1", title: "Урок 1. Типы кожи", duration: "12:45" },
          { id: "l2", title: "Урок 2. Очищение кожи", duration: "13:40" },
          { id: "l3", title: "Урок 3. Тонизирование", duration: "10:20" },
          { id: "l4", title: "Урок 4. Увлажнение", duration: "15:40" },
        ],
      },
      {
        id: "m2",
        title: "Модуль 2. Активные компоненты",
        lessons: [
          { id: "l5", title: "Урок 1. Кислоты и пилинги", duration: "14:10" },
          { id: "l6", title: "Урок 2. Ретинол и его аналоги", duration: "16:05" },
          { id: "l7", title: "Урок 3. Витамин С", duration: "11:30" },
        ],
      },
      {
        id: "m3",
        title: "Модуль 3. Уход утром и вечером",
        lessons: [
          { id: "l8", title: "Урок 1. Утренний ритуал", duration: "9:50" },
          { id: "l9", title: "Урок 2. Вечерний ритуал", duration: "12:15" },
        ],
      },
      {
        id: "m4",
        title: "Модуль 4. Ошибки и мифы",
        lessons: [
          { id: "l10", title: "Урок 1. Популярные заблуждения", duration: "13:05" },
          { id: "l11", title: "Урок 2. Разбор реальных кейсов", duration: "17:20" },
        ],
      },
      {
        id: "m5",
        title: "Модуль 5. Подбор ухода под себя",
        lessons: [{ id: "l12", title: "Урок 1. Составляем свою программу", duration: "18:00" }],
      },
    ],
  },
  {
    id: "2",
    slug: "professionalnaya-kosmetika",
    title: "Профессиональная косметика",
    shortDescription: "Разбираем составы, бренды и подбираем уход под тип кожи.",
    fullDescription:
      "В этом курсе мы подробно разбираем профессиональную косметику: составы, действующие вещества, бренды и то, как отличить рабочую формулу от красивого маркетинга. Вы научитесь подбирать уходовые средства под конкретный тип и состояние кожи, а также составлять индивидуальные программы ухода для себя и близких.",
    price: 5990,
    currency: "₽",
    category: "advanced",
    popular: true,
    icon: "sparkles",
    gradient: ["#F7F3ED", "#B08F63"],
    lessonsCount: 14,
    level: "Продвинутый",
    characteristics: [
      { icon: "book", title: "14 уроков", description: "Подробные видеоуроки" },
      { icon: "layers", title: "Продвинутый уровень", description: "Нужна база по уходу" },
      { icon: "infinity", title: "Доступ навсегда", description: "Учитесь в удобное время" },
      { icon: "award", title: "Сертификат", description: "После прохождения курса" },
    ],
    modules: [
      {
        id: "m1",
        title: "Модуль 1. Основы косметологии",
        lessons: [
          { id: "l1", title: "Урок 1. Как читать состав", duration: "14:30" },
          { id: "l2", title: "Урок 2. Действующие вещества", duration: "16:10" },
          { id: "l3", title: "Урок 3. Формы выпуска", duration: "9:45" },
        ],
      },
      {
        id: "m2",
        title: "Модуль 2. Активные компоненты",
        lessons: [
          { id: "l4", title: "Урок 1. Кислоты", duration: "15:20" },
          { id: "l5", title: "Урок 2. Пептиды и коллаген", duration: "13:15" },
          { id: "l6", title: "Урок 3. Антиоксиданты", duration: "12:40" },
        ],
      },
      {
        id: "m3",
        title: "Модуль 3. Бренды и маркетинг",
        lessons: [
          { id: "l7", title: "Урок 1. Масс-маркет vs люкс", duration: "11:05" },
          { id: "l8", title: "Урок 2. Как не переплачивать", duration: "10:30" },
        ],
      },
      {
        id: "m4",
        title: "Модуль 4. Ошибки и мифы",
        lessons: [
          { id: "l9", title: "Урок 1. Мифы о косметике", duration: "13:50" },
          { id: "l10", title: "Урок 2. Разбор реальных кейсов", duration: "17:00" },
        ],
      },
      {
        id: "m5",
        title: "Модуль 5. Подбор ухода под себя",
        lessons: [
          { id: "l11", title: "Урок 1. Индивидуальная программа", duration: "19:10" },
          { id: "l12", title: "Урок 2. Сезонные корректировки", duration: "12:25" },
        ],
      },
    ],
  },
  {
    id: "3",
    slug: "akne-reshenie-i-profilaktika",
    title: "Акне: решение и профилактика",
    shortDescription: "Комплексный подход к борьбе с акне и восстановлению кожи.",
    fullDescription:
      "Курс посвящён комплексному подходу к решению проблемы акне: от понимания причин высыпаний до построения безопасного и эффективного ухода. Вы разберётесь, какие компоненты действительно помогают, как не навредить коже агрессивными средствами и как выстроить уход на этапе восстановления.",
    price: 4490,
    currency: "₽",
    category: "advanced",
    popular: false,
    icon: "shield",
    gradient: ["#EFE7DC", "#8C7355"],
    lessonsCount: 10,
    level: "Продвинутый",
    characteristics: [
      { icon: "book", title: "10 уроков", description: "Подробные видеоуроки" },
      { icon: "layers", title: "Продвинутый уровень", description: "Нужна база по уходу" },
      { icon: "infinity", title: "Доступ навсегда", description: "Учитесь в удобное время" },
      { icon: "award", title: "Сертификат", description: "После прохождения курса" },
    ],
    modules: [
      {
        id: "m1",
        title: "Модуль 1. Причины акне",
        lessons: [
          { id: "l1", title: "Урок 1. Типы высыпаний", duration: "12:00" },
          { id: "l2", title: "Урок 2. Гормональные причины", duration: "14:45" },
          { id: "l3", title: "Урок 3. Внешние факторы", duration: "10:15" },
        ],
      },
      {
        id: "m2",
        title: "Модуль 2. Активные компоненты",
        lessons: [
          { id: "l4", title: "Урок 1. Салициловая кислота", duration: "11:40" },
          { id: "l5", title: "Урок 2. Азелаиновая кислота", duration: "12:55" },
        ],
      },
      {
        id: "m3",
        title: "Модуль 3. Уход утром и вечером",
        lessons: [
          { id: "l6", title: "Урок 1. Мягкое очищение", duration: "9:30" },
          { id: "l7", title: "Урок 2. Восстановление барьера", duration: "13:20" },
        ],
      },
      {
        id: "m4",
        title: "Модуль 4. Ошибки и мифы",
        lessons: [{ id: "l8", title: "Урок 1. Частые ошибки в уходе", duration: "15:05" }],
      },
      {
        id: "m5",
        title: "Модуль 5. Подбор ухода под себя",
        lessons: [
          { id: "l9", title: "Урок 1. Программа восстановления", duration: "16:40" },
          { id: "l10", title: "Урок 2. Профилактика рецидивов", duration: "11:50" },
        ],
      },
    ],
  },
  {
    id: "4",
    slug: "anti-age-uhod-i-omolozhenie",
    title: "Anti-age уход и омоложение",
    shortDescription: "Секреты молодости кожи и эффективные anti-age методики.",
    fullDescription:
      "В этом курсе вы узнаете о самых эффективных anti-age методиках и компонентах, которые действительно работают. Разберём, как замедлить возрастные изменения кожи, какие средства использовать в разном возрасте и как построить долгосрочную стратегию ухода за собой.",
    price: 6490,
    currency: "₽",
    category: "advanced",
    popular: true,
    icon: "sun",
    gradient: ["#F7F3ED", "#C9A77E"],
    lessonsCount: 13,
    level: "Продвинутый",
    characteristics: [
      { icon: "book", title: "13 уроков", description: "Подробные видеоуроки" },
      { icon: "layers", title: "Продвинутый уровень", description: "Нужна база по уходу" },
      { icon: "infinity", title: "Доступ навсегда", description: "Учитесь в удобное время" },
      { icon: "award", title: "Сертификат", description: "После прохождения курса" },
    ],
    modules: [
      {
        id: "m1",
        title: "Модуль 1. Возрастные изменения кожи",
        lessons: [
          { id: "l1", title: "Урок 1. Как стареет кожа", duration: "13:10" },
          { id: "l2", title: "Урок 2. Профилактика с молодости", duration: "12:35" },
          { id: "l3", title: "Урок 3. Диагностика возраста кожи", duration: "10:50" },
        ],
      },
      {
        id: "m2",
        title: "Модуль 2. Активные компоненты",
        lessons: [
          { id: "l4", title: "Урок 1. Ретиноиды", duration: "16:20" },
          { id: "l5", title: "Урок 2. Пептидные комплексы", duration: "14:05" },
          { id: "l6", title: "Урок 3. SPF и профилактика", duration: "11:15" },
        ],
      },
      {
        id: "m3",
        title: "Модуль 3. Уход утром и вечером",
        lessons: [
          { id: "l7", title: "Урок 1. Утренняя anti-age рутина", duration: "10:40" },
          { id: "l8", title: "Урок 2. Вечернее восстановление", duration: "13:55" },
        ],
      },
      {
        id: "m4",
        title: "Модуль 4. Ошибки и мифы",
        lessons: [{ id: "l9", title: "Урок 1. Мифы об омоложении", duration: "12:30" }],
      },
      {
        id: "m5",
        title: "Модуль 5. Подбор ухода под себя",
        lessons: [
          { id: "l10", title: "Урок 1. Программа по возрасту", duration: "17:45" },
          { id: "l11", title: "Урок 2. Долгосрочная стратегия", duration: "14:20" },
        ],
      },
    ],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

export function getPopularCourses(): Course[] {
  return courses.filter((course) => course.popular);
}

export const categoryLabels: Record<"all" | CourseCategory | "popular", string> = {
  all: "Все",
  beginner: "Для начинающих",
  advanced: "Продвинутые",
  popular: "Популярное",
};
