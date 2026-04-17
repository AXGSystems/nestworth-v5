'use client';

import React, { useEffect, useState } from 'react';
import { useNestWorthStore } from '@/lib/store';
import { Avatar } from '@/components/ui';

export default function Header() {
  const toggleDrawer = useNestWorthStore((s) => s.toggleDrawer);
  const openSheet = useNestWorthStore((s) => s.openSheet);

  // Avoid hydration mismatch: render date only after mount
  const [dateStr, setDateStr] = useState('');
  useEffect(() => {
    setDateStr(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    );
  }, []);

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between h-16 px-5 bg-[var(--barBg)] backdrop-blur-2xl border-b border-[var(--barBorder)]"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      {/* Left: hamburger (mobile) + logo */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          type="button"
          onClick={toggleDrawer}
          aria-label="Open navigation menu"
          className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[var(--t1)] hover:bg-[var(--accS)] transition-colors"
        >
          <svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1={3} y1={6} x2={21} y2={6} />
            <line x1={3} y1={12} x2={21} y2={12} />
            <line x1={3} y1={18} x2={21} y2={18} />
          </svg>
        </button>

        <span className="text-[17px] font-black tracking-tight text-[var(--t1)] lg:hidden">
          NestWorth
        </span>
      </div>

      {/* Center: date */}
      <p className="hidden sm:block text-[13px] font-semibold text-[var(--t2)]">
        {dateStr}
      </p>

      {/* Right: avatars + actions */}
      <div className="flex items-center gap-1.5">
        {/* Partner avatars */}
        <div className="flex -space-x-2 mr-2">
          <Avatar letter="C" size={30} color="var(--acc)" />
          <Avatar letter="Ch" size={30} color="var(--gold)" />
        </div>

        {/* Search */}
        <button
          type="button"
          aria-label="Search"
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-[var(--t2)] hover:bg-[var(--accS)] hover:text-[var(--t1)] transition-all duration-150"
          onClick={() => openSheet('Search')}
        >
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
        </button>

        {/* Notifications bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-[var(--t2)] hover:bg-[var(--accS)] hover:text-[var(--t1)] transition-all duration-150 relative"
          onClick={() => openSheet('Notifications')}
        >
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {/* Dot indicator */}
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[var(--neg)] border-2 border-[var(--barBg)]" />
        </button>

        {/* Settings gear */}
        <button
          type="button"
          aria-label="Settings"
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-[var(--t2)] hover:bg-[var(--accS)] hover:text-[var(--t1)] transition-all duration-150"
          onClick={() => openSheet('Settings')}
        >
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx={12} cy={12} r={3} />
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
