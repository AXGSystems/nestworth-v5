'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNestWorthStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ICONS, NAV_SECTIONS } from '@/lib/navigation';
import type { NavItem } from '@/lib/navigation';

export default function Drawer() {
  const drawerOpen = useNestWorthStore((s) => s.drawerOpen);
  const toggleDrawer = useNestWorthStore((s) => s.toggleDrawer);
  const currentPage = useNestWorthStore((s) => s.currentPage);
  const setPage = useNestWorthStore((s) => s.setPage);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);

  function isActive(item: NavItem): boolean {
    if (item.href) {
      if (item.href === '/') return pathname === '/' && !currentPage;
      return pathname === item.href && !currentPage;
    }
    if (item.page) return currentPage === item.page;
    return false;
  }

  /* Close on Escape */
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleDrawer();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [drawerOpen, toggleDrawer]);

  /* Move focus into drawer on open */
  useEffect(() => {
    if (drawerOpen) {
      requestAnimationFrame(() => {
        const close = drawerRef.current?.querySelector<HTMLElement>('button[aria-label="Close navigation"]');
        close?.focus();
      });
    }
  }, [drawerOpen]);

  /* Prevent body scroll */
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  /* Swipe to dismiss */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (startX.current === null) return;
      const diff = e.changedTouches[0].clientX - startX.current;
      if (diff < -80) toggleDrawer();
      startX.current = null;
    },
    [toggleDrawer],
  );

  return (
    <div
      className={cn(
        'lg:hidden fixed inset-0 z-[998] flex',
        drawerOpen ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      role="dialog"
      aria-modal={drawerOpen}
      aria-label="Navigation drawer"
    >
      {/* Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-[var(--overlay)] transition-opacity duration-300',
          drawerOpen ? 'opacity-100' : 'opacity-0',
        )}
        onClick={toggleDrawer}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={cn(
          'relative w-[280px] max-w-[85vw] h-full bg-[var(--drawerBg)] backdrop-blur-xl overflow-y-auto',
          'transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--sep)]">
          <span className="text-base font-bold tracking-tight text-[var(--t1)]">
            NestWorth
          </span>
          <button
            type="button"
            onClick={toggleDrawer}
            aria-label="Close navigation"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[var(--t2)] hover:bg-[var(--accS)] transition-colors"
          >
            <svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1={18} y1={6} x2={6} y2={18} />
              <line x1={6} y1={6} x2={18} y2={18} />
            </svg>
          </button>
        </div>

        {/* Nav sections */}
        <nav className="py-2 px-2" aria-label="Main navigation">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mb-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--t3)] px-2.5 mb-1">
                {section.title}
              </p>
              {section.items.map((item) => {
                const active = isActive(item);
                const iconPath = ICONS[item.icon] ?? '';

                const content = (
                  <>
                    <svg
                      width={18}
                      height={18}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="shrink-0"
                    >
                      <path d={iconPath} />
                    </svg>
                    <span className="truncate">{item.label}</span>
                  </>
                );

                const classes = cn(
                  'flex items-center gap-2.5 w-full rounded-lg px-2.5 py-2.5 my-0.5 text-[13px] font-medium transition-all duration-150',
                  active
                    ? 'bg-[var(--accS)] text-[var(--acc)] font-semibold'
                    : 'text-[var(--t2)] hover:bg-[var(--accS)] hover:text-[var(--t1)]',
                );

                if (item.href) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={classes}
                      onClick={toggleDrawer}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.label}
                    type="button"
                    className={classes}
                    onClick={() => {
                      setPage(item.page ?? null);
                      toggleDrawer();
                    }}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
