import BackButton from "@/components/BackButton";
import UnlockGate from "@/components/matrix/UnlockGate";
import { spiritualMonthTasks, spiritualEnergies } from "@/data/matrixSpiritualSphere";

export default function SpiritualSpherePage() {
  return (
    <main className="pt-safe-t pb-10">
      <div className="px-5 pt-6 flex items-center gap-3 animate-fade-up">
        <BackButton fallbackHref="/matrix" />
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Сфера духовности</h1>
      </div>

      <div className="px-5 mt-4 animate-fade-up [animation-delay:60ms] opacity-0">
        <UnlockGate title="Сфера духовности">
          <div className="rounded-4xl bg-white shadow-soft p-6">
            <p className="text-sm leading-relaxed text-ink-soft">
              Второе предназначение (месяц рождения) — ваша главная задача в духовной сфере,
              связанная с родом. Ниже — родовая задача по месяцу рождения и значения энергий
              именно в контексте духовного треугольника (они отличаются от толкований в сфере
              личности).
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-ink mb-3">Задача по месяцу рождения</h2>
            <div className="flex flex-col gap-3">
              {spiritualMonthTasks.map((m) => (
                <div key={m.month} className="rounded-3xl bg-white shadow-card p-4">
                  <span className="inline-flex items-center rounded-full bg-beige-light px-3 py-1 text-sm font-semibold text-beige-dark">
                    {m.name}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{m.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-ink mb-3">Энергии в духовном треугольнике</h2>
            <p className="text-xs text-ink-soft mb-3">
              В исходном материале нет расшифровок для арканов 9, 10, 11 и 22 в этой сфере.
            </p>
            <div className="flex flex-col gap-3">
              {spiritualEnergies.map((e) => (
                <div key={e.id} className="rounded-3xl bg-white shadow-card p-4">
                  <span className="inline-flex items-center rounded-full bg-beige-light px-3 py-1 text-sm font-semibold text-beige-dark">
                    {e.id} · {e.name}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{e.text}</p>
                </div>
              ))}
            </div>
          </div>
        </UnlockGate>
      </div>
    </main>
  );
}
