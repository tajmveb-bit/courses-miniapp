"use client";

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

export default function StarChart({ result, onSelectPoint }: StarChartProps) {
  const pentagramPoints = PENTAGRAM_ORDER.map((id) => STAR_POINT_POSITIONS[id]);
  const polylinePoints = pentagramPoints.map((p) => `${p.left},${p.top}`).join(" ");

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px] rounded-full border border-beige-dark/20 bg-white shadow-soft">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <polyline points={polylinePoints} fill="none" stroke="#C9A77E" strokeWidth="0.6" strokeLinejoin="round" />
      </svg>

      {Object.entries(STAR_POINT_POSITIONS).map(([idStr, pos]) => {
        const id = Number(idStr);
        const value = result.points[id];
        return (
          <button
            key={id}
            type="button"
            onClick={() => {
              hapticSelection();
              onSelectPoint(value);
            }}
            style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
            className={`tap-scale absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full font-semibold text-white shadow-button ${
              SIZE_CLASSES[pos.size]
            } ${pos.size === "lg" ? "bg-beige-dark" : pos.size === "md" ? "bg-beige-dark/80" : "bg-beige-dark/60"}`}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}
