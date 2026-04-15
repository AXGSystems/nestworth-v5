'use client';

import React from 'react';

interface BadgeProps {
  text: string;
  color?: string;
}

export default function Badge({ text, color = 'var(--acc)' }: BadgeProps) {
  return (
    <span
      className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wide whitespace-nowrap select-none"
      style={{
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        color,
      }}
    >
      {text}
    </span>
  );
}
