"use client";

import { useState } from "react";
import { hapticSelection } from "@/lib/telegram";

interface EnergyGraphChartProps {
  digits: number[];
  startAge?: number;
  onSelectValue: (value: number) => void;
}

export default function EnergyGraphChart({ digits, startAge = 17, onSelectValue }: EnergyGraphChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const width = 100;
  const height = 60;
  const stepX = digits.length > 1 ? width / (digits.length - 1) : 0;

  const points = digits.map((d, i) => ({
    x: i * stepX,
    y: height - (d / 9) * height,
    value: d,
    age: startAge + i,
  }));

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="w-full">
      <svg viewBox={`0 -6 ${width} ${height + 12}`} className="w-full h-40">
        <polyline points={polyline} fill="none" stroke="#C9A77E" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={activeIndex === i ? 2.6 : 1.8}
            fill={activeIndex === i ? "#B08F63" : "#C9A77E"}
            stroke="#fff"
            strokeWidth="0.6"
            onClick={() => {
              hapticSelection();
              setActiveIndex(i);
              onSelectValue(p.value);
            }}
            className="cursor-pointer"
          />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-ink-soft">
        <span>{startAge} лет</span>
        <span>{startAge + digits.length - 1} лет</span>
      </div>
      <p className="mt-2 text-center text-xs text-ink-soft">Нажмите на точку графика, чтобы узнать значение года</p>
    </div>
  );
}
