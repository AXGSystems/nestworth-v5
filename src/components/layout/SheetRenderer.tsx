'use client';

import React from 'react';
import { useNestWorthStore } from '@/lib/store';

/**
 * Maps sheet IDs to React content. The store holds a string ID + optional data
 * instead of a ReactNode, keeping the store serializable.
 */
export default function SheetRenderer() {
  const sheetId = useNestWorthStore((s) => s.sheetId);

  if (!sheetId) return null;

  switch (sheetId) {
    case 'Search':
      return (
        <p className="text-sm text-[var(--t2)]">Search coming soon...</p>
      );

    case 'Notifications':
      return (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--accS)]">
            <span className="w-2 h-2 rounded-full bg-[var(--neg)] mt-1.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[var(--t1)]">Shopping over budget</p>
              <p className="text-xs text-[var(--t2)]">$35 over cap in Shopping category</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--accS)]">
            <span className="w-2 h-2 rounded-full bg-[var(--warn)] mt-1.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[var(--t1)]">Cap One Savings stale</p>
              <p className="text-xs text-[var(--t2)]">47 days since last sync</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--accS)]">
            <span className="w-2 h-2 rounded-full bg-[var(--pos)] mt-1.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[var(--t1)]">Budget streak: 14 days</p>
              <p className="text-xs text-[var(--t2)]">Keep it up!</p>
            </div>
          </div>
        </div>
      );

    case 'Settings':
      return (
        <p className="text-sm text-[var(--t2)]">Settings panel coming soon...</p>
      );

    default:
      return (
        <p className="text-sm text-[var(--t2)]">No content for &ldquo;{sheetId}&rdquo;</p>
      );
  }
}
