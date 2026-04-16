'use client';

import React, { useMemo } from 'react';

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  horizontal?: boolean;
}

const W = 400;

export default function BarChart({
  data,
  height = 200,
  horizontal = false,
}: BarChartProps) {
  const svg = useMemo(() => {
    if (!data.length) return null;

    if (horizontal) {
      const bh = Math.min(28, Math.floor((height - 20) / data.length) - 6);
      const pad = { t: 5, r: 60, b: 5, l: 80 };
      const cw = W - pad.l - pad.r;
      const maxVal = Math.max(...data.map((d) => d.value));
      const totalH = pad.t + data.length * (bh + 8);

      return {
        viewBox: `0 0 ${W} ${totalH}`,
        bars: data.map((d, i) => {
          const y = pad.t + i * (bh + 8);
          const bw = (d.value / (maxVal || 1)) * cw;
          const c = d.color ?? 'var(--acc)';
          return (
            <g key={i}>
              <rect x={pad.l} y={y} width={bw} height={bh} rx={4} fill={c}>
                <title>{`${d.label}: $${d.value.toLocaleString()}`}</title>
                <animate attributeName="width" from="0" to={bw} dur="0.5s" begin={`${0.05 * i}s`} fill="freeze" />
              </rect>
              <text x={pad.l - 6} y={y + bh / 2 + 4} textAnchor="end" fill="var(--t1)" fontSize={11} fontWeight={600}>
                {d.label}
              </text>
              <text x={pad.l + bw + 6} y={y + bh / 2 + 4} fill="var(--t2)" fontSize={10} fontWeight={700}>
                ${d.value.toLocaleString()}
              </text>
            </g>
          );
        }),
      };
    }

    const pad = { t: 10, r: 10, b: 28, l: 10 };
    const cw = W - pad.l - pad.r;
    const ch = height - pad.t - pad.b;
    const maxV = Math.max(...data.map((d) => d.value || 0));
    const bw = Math.min(40, Math.floor(cw / data.length) - 8);

    return {
      viewBox: `0 0 ${W} ${height}`,
      bars: data.map((d, i) => {
        const x =
          data.length === 1
            ? pad.l + cw / 2 - bw / 2
            : pad.l + (i / (data.length - 1 || 1)) * cw - bw / 2;
        const barH = ((d.value || 0) / (maxV || 1)) * ch;
        const y = pad.t + ch - barH;
        const c = d.color ?? 'var(--acc)';
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={barH} rx={4} fill={c}>
              <title>{`${d.label}: $${(d.value || 0).toLocaleString()}`}</title>
              <animate attributeName="height" from="0" to={barH} dur="0.4s" begin={`${0.04 * i}s`} fill="freeze" />
              <animate attributeName="y" from={pad.t + ch} to={y} dur="0.4s" begin={`${0.04 * i}s`} fill="freeze" />
            </rect>
            <text x={x + bw / 2} y={height - 4} textAnchor="middle" fill="var(--t2)" fontSize={9} fontWeight={600}>
              {d.label}
            </text>
            <text x={x + bw / 2} y={y - 4} textAnchor="middle" fill="var(--t1)" fontSize={9} fontWeight={700}>
              ${(d.value || 0).toLocaleString()}
            </text>
          </g>
        );
      }),
    };
  }, [data, height, horizontal]);

  if (!svg) return (
    <div className="flex items-center justify-center h-32 text-[var(--t3)] text-sm">
      No data available
    </div>
  );

  return (
    <svg
      viewBox={svg.viewBox}
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto"
      role="img"
      aria-label="Bar chart"
    >
      {svg.bars}
    </svg>
  );
}
