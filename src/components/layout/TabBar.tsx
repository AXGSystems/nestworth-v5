'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Tab {
  label: string;
  href: string;
  icon: string;
}

const TABS: Tab[] = [
  {
    label: 'Home',
    href: '/',
    icon: 'M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z',
  },
  {
    label: 'Spend',
    href: '/spend',
    icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6',
  },
  {
    label: 'Save',
    href: '/save',
    icon: 'M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h6v2h4v-3.5c2-1.5 2-2.7 2-4.5 0-2.5-1-4-4-5zM2 9.1C1.5 6.7 4 2 8 2',
  },
  {
    label: 'Money',
    href: '/money',
    icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  },
  {
    label: 'Coach',
    href: '/coach',
    icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  },
];

export default function TabBar() {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--barBg)] backdrop-blur-2xl saturate-150 border-t-[0.5px] border-[var(--barBorder)]"
      aria-label="Main tabs"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center justify-around h-[56px]">
        {TABS.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 min-h-[44px] min-w-[44px] transition-all duration-200',
                active ? 'text-[var(--acc)]' : 'text-[var(--t3)]',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <div className={cn(
                'flex items-center justify-center rounded-xl transition-all duration-200',
                active ? 'bg-[var(--accS)] w-12 h-7' : 'w-7 h-7',
              )}>
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill={active ? 'var(--acc)' : 'none'}
                  fillOpacity={active ? 0.12 : 0}
                  stroke="currentColor"
                  strokeWidth={active ? 2.2 : 1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={tab.icon} />
                </svg>
              </div>
              <span
                className={cn(
                  'text-[10px] leading-none',
                  active ? 'font-bold' : 'font-medium',
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
