'use client';

import React from 'react';

interface PendingBadgeProps {
  reason: string;
}

export default function PendingBadge({ reason }: PendingBadgeProps) {
  return (
    <span
      className="nw-pending-badge inline-flex items-center gap-1 text-[8px] font-medium py-0.5 px-1.5 rounded text-[var(--t3)] border border-[var(--sep)] mt-1.5 opacity-70"
      style={{
        /* Fallback for browsers that don't support color-mix() */
        background: 'rgba(128, 128, 128, 0.08)',
      }}
    >
      <style>{`
        @supports (color: color-mix(in srgb, red 50%, blue)) {
          .nw-pending-badge {
            background: color-mix(in srgb, var(--t3) 8%, transparent) !important;
          }
        }
      `}</style>
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
