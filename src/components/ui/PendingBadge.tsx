'use client';

import React from 'react';

interface PendingBadgeProps {
  reason: string;
}

export default function PendingBadge({ reason }: PendingBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 text-[8px] font-medium py-0.5 px-1.5 rounded bg-[color-mix(in_srgb,var(--t3)_8%,transparent)] text-[var(--t3)] border border-[var(--sep)] mt-1.5 opacity-70">
      <svg
        width={8}
        height={8}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx={12} cy={12} r={10} />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      {reason}
    </span>
  );
}
