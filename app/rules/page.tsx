import BackButton from "@/components/BackButton";

const SECTIONS = [
  {
    title: "Характер клуба",
    text: "Клуб «Код Красоты» носит информационно-образовательный характер. Разборы Матрицы судьбы не являются медицинским, юридическим или финансовым советом и не заменяют консультацию профильного специалиста.",
  },
  {
    title: "Доступ и оплата",
    text: "Полные разборы разделов Матрицы судьбы открываются по коду доступа после оплаты. Код одноразовый и передаётся лично вам — делиться им с другими нельзя.",
  },
  {
    title: "Консультации и вопросы",
    text: "Личная консультация и вопросы специалисту оформляются через WhatsApp — там же вы получите ответ и согласуете детали.",
  },
  {
    title: "Уведомления",
    text: "Вы можете отключить маркетинговые уведомления в любой момент, сохранив сервисные — например, ответы на ваши вопросы.",
  },
];

export default function RulesPage() {
  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 flex items-center gap-3 animate-fade-up">
        <BackButton fallbackHref="/" />
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Правила клуба</h1>
      </div>

      <div className="px-5 mt-5 flex flex-col gap-3 animate-fade-up [animation-delay:60ms] opacity-0">
        {SECTIONS.map((section) => (
          <div key={section.title} className="rounded-3xl bg-white p-4 shadow-card">
            <h2 className="text-sm font-semibold text-ink">{section.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{section.text}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
