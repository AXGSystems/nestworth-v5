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
        'hidden lg:flex flex-col shrink-0 h-dvh sticky top-0 z-50 nw-sidebar',
        'transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        collapsed ? 'w-[72px]' : 'w-[250px]',
      )}
    >
      {/* Logo + collapse */}
      <div className="flex items-center justify-between px-5 h-16 shrink-0 border-b border-[var(--sep)]">
        {!collapsed && (
          <span className="text-[17px] font-black tracking-tight text-[var(--t1)]">
            NestWorth
          </span>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl',
            'text-[var(--t2)] hover:bg-[var(--accS)] hover:text-[var(--t1)]',
            'transition-all duration-200',
          )}
        >
          <SidebarIcon name={collapsed ? 'expand' : 'collapse'} size={16} />
        </button>
      </div>

      {/* Scrollable nav area */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-3"
        aria-label="Main navigation"
      >
        {NAV_SECTIONS.map((section, sectionIdx) => (
          <div key={section.title} className="mb-1">
            {!collapsed && (
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--t3)] px-3 mb-2 mt-3">
                {section.title}
              </p>
            )}
            {collapsed && sectionIdx > 0 && (
              <div className="h-[0.5px] bg-[var(--sep)] mx-2 my-2" />
            )}
            {section.items.map((item) => {
              const active = isActive(item);
              const classes = cn(
                'flex items-center gap-3 w-full rounded-xl text-[13px] font-medium transition-all duration-200',
                collapsed
                  ? 'justify-center px-0 py-2.5 my-0.5'
                  : 'px-3 py-2.5 my-0.5',
                active
                  ? 'bg-[var(--accS)] text-[var(--acc)] font-semibold shadow-sm'
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

      {/* Bottom accent line */}
      <div className="px-4 py-3 border-t border-[var(--sep)]">
        {!collapsed && (
          <p className="text-[10px] text-[var(--t3)] font-medium text-center">
            NestWorth v5
          </p>
        )}
      </div>
    </aside>
  );
}
