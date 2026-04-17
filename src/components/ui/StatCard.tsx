'use client';

import React from 'react';
import Card from './Card';

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'flat';
  accentColor?: string;
  onClick?: () => void;
}

const trendColors: Record<string, string> = {
  up: 'text-[var(--pos)]',
  down: 'text-[var(--neg)]',
  flat: 'text-[var(--t2)]',
};

const trendBgColors: Record<string, string> = {
  up: 'bg-[var(--posBg)]',
  down: 'bg-[var(--negBg)]',
  flat: 'bg-[var(--accS)]',
};

const trendArrows: Record<string, string> = {
  up: 'M18 15 12 9 6 15',
  down: 'M6 9 12 15 18 9',
  flat: 'M4 12h16',
};

export default function StatCard({
  label,
  value,
  change,
  trend = 'flat',
  accentColor,
  onClick,
}: StatCardProps) {
  return (
    <Card onClick={onClick} className="nw-stat-card">
      {accentColor && (
        <style>{`
          .nw-stat-card { --stat-accent: ${accentColor}; }
        `}</style>
      )}
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--t2)] mb-2">
        {label}
      </p>
      <p className="text-xl sm:text-2xl font-black tracking-tight text-[var(--t1)] font-[tabular-nums] truncate leading-tight">
        {value}
      </p>
      {change && (
        <div className={`inline-flex items-center gap-1.5 mt-2.5 text-[11px] font-semibold min-w-0 px-2 py-1 rounded-md ${trendBgColors[trend]} ${trendColors[trend]}`}>
          <svg
            width={10}
            height={10}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <polyline points={trendArrows[trend]} />
          </svg>
          <span className="font-[tabular-nums] truncate">{change}</span>
        </div>
      )}
    </Card>
  );
}
