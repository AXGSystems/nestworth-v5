'use client';

import React from 'react';
import { useNestWorthStore } from '@/lib/store';
import { ToastProvider, Sheet } from '@/components/ui';
import Sidebar from './Sidebar';
import Header from './Header';
import TabBar from './TabBar';
import Drawer from './Drawer';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const sheetOpen = useNestWorthStore((s) => s.sheetOpen);
  const sheetTitle = useNestWorthStore((s) => s.sheetTitle);
  const sheetContent = useNestWorthStore((s) => s.sheetContent);
  const closeSheet = useNestWorthStore((s) => s.closeSheet);

  return (
    <ToastProvider>
      <div className="flex min-h-dvh">
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Mobile drawer */}
        <Drawer />

        {/* Main column */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header />

          {/* Page content */}
          <main className="flex-1 px-4 py-4 pb-20 lg:pb-4 lg:px-6 max-w-[1200px] w-full mx-auto nw-content-fade">
            {children}
          </main>
        </div>

        {/* Mobile tab bar */}
        <TabBar />

        {/* Sheet overlay */}
        <Sheet open={sheetOpen} onClose={closeSheet} title={sheetTitle}>
          {sheetContent}
        </Sheet>
      </div>
    </ToastProvider>
  );
}
