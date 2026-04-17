'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'inner';
  onClick?: () => void;
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'nw-card',
  accent: 'nw-card nw-card-accent',
  inner: 'nw-card-inner',
};

export default function Card({
  children,
  variant = 'default',
  onClick,
  className = '',
}: CardProps) {
  const interactive = !!onClick;
  const base = variantStyles[variant];
  const interactiveStyles = interactive
    ? 'nw-card-tap focus-visible:outline-2 focus-visible:outline-[var(--acc)] focus-visible:outline-offset-2'
    : '';

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} ${interactiveStyles} text-left w-full ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={`${base} ${className}`}>
      {children}
    </div>
  );
}
