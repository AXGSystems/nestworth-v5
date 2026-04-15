'use client';

import { useEffect } from 'react';
import { useNestWorthStore, hydrateStore } from '@/lib/store';

/**
 * Client-side provider that:
 * 1. Hydrates Zustand store from localStorage on mount
 * 2. Applies the saved theme to the <html> element
 * 3. Updates <meta name="theme-color"> to match
 */
export function NestWorthProvider({ children }: { children: React.ReactNode }) {
  const theme = useNestWorthStore((s) => s.theme);

  // Hydrate store from localStorage on first mount
  useEffect(() => {
    hydrateStore();
  }, []);

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    // Update meta theme-color
    const themeColors: Record<string, string> = {
      emerald: '#1a5e3a',
      light: '#f2f2f7',
      dark: '#000000',
      midnight: '#0a0e1a',
      gold: '#12100b',
    };
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', themeColors[theme] ?? '#1a5e3a');
    }
  }, [theme]);

  return <>{children}</>;
}
