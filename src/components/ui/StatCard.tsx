'use client';

import React from 'react';
import Card from './Card';

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'flat';
  onClick?: () => void;
}

const trendColors: Record<string, string> = {
  up: 'text-[var(--pos)]',
  down: 'text-[var(--neg)]',
  flat: 'text-[var(--t2)]',
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
  onClick,
}: StatCardProps) {
  return (
    <Card onClick={onClick}>
      <p className="text-xs font-medium text-[var(--t2)] mb-1">{label}</p>
      <p className="text-lg sm:text-xl font-bold tracking-tight text-[var(--t1)] font-[tabular-nums] truncate">
        {value}
      </p>
      {change && (
        <div className={`flex items-center gap-1 mt-1 text-xs font-semibold min-w-0 ${trendColors[trend]}`}>
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
