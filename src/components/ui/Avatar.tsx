'use client';

import React from 'react';

interface AvatarProps {
  letter: string;
  size?: number;
  color?: string;
}

export default function Avatar({
  letter,
  size = 36,
  color = 'var(--acc)',
}: AvatarProps) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold shrink-0 tracking-tight text-white"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${Math.round(size * 0.44)}px`,
        background: color,
      }}
      aria-hidden="true"
    >
      {letter.charAt(0).toUpperCase()}
    </div>
  );
}
