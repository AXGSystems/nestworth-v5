'use client';

import React, { useCallback, useEffect, useRef } from 'react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Sheet({ open, onClose, title, children }: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  /* Focus trap + restore */
  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => sheetRef.current?.focus());
    } else {
      previousFocus.current?.focus();
    }
  }, [open]);

  /* Escape to close */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      /* Focus trap */
      if (e.key === 'Tab' && sheetRef.current) {
        const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  /* Prevent body scroll */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-end justify-center ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      role="dialog"
      aria-modal={open}
      aria-label={title}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-[var(--overlay)] transition-opacity duration-300 ease-out ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={`relative w-full max-w-[600px] max-h-[92vh] overflow-y-auto overscroll-contain bg-[var(--bgE)] rounded-t-2xl px-5 pb-10 pt-2 z-[1000] outline-none transition-transform duration-500 will-change-transform ${
          open
            ? 'translate-y-0 ease-[cubic-bezier(0.32,0.72,0,1)]'
            : 'translate-y-full ease-[cubic-bezier(0.32,0,0.67,0)]'
        }`}
        style={{ paddingBottom: 'calc(40px + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Handle */}
        <div className="w-9 h-[5px] rounded-full bg-[var(--t3)] mx-auto mb-3.5 mt-1 cursor-grab" />

        {/* Title */}
        <h2 className="text-lg font-bold tracking-tight text-[var(--t1)] mb-4">
          {title}
        </h2>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[var(--t2)] hover:bg-[var(--accS)] transition-colors"
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

        {children}
      </div>
    </div>
  );
}
