import Image from "next/image";
import SocialLinks from "@/components/SocialLinks";
import BackButton from "@/components/BackButton";

const EXPERT_NAME = "Алина";
const EXPERT_TAGLINE = "Косметолог, владелица салона красоты, автор клуба «Красота без рабства»";

export default function AboutPage() {
  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 flex items-center gap-3 animate-fade-up">
        <BackButton fallbackHref="/more" />
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Об эксперте</h1>
      </div>

      <div className="px-5 mt-6 animate-fade-up [animation-delay:60ms] opacity-0">
        <div className="relative mx-auto w-full max-w-[280px] aspect-[4/5] rounded-[3rem] overflow-hidden shadow-lifted">
          <Image
            src="/images/expert.webp"
            alt={EXPERT_NAME}
            fill
            priority
            sizes="280px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="px-5 mt-6 text-center animate-fade-up [animation-delay:100ms] opacity-0">
        <h2 className="text-2xl font-semibold text-ink">{EXPERT_NAME}</h2>
        <p className="mt-1 text-sm font-medium text-beige-dark">{EXPERT_TAGLINE}</p>
      </div>

      <div className="px-5 mt-6 animate-fade-up [animation-delay:140ms] opacity-0">
        <div className="rounded-4xl bg-white shadow-soft p-6 flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-ink-soft">
            Больше 5 лет я практикую как косметолог и руковожу собственным салоном. За это время я
            увидела одну и ту же историю сотни раз: женщина 35+ устаёт превращать уход за собой во
            вторую работу или, наоборот, бросает уход совсем.
          </p>
          <p className="text-sm leading-relaxed text-ink-soft">
            Клуб «Красота без рабства» — это спокойная система, а не марафон идеальности. Мы
            собираем реалистичный уход за кожей и волосами, разбираем составы и вопросы участниц,
            подключаем медицинскую навигацию там, где это уместно, и помогаем встроить заботу о
            себе в обычную занятую жизнь.
          </p>
          <p className="text-sm leading-relaxed text-ink-soft">
            43 — это не финиш. Я на собственном примере показываю, что собранность и уверенность в
            себе не требуют жертв и бесконечных трат — нужна система, а не хаос.
          </p>
        </div>
      </div>

      <div className="px-5 mt-8 animate-fade-up [animation-delay:180ms] opacity-0">
        <h3 className="text-lg font-semibold text-ink mb-3">Мои соцсети</h3>
        <SocialLinks />
      </div>
    </main>
  );
}
