'use client';

import React from 'react';

interface IconProps {
  path: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function Icon({
  path,
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d={path} />
    </svg>
  );
}
