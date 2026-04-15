'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'inner';
  onClick?: () => void;
  className?: string;
}

const variantStyles: Record<string, string> = {
  default:
    'backdrop-blur-xl bg-[var(--cardBg)] border border-[var(--cardBorder)] rounded-2xl p-4 shadow-sm relative z-[1]',
  accent:
    'backdrop-blur-xl bg-[var(--cardBg)] border border-[var(--cardBorder)] border-t-2 border-t-[var(--acc)] rounded-2xl p-4 shadow-sm relative z-[1]',
  inner:
    'bg-[var(--accS)] border border-[var(--cardBorder)] rounded-xl p-2.5',
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
    ? 'cursor-pointer hover:bg-[var(--cardBgH)] hover:shadow-md active:scale-[0.98] active:shadow-none transition-all duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]'
    : 'transition-all duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]';

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} ${interactiveStyles} text-left w-full focus-visible:outline-2 focus-visible:outline-[var(--acc)] focus-visible:outline-offset-2 ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={`${base} ${interactiveStyles} ${className}`}>
      {children}
    </div>
  );
}
