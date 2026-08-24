import { Percent } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import { DISCOUNT_WARNING, discountCategories } from "@/data/club";

export default function DiscountsPage() {
  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Мои скидки</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Действуют только при активной подписке. Точную цену и условия уточняет администратор.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3 px-5 animate-fade-up [animation-delay:80ms] opacity-0">
        {discountCategories.map((discount) => (
          <div key={discount.id} className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-card">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-beige-light">
              <Percent className="w-5 h-5 text-beige-dark" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink">{discount.title}</p>
              <p className="mt-0.5 text-[13px] text-ink-soft leading-snug">{discount.description}</p>
            </div>
            <span className="flex-shrink-0 text-lg font-semibold text-beige-dark">-{discount.percent}%</span>
          </div>
        ))}

        <Disclaimer text={DISCOUNT_WARNING} />
      </div>
    </main>
  );
}
