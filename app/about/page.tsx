import Image from "next/image";
import SocialLinks from "@/components/SocialLinks";
import BackButton from "@/components/BackButton";

const EXPERT_NAME = "Анастасия Гафке";
const EXPERT_TAGLINE = "Предприниматель, бизнес-практик, эксперт по Матрице судьбы и управлению энергией";
const QUOTE = "Успех в материи и внутренняя гармония строятся на одном правиле: нужна система, а не хаос.";

const POINTS = [
  "20 лет в бьюти-бизнесе в статусе действующего собственника. Я практик: знаю, как строить бизнес-процессы, управлять людьми, держать устойчивость и расти в деньгах без иллюзий и выгорания.",
  "Эксперт по энергоразборам и Матрице судьбы. Помогаю как предпринимателям наладить поток ресурсов и убрать «потолки», так и тем, кто ищет своё истинное проявление, женскую опору и гармонию.",
  "Мне 43 года, и на собственном опыте я доказываю: зрелость, красота, сильный системный бизнес и женственность великолепно дополняют друг друга.",
];

const STORY = [
  "У меня два фундаментальных образования — экономическое и медицинское, и двадцать лет в бизнесе: своя клиника, бутик, линия косметики, собственные гаджеты. Снаружи всё выглядело правильно — сильная женщина, у которой всё получается.",
  "А внутри годами были жёсткие отношения, в которых я теряла себя, держала всё: дело, людей, дом. Числа стали для меня языком, которым можно описать энергию, влияющую на решения, отношения и деньги, — не магия и не гадание, а система, понятная как карта.",
  "Так появился метод «Сайфер» — соединение Матрицы судьбы и 64 Генных Ключей. Когда я перестала ломать себя под чужой сценарий и начала жить по своей инструкции, вернулись силы, ясность и деньги.",
];

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
            src="/images/expert.jpg"
            alt={EXPERT_NAME}
            fill
            priority
            sizes="280px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="px-5 mt-6 text-center animate-fade-up [animation-delay:100ms] opacity-0">
        <p className="text-xs font-medium uppercase tracking-wide text-beige-dark">
          Точка Силы — системный клуб
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-ink">{EXPERT_NAME}</h2>
        <p className="mt-1.5 text-sm font-medium text-ink-soft">{EXPERT_TAGLINE}</p>
      </div>

      <div className="px-5 mt-6 animate-fade-up [animation-delay:120ms] opacity-0">
        <div className="rounded-4xl bg-beige-dark p-6 text-center text-white shadow-lifted">
          <p className="text-base leading-relaxed italic">«{QUOTE}»</p>
        </div>
      </div>

      <div className="px-5 mt-6 animate-fade-up [animation-delay:140ms] opacity-0">
        <div className="rounded-4xl bg-white shadow-soft p-6 flex flex-col gap-4">
          {POINTS.map((text) => (
            <p key={text} className="text-sm leading-relaxed text-ink-soft">
              {text}
            </p>
          ))}
        </div>
      </div>

      <div className="px-5 mt-8 animate-fade-up [animation-delay:160ms] opacity-0">
        <h3 className="text-lg font-semibold text-ink mb-3">Моя история</h3>
        <div className="rounded-4xl bg-white shadow-soft p-6 flex flex-col gap-4">
          {STORY.map((text) => (
            <p key={text} className="text-sm leading-relaxed text-ink-soft">
              {text}
            </p>
          ))}
        </div>
      </div>

      <div className="px-5 mt-8 animate-fade-up [animation-delay:180ms] opacity-0">
        <h3 className="text-lg font-semibold text-ink mb-3">Мои соцсети</h3>
        <SocialLinks />
      </div>
    </main>
  );
}
