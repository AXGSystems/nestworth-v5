'use client';

import React, { useCallback } from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  variant?: 'default' | 'danger';
  label: string;
}

export default function Toggle({
  checked,
  onChange,
  variant = 'default',
  label,
}: ToggleProps) {
  const handleClick = useCallback(() => {
    onChange(!checked);
  }, [checked, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onChange(!checked);
      }
    },
    [checked, onChange],
  );

  const trackColor = checked
    ? variant === 'danger'
      ? 'bg-[var(--neg)]'
      : 'bg-[var(--pos)]'
    : 'bg-[var(--t3)]';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`relative w-[51px] h-[31px] rounded-[15.5px] shrink-0 cursor-pointer select-none transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-[var(--acc)] focus-visible:outline-offset-2 min-h-[44px] flex items-center ${trackColor}`}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform duration-150 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
