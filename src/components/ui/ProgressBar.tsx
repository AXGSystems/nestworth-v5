'use client';

import React from 'react';

interface ProgressBarProps {
  percent: number;
  color?: string;
  height?: number;
}

export default function ProgressBar({
  percent,
  color = 'var(--acc)',
  height = 6,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div
      className="w-full rounded-[5px] overflow-hidden bg-[var(--sep)]"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ height: `${height}px` }}
    >
      <div
        className="h-full rounded-[5px] transition-[width] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: `${clamped}%`,
          background: color,
        }}
      />
    </div>
  );
}
