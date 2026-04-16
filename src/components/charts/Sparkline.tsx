'use client';

import React, { useMemo } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export default function Sparkline({
  data,
  width = 60,
  height = 20,
  color = 'var(--acc)',
}: SparklineProps) {
  const points = useMemo(() => {
    if (!data.length) return '';
    const mn = Math.min(...data);
    const mx = Math.max(...data);
    const rng = mx - mn || 1;

    return data
      .map((v, i) => {
        const x = (i / (data.length - 1 || 1)) * width;
        const y = height - ((v - mn) / rng) * height * 0.8 - height * 0.1;
        return `${x},${y}`;
      })
      .join(' ');
  }, [data, width, height]);

  if (!data.length) return (
    <div className="flex items-center justify-center h-5 text-[var(--t3)] text-[10px]">
      --
    </div>
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto"
      style={{ maxHeight: `${height}px` }}
      role="img"
      aria-label="Sparkline"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
