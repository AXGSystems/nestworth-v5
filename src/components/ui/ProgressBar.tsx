'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ProgressBarProps {
  percent: number;
  color?: string;
  height?: number;
  label?: string;
}

export default function ProgressBar({
  percent,
  color = 'var(--acc)',
  height = 6,
  label,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* Trigger entrance animation on mount */
    const timer = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  return (
    <div
      ref={ref}
      className="w-full rounded-[5px] overflow-hidden bg-[var(--accS)]"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `${clamped}% complete`}
      style={{ height: `${height}px` }}
    >
      <div
        className="h-full rounded-[5px]"
        style={{
          width: mounted ? `${clamped}%` : '0%',
          background: color,
          transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)',
        }}
      />
    </div>
  );
}
