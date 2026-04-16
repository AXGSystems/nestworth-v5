'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary for the dashboard. Catches render errors in child
 * components and shows a friendly error screen with a reload button.
 * Must be a class component because React error boundaries require
 * getDerivedStateFromError / componentDidCatch.
 */
export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[NestWorth ErrorBoundary]', error, errorInfo.componentStack);
  }

  handleReload = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--negBg)] flex items-center justify-center mb-4">
            <svg
              width={32}
              height={32}
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--neg)"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx={12} cy={12} r={10} />
              <line x1={12} y1={8} x2={12} y2={12} />
              <line x1={12} y1={16} x2={12.01} y2={16} />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-[var(--t1)] mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-[var(--t2)] mb-6 max-w-md">
            An unexpected error occurred while rendering this page. Please try
            reloading. If the problem persists, contact support.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="px-6 py-3 rounded-xl bg-[var(--acc)] text-white font-semibold text-sm hover:brightness-110 active:scale-95 transition-all duration-150"
          >
            Reload Page
          </button>
          {this.state.error && (
            <p className="mt-4 text-[11px] text-[var(--t3)] font-mono max-w-md break-all">
              {this.state.error.message}
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
