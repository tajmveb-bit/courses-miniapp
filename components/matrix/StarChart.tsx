"use client";

import { motion } from "framer-motion";
import { hapticSelection } from "@/lib/telegram";
import { STAR_POINT_POSITIONS, PENTAGRAM_ORDER, type MatrixResult } from "@/lib/matrix";

interface StarChartProps {
  result: MatrixResult;
  onSelectPoint: (value: number) => void;
}

const SIZE_CLASSES: Record<"lg" | "md" | "sm", string> = {
  lg: "w-10 h-10 text-sm",
  md: "w-6 h-6 text-[11px]",
  sm: "w-[18px] h-[18px] text-[9px]",
};

const CIRCLE_DURATION = 0.9;
const LINE_START = 0.5;
const LINE_DURATION = 1.5;

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

export default function StarChart({ result, onSelectPoint }: StarChartProps) {
  const pentagramPoints = PENTAGRAM_ORDER.map((id) => STAR_POINT_POSITIONS[id]);
  const polylinePoints = pentagramPoints.map((p) => `${p.left},${p.top}`).join(" ");

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px] bg-white shadow-soft rounded-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <motion.circle
          cx="50"
          cy="50"
          r="49"
          fill="none"
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
          strokeWidth="0.6"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: LINE_DURATION, delay: LINE_START, ease: "easeInOut" }}
        />
      </svg>

      {ALL_IDS.map((id) => {
        const pos = STAR_POINT_POSITIONS[id];
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
            className={`tap-scale absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full font-semibold text-white shadow-button ${
              SIZE_CLASSES[pos.size]
            } ${pos.size === "lg" ? "bg-beige-dark" : pos.size === "md" ? "bg-beige-dark/80" : "bg-beige-dark/60"}`}
          >
            {value}
          </motion.button>
        );
      })}
    </div>
  );
}
