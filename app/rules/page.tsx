import BackButton from "@/components/BackButton";

const SECTIONS = [
  {
    title: "Характер клуба",
    text: "Клуб «Красота без рабства» носит информационно-образовательный характер. Материалы и разборы не заменяют очную консультацию врача или косметолога и не являются медицинской диагностикой или лечением.",
  },
  {
    title: "Медицинская поддержка",
    text: "Консультации, разбор анализов и чекапы проводит врач или медицинский партнёр — не косметолог, не администратор и не бот. В экстренной ситуации обращайтесь в местную экстренную службу, а не в чат клуба.",
  },
  {
    title: "Доступ и оплата",
    text: "Оплата проходит вне приложения — по заявке администратор свяжется с вами и согласует способ оплаты и тариф.",
  },
  {
    title: "Вопросы и разборы",
    text: "Присланные вопросы могут быть выбраны для анонимного общего разбора. Персональные данные удаляются из публикации, а анонимный разбор проводится только с вашего согласия.",
  },
  {
    title: "Скидки и подборы",
    text: "Клубные скидки действуют только при активной подписке. Подбор БАДов, пептидов и косметики не заменяет консультацию врача — учитывайте противопоказания и лекарственные взаимодействия.",
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
