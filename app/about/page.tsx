import Image from "next/image";
import SocialLinks from "@/components/SocialLinks";

const EXPERT_NAME = "Алина";
const EXPERT_TAGLINE = "Эксперт по уходу за кожей и обучению в сфере красоты";

export default function AboutPage() {
  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Обо мне</h1>
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
            Более 5 лет я изучаю и практикую уход за кожей, а также помогаю женщинам
            раскрывать их естественную красоту через знания и правильный уход.
          </p>
          <p className="text-sm leading-relaxed text-ink-soft">
            За это время я прошла путь от первых экспериментов с косметикой до
            построения системного подхода к уходу — того, которым сейчас делюсь в своих
            курсах. Я разбираю составы, тестирую средства и слежу за исследованиями в
            области косметологии, чтобы давать только проверенную информацию.
          </p>
          <p className="text-sm leading-relaxed text-ink-soft">
            Я создала эти курсы, потому что вижу, как много женщин теряются в
            бесконечном потоке противоречивых советов и тратят деньги на средства,
            которые им не подходят. Мне хочется, чтобы уход за собой был осознанным,
            простым и приносил результат.
          </p>
          <p className="text-sm leading-relaxed text-ink-soft">
            На моих курсах вы получите понятную систему: как определить свой тип кожи,
            собрать эффективный уход и уверенно разбираться в косметике — без лишних
            трат и разочарований.
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
