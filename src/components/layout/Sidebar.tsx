'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNestWorthStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ICONS, NAV_SECTIONS } from '@/lib/navigation';
import type { NavItem } from '@/lib/navigation';

function SidebarIcon({ name, size = 18 }: { name: string; size?: number }) {
  const path = ICONS[name];
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d={path} />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const collapsed = useNestWorthStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useNestWorthStore((s) => s.toggleSidebar);
  const currentPage = useNestWorthStore((s) => s.currentPage);
  const setPage = useNestWorthStore((s) => s.setPage);

  function isActive(item: NavItem): boolean {
    if (item.href) {
      if (item.href === '/') return pathname === '/' && !currentPage;
      return pathname === item.href && !currentPage;
    }
    if (item.page) {
      return currentPage === item.page;
    }
    return false;
  }

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col shrink-0 h-dvh sticky top-0 z-50',
        'bg-[var(--sidebarBg)] backdrop-blur-xl border-r border-[var(--sep)]',
        'transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        collapsed ? 'w-[68px]' : 'w-[240px]',
      )}
    >
      {/* Logo + collapse */}
      <div className="flex items-center justify-between px-4 h-14 shrink-0 border-b border-[var(--sep)]">
        {!collapsed && (
          <span className="text-base font-bold tracking-tight text-[var(--t1)]">
            NestWorth
          </span>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-[var(--t2)] hover:bg-[var(--accS)] transition-colors"
        >
          <SidebarIcon name={collapsed ? 'expand' : 'collapse'} size={16} />
        </button>
      </div>

      {/* Scrollable nav area */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2"
        aria-label="Main navigation"
      >
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-3">
            {!collapsed && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--t3)] px-2 mb-1">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const active = isActive(item);
              const classes = cn(
                'flex items-center gap-2.5 w-full rounded-lg text-[13px] font-medium transition-all duration-150',
                collapsed
                  ? 'justify-center px-0 py-2.5 my-0.5'
                  : 'px-2.5 py-2 my-0.5',
                active
                  ? 'bg-[var(--accS)] text-[var(--acc)] font-semibold'
                  : 'text-[var(--t2)] hover:bg-[var(--accS)] hover:text-[var(--t1)]',
              );
              const content = (
                <>
                  <SidebarIcon name={item.icon} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </>
              );

              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={classes}
                    title={collapsed ? item.label : undefined}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setPage(item.page ?? null)}
                  className={classes}
                  title={collapsed ? item.label : undefined}
                >
                  {content}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
