'use client';

import React from 'react';

interface BadgeProps {
  text: string;
  color?: string;
}

export default function Badge({ text, color = 'var(--acc)' }: BadgeProps) {
  return (
    <span
      className="nw-badge-component inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md tracking-wide whitespace-nowrap select-none"
      style={
        {
          /* Fallback for browsers that don't support color-mix() */
          background: 'rgba(128, 128, 128, 0.12)',
          color,
          '--badge-color': color,
        } as React.CSSProperties
      }
    >
      <style>{`
        @supports (color: color-mix(in srgb, red 50%, blue)) {
          .nw-badge-component {
            background: color-mix(in srgb, var(--badge-color) 12%, transparent) !important;
          }
        }
      `}</style>
      {text}
    </span>
  );
}
