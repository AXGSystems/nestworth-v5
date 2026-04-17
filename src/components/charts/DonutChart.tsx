'use client';

import React, { useMemo } from 'react';

interface DonutChartProps {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  centerText?: string;
  centerSub?: string;
}

export default function DonutChart({
  segments,
  size = 180,
  centerText,
  centerSub,
}: DonutChartProps) {
  const total = useMemo(
    () => segments.reduce((a, s) => a + (s.value || 0), 0),
    [segments],
  );

  const arcs = useMemo(() => {
    if (!total) return [];
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.38;
    let cumAngle = -90;

    return segments.map((seg) => {
      const pct = seg.value / total;
      const angle = pct * 360;
      const startRad = (cumAngle * Math.PI) / 180;
      const endRad = ((cumAngle + angle) * Math.PI) / 180;
      const largeArc = angle > 180 ? 1 : 0;

      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);

      cumAngle += angle;

      return {
        d: `M${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2}`,
        color: seg.color,
        label: seg.label,
        pct: Math.round(pct * 100),
      };
    });
  }, [segments, size, total]);

  if (!total || !segments.length) return (
    <div className="flex items-center justify-center h-32 text-[var(--t3)] text-sm">
      No data available
    </div>
  );

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const sw = size * 0.12;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 flex-wrap">
      <div className="shrink-0 relative mx-auto sm:mx-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full" role="img" aria-label="Donut chart">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--sep)" strokeWidth={sw} />
          {arcs.map((arc, i) => (
            <path
              key={i}
              d={arc.d}
              fill="none"
              stroke={arc.color}
              strokeWidth={sw}
              strokeLinecap="round"
            >
              <title>{`${arc.label}: ${arc.pct}%`}</title>
            </path>
          ))}
        </svg>
        {centerText && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-black tracking-tight text-[var(--t1)]"
              style={{ fontSize: Math.round(size * 0.15) }}
            >
              {centerText}
            </span>
            {centerSub && (
              <span
                className="text-[var(--t2)] font-medium"
                style={{ fontSize: Math.round(size * 0.06) }}
              >
                {centerSub}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-[100px]">
        {arcs.map((arc, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[11px] mb-1">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: arc.color }}
            />
            <span className="flex-1 text-[var(--t2)]">{arc.label}</span>
            <span className="font-bold font-[tabular-nums]">{arc.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
