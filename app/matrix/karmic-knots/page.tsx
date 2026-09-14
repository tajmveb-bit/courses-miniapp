import BackButton from "@/components/BackButton";
import UnlockGate from "@/components/matrix/UnlockGate";
import { karmicKnots, formatKnotCode } from "@/data/matrixKarmicKnots";

export default function KarmicKnotsPage() {
  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 flex items-center gap-3 animate-fade-up">
        <BackButton fallbackHref="/matrix" />
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Кармические узлы</h1>
      </div>

      <div className="px-5 mt-4 animate-fade-up [animation-delay:60ms] opacity-0">
        <UnlockGate title="Кармические узлы">
          <div className="rounded-4xl bg-white shadow-soft p-6">
            <p className="text-sm leading-relaxed text-ink-soft">
              Кармический узел — комбинация из 3 арканов, которая описывает ошибку прошлого
              воплощения, перенесённую в эту жизнь. Узлы считаются по рёбрам треугольника
              отношений и денежного треугольника: если три соседних аркана в вашей Звезде
              складываются в один из кодов ниже — карма будет бить именно по этой сфере.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {karmicKnots.map((knot, i) => (
              <div key={i} className="rounded-3xl bg-white shadow-card p-4">
                <span className="inline-flex items-center rounded-full bg-beige-light px-3 py-1 text-sm font-semibold text-beige-dark">
                  {formatKnotCode(knot.codes)}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{knot.description}</p>
                {knot.lesson && (
                  <>
                    <p className="mt-3 text-sm font-semibold text-ink">Урок</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{knot.lesson}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </UnlockGate>
      </div>
    </main>
  );
}
