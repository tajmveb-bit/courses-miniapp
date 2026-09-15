"use client";

import { motion } from "framer-motion";
import { hapticSelection } from "@/lib/telegram";
import { STAR_POINT_POSITIONS, PENTAGRAM_ORDER, type MatrixResult } from "@/lib/matrix";

interface StarChartProps {
  result: MatrixResult;
  onSelectPoint: (value: number) => void;
}

const SIZE_CLASSES: Record<"lg" | "md" | "sm", string> = {
  lg: "w-9 h-9 text-sm",
  md: "w-5 h-5 text-[10px]",
  sm: "w-2.5 h-2.5",
};

// Общий shadow-button (большой блюр под отдельно стоящие CTA-кнопки) на плотном скоплении
// маленьких точек звезды визуально "склеивает" соседей своим свечением — даже без реального
// наложения кружков. Поэтому у md/sm точек тень заметно легче и компактнее.
const SHADOW_CLASSES: Record<"lg" | "md" | "sm", string> = {
  lg: "shadow-button",
  md: "shadow-[0_3px_8px_rgba(201,167,126,0.3)]",
  sm: "shadow-[0_1px_3px_rgba(201,167,126,0.25)]",
};

const CIRCLE_DURATION = 1.1;
const LINE_START = 1.1;
const LINE_DURATION = 3;

// Порядок появления вершин пентаграммы — совпадает с тем, как рисуется линия.
const PENTAGRAM_UNIQUE_ORDER = Array.from(new Set(PENTAGRAM_ORDER));

const ALL_IDS = Object.keys(STAR_POINT_POSITIONS).map(Number);
const MD_IDS = ALL_IDS.filter((id) => STAR_POINT_POSITIONS[id].size === "md");
const SM_IDS = ALL_IDS.filter((id) => STAR_POINT_POSITIONS[id].size === "sm");

const MD_START = LINE_START + LINE_DURATION;
const MD_STEP = 0.08;
const SM_START = MD_START + MD_IDS.length * MD_STEP + 0.15;
const SM_STEP = 0.035;

function getBadgeDelay(id: number): number {
  const size = STAR_POINT_POSITIONS[id].size;
  if (size === "lg") {
    const order = PENTAGRAM_UNIQUE_ORDER.indexOf(id);
    return LINE_START + (LINE_DURATION * order) / (PENTAGRAM_UNIQUE_ORDER.length - 1);
  }
  if (size === "md") {
    return MD_START + MD_IDS.indexOf(id) * MD_STEP;
  }
  return SM_START + SM_IDS.indexOf(id) * SM_STEP;
}

// Радиусы бейджей в px — должны совпадать с SIZE_CLASSES выше (w-9/5/2.5 => 18/10/5).
const RADIUS_PX: Record<"lg" | "md" | "sm", number> = { lg: 18, md: 10, sm: 5 };
// Условная ширина карты в px для расчёта пересечений — берём с запасом под узкие телефоны,
// чтобы бейджи гарантированно не слипались даже на маленьком экране.
const LAYOUT_REF_PX = 335;
const BADGE_PADDING_PX = 3;

// Раскладка карты повторяет форму звезды с сайта — сдвигать точки целиком нельзя (собьётся форма).
// Поэтому здесь не радиальный сдвиг от центра, а точечное раздвижение конфликтующих бейджей:
// крупные (lg) и средние (md) точки жёстко зафиксированы (иначе ряд из md-точек или пентаграмма
// "перекосится"), а маленькие (sm) точки разъезжаются друг от друга и от соседних md, если реально
// перекрываются по пикселям.
function resolveCollisions(): Record<number, { left: number; top: number }> {
  const nodes = ALL_IDS.map((id) => {
    const p = STAR_POINT_POSITIONS[id];
    return {
      id,
      x: (p.left / 100) * LAYOUT_REF_PX,
      y: (p.top / 100) * LAYOUT_REF_PX,
      r: RADIUS_PX[p.size],
      movable: p.size === "sm",
    };
  });

  for (let iter = 0; iter < 200; iter++) {
    let moved = false;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        if (!a.movable && !b.movable) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = a.r + b.r + BADGE_PADDING_PX;
        if (dist >= minDist) continue;
        if (dist < 0.01) dist = 0.01;
        const overlap = minDist - dist;
        const nx = dx / dist;
        const ny = dy / dist;
        if (a.movable && b.movable) {
          a.x -= (nx * overlap) / 2;
          a.y -= (ny * overlap) / 2;
          b.x += (nx * overlap) / 2;
          b.y += (ny * overlap) / 2;
        } else if (a.movable) {
          a.x -= nx * overlap;
          a.y -= ny * overlap;
        } else {
          b.x += nx * overlap;
          b.y += ny * overlap;
        }
        moved = true;
      }
    }
    if (!moved) break;
  }

  const result: Record<number, { left: number; top: number }> = {};
  nodes.forEach((n) => {
    result[n.id] = { left: (n.x / LAYOUT_REF_PX) * 100, top: (n.y / LAYOUT_REF_PX) * 100 };
  });
  return result;
}

const DISPLAY_POSITIONS = resolveCollisions();

export default function StarChart({ result, onSelectPoint }: StarChartProps) {
  const pentagramPoints = PENTAGRAM_ORDER.map((id) => STAR_POINT_POSITIONS[id]);
  const polylinePoints = pentagramPoints.map((p) => `${p.left},${p.top}`).join(" ");

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[360px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <motion.circle
          cx="50"
          cy="50"
          r="49"
          fill="#fff"
          stroke="#C9A77E"
          strokeWidth="0.6"
          strokeOpacity="0.35"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: CIRCLE_DURATION, ease: "easeInOut" }}
        />
        <motion.polyline
          points={polylinePoints}
          fill="none"
          stroke="#C9A77E"
          strokeWidth="0.7"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: LINE_DURATION, delay: LINE_START, ease: "easeInOut" }}
        />
      </svg>

      {ALL_IDS.map((id) => {
        const pos = DISPLAY_POSITIONS[id];
        const size = STAR_POINT_POSITIONS[id].size;
        const value = result.points[id];
        return (
          <motion.button
            key={id}
            type="button"
            onClick={() => {
              hapticSelection();
              onSelectPoint(value);
            }}
            style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: getBadgeDelay(id), ease: "backOut" }}
            aria-label={`${value}`}
            className={`tap-scale absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center rounded-full font-semibold text-white ${
              SIZE_CLASSES[size]
            } ${SHADOW_CLASSES[size]} ${
              size === "lg" ? "bg-beige-dark" : size === "md" ? "bg-beige-dark/85" : "bg-beige-dark/50"
            }`}
          >
            {size !== "sm" && value}
          </motion.button>
        );
      })}
    </div>
  );
}
