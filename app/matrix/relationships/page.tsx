import BackButton from "@/components/BackButton";
import UnlockGate from "@/components/matrix/UnlockGate";
import { relationshipEnergies } from "@/data/matrixRelationships";

export default function RelationshipsPage() {
  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 flex items-center gap-3 animate-fade-up">
        <BackButton fallbackHref="/matrix" />
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Сфера отношений</h1>
      </div>

      <div className="px-5 mt-4 animate-fade-up [animation-delay:60ms] opacity-0">
        <UnlockGate section="relationships" title="Сфера отношений">
          <div className="rounded-4xl bg-white shadow-soft p-6">
            <p className="text-sm leading-relaxed text-ink-soft">
              Четвёртая сфера начинает полноценно влиять на судьбу ближе к 35 годам. Партнёры
              привлекаются по принципу отражения внутренних непроработанных качеств и страхов —
              ниже толкование энергий именно в контексте отношений.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {relationshipEnergies.map((e) => (
              <div key={e.id} className="rounded-3xl bg-white shadow-card p-4">
                <span className="inline-flex items-center rounded-full bg-beige-light px-3 py-1 text-sm font-semibold text-beige-dark">
                  {e.id} · {e.name}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{e.description}</p>
                {e.advice && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{e.advice}</p>}
                {e.steps && e.steps.length > 0 && (
                  <>
                    <p className="mt-3 text-sm font-semibold text-ink">Как пройти программу</p>
                    <ul className="mt-1 flex flex-col gap-1">
                      {e.steps.map((s, i) => (
                        <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink-soft">
                          <span className="text-beige-dark">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
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
