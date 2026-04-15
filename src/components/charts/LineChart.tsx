'use client';

import React, { useId, useMemo } from 'react';

interface LineChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  showArea?: boolean;
  showDots?: boolean;
}

const W = 400;
const PAD = { t: 10, r: 10, b: 28, l: 10 };

export default function LineChart({
  data,
  color = 'var(--acc)',
  height = 160,
  showArea = true,
  showDots = true,
}: LineChartProps) {
  const uid = useId();
  const gradId = `lg-${uid.replace(/:/g, '')}`;

  const { points, pathD, areaD, gridLines, labels, min, range } =
    useMemo(() => {
      if (!data.length) return { points: [], pathD: '', areaD: '', gridLines: [], labels: [], min: 0, range: 1 };
      const cw = W - PAD.l - PAD.r;
      const ch = height - PAD.t - PAD.b;
      const vals = data.map((d) => d.value);
      const mn = Math.min(...vals);
      const mx = Math.max(...vals);
      const rng = mx - mn || 1;

      const pts = data.map((d, i) => ({
        x: PAD.l + (i / (data.length - 1 || 1)) * cw,
        y: PAD.t + ch - ((d.value - mn) / rng) * ch,
      }));

      const pd = 'M' + pts.map((p) => `${p.x},${p.y}`).join(' L');
      const ad = `${pd} L${pts[pts.length - 1].x},${PAD.t + ch} L${pts[0].x},${PAD.t + ch} Z`;

      const grids = Array.from({ length: 4 }, (_, i) => ({
        y: PAD.t + (ch / 3) * i,
      }));

      const lbls = data.map((d, i) => ({
        x: PAD.l + (i / (data.length - 1 || 1)) * cw,
        text: d.label,
      }));

      return { points: pts, pathD: pd, areaD: ad, gridLines: grids, labels: lbls, min: mn, range: rng };
    }, [data, height]);

  if (!data.length) return null;

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto"
      role="img"
      aria-label="Line chart"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {gridLines.map((g, i) => (
        <line
          key={i}
          x1={PAD.l}
          y1={g.y}
          x2={W - PAD.r}
          y2={g.y}
          stroke="var(--sep)"
          strokeWidth={0.5}
        />
      ))}

      {showArea && (
        <path d={areaD} fill={`url(#${gradId})`} opacity={0}>
          <animate attributeName="opacity" from="0" to="1" dur="0.6s" fill="freeze" />
        </path>
      )}

      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <animate attributeName="stroke-dashoffset" from="2000" to="0" dur="1s" fill="freeze" />
      </path>

      {showDots &&
        points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3.5}
            fill={color}
            stroke="var(--cardBg)"
            strokeWidth={2}
            opacity={0}
          >
            <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin={`${0.05 * i}s`} fill="freeze" />
            <title>{`$${data[i].value.toLocaleString()}`}</title>
          </circle>
        ))}

      {labels.map((l, i) => (
        <text
          key={i}
          x={l.x}
          y={height - 4}
          textAnchor="middle"
          fill="var(--t2)"
          fontSize={9}
          fontWeight={600}
        >
          {l.text}
        </text>
      ))}
    </svg>
  );
}
