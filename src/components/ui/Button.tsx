'use client';

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'gold' | 'pill' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

const base =
  'inline-flex items-center justify-center gap-2 font-semibold select-none transition-all duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.96] active:duration-[80ms] focus-visible:outline-2 focus-visible:outline-[var(--acc)] focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<string, string> = {
  primary:
    'bg-[var(--acc)] text-white rounded-[14px] shadow-md hover:brightness-110',
  gold:
    'bg-[var(--goldG)] text-white font-bold rounded-[22px] shadow-[0_4px_16px_rgba(200,168,72,0.25)] hover:brightness-110',
  pill:
    'bg-[var(--accS)] text-[var(--acc)] rounded-[17px] font-semibold hover:brightness-105',
  outline:
    'bg-transparent border-[1.5px] border-[var(--sep)] text-[var(--t2)] font-semibold rounded-[14px] hover:bg-[var(--accS)]',
  danger:
    'bg-[var(--negBg)] text-[var(--neg)] border border-[rgba(255,59,48,0.12)] rounded-[14px]',
};

const sizes: Record<string, string> = {
  sm: 'min-h-[36px] px-3 text-xs',
  md: 'min-h-[44px] px-5 text-sm',
  lg: 'min-h-[50px] px-6 text-[17px]',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full flex' : ''
      } ${className}`}
    >
      {children}
    </button>
  );
}
