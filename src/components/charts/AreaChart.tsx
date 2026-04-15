'use client';

import React, { useId, useMemo } from 'react';

interface AreaChartProps {
  data1: { label: string; value: number }[];
  data2: { label: string; value: number }[];
  color1?: string;
  color2?: string;
  label1?: string;
  label2?: string;
  height?: number;
}

const W = 400;
const PAD = { t: 10, r: 10, b: 28, l: 10 };

function buildSeries(
  data: { label: string; value: number }[],
  mn: number,
  rng: number,
  cw: number,
  ch: number,
) {
  const pts = data.map((d, i) => ({
    x: PAD.l + (i / (data.length - 1 || 1)) * cw,
    y: PAD.t + ch - ((d.value - mn) / rng) * ch,
  }));
  const pathD = 'M' + pts.map((p) => `${p.x},${p.y}`).join(' L');
  const areaD = `${pathD} L${pts[pts.length - 1].x},${PAD.t + ch} L${pts[0].x},${PAD.t + ch} Z`;
  return { pts, pathD, areaD };
}

export default function AreaChart({
  data1,
  data2,
  color1 = 'var(--pos)',
  color2 = 'var(--neg)',
  label1 = 'Income',
  label2 = 'Expenses',
  height = 180,
}: AreaChartProps) {
  const uid = useId();
  const id1 = `ag1-${uid.replace(/:/g, '')}`;
  const id2 = `ag2-${uid.replace(/:/g, '')}`;

  const chart = useMemo(() => {
    const len = Math.max(data1.length, data2.length);
    if (!len) return null;

    const allVals = [
      ...data1.map((d) => d.value),
      ...data2.map((d) => d.value),
    ];
    const mn = 0;
    const mx = Math.max(...allVals);
    const rng = mx - mn || 1;
    const cw = W - PAD.l - PAD.r;
    const ch = height - PAD.t - PAD.b;

    const s1 = buildSeries(data1, mn, rng, cw, ch);
    const s2 = buildSeries(data2, mn, rng, cw, ch);

    const labels = data1.map((d, i) => ({
      x: PAD.l + (i / (data1.length - 1 || 1)) * cw,
      text: d.label,
    }));

    return { s1, s2, labels };
  }, [data1, data2, height]);

  if (!chart) return null;

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto"
      role="img"
      aria-label="Area chart"
    >
      <defs>
        <linearGradient id={id1} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color1} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color1} stopOpacity={0.02} />
        </linearGradient>
        <linearGradient id={id2} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color2} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color2} stopOpacity={0.02} />
        </linearGradient>
      </defs>

      <path d={chart.s1.areaD} fill={`url(#${id1})`} />
      <path d={chart.s1.pathD} fill="none" stroke={color1} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      <path d={chart.s2.areaD} fill={`url(#${id2})`} />
      <path d={chart.s2.pathD} fill="none" stroke={color2} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {chart.labels.map((l, i) => (
        <text key={i} x={l.x} y={height - 4} textAnchor="middle" fill="var(--t2)" fontSize={9} fontWeight={600}>
          {l.text}
        </text>
      ))}

      <text x={W - PAD.r} y={14} textAnchor="end" fill={color1} fontSize={9} fontWeight={700}>
        {label1}
      </text>
      <text x={W - PAD.r} y={26} textAnchor="end" fill={color2} fontSize={9} fontWeight={700}>
        {label2}
      </text>
    </svg>
  );
}
