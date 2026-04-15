// NestWorth v5 — Utility Functions

import type { TrendResult } from './types';

/**
 * Format a number as USD currency string.
 * e.g. 82450 => "$82,450", -1200 => "-$1,200"
 */
export function formatCurrency(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return amount < 0 ? `-${formatted}` : formatted;
}

/**
 * Format a number as USD currency with cents.
 * e.g. 67.43 => "$67.43"
 */
export function formatCurrencyExact(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return amount < 0 ? `-${formatted}` : formatted;
}

/**
 * Format a number as a percentage string.
 * e.g. 39 => "39%", 12.5 => "12.5%"
 */
export function formatPercent(value: number): string {
  return `${value}%`;
}

/**
 * XSS prevention — escape HTML entities in a string.
 * Replaces &, <, >, ", and ' with their HTML entity equivalents.
 */
export function esc(s: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return s.replace(/[&<>"']/g, (ch) => map[ch] ?? ch);
}

/**
 * Bounds-checked parseInt. Returns fallback if value is invalid,
 * out of range, or not finite.
 */
export function safeInt(
  val: string | undefined | null,
  min: number,
  max: number,
  fallback: number | null
): number | null {
  if (val === undefined || val === null || val === '') return fallback;
  const n = parseInt(val, 10);
  if (!Number.isFinite(n)) return fallback;
  if (n < min) return fallback;
  if (n > max) return fallback;
  return n;
}

/**
 * Bounds-checked parseFloat. Returns fallback if value is invalid,
 * out of range, or not finite.
 */
export function safeFloat(
  val: string | undefined | null,
  min: number,
  max: number,
  fallback: number | null
): number | null {
  if (val === undefined || val === null || val === '') return fallback;
  const n = parseFloat(val);
  if (!Number.isFinite(n)) return fallback;
  if (n < min) return fallback;
  if (n > max) return fallback;
  return n;
}

/**
 * Compute trend direction and percentage change between two values.
 */
export function trendIndicator(
  current: number,
  previous: number
): TrendResult {
  if (previous === 0) {
    return { direction: 'flat', percent: 0 };
  }
  const pctChange = Math.round(
    ((current - previous) / Math.abs(previous)) * 100
  );
  if (pctChange > 0) return { direction: 'up', percent: pctChange };
  if (pctChange < 0) return { direction: 'down', percent: Math.abs(pctChange) };
  return { direction: 'flat', percent: 0 };
}

/**
 * Conditional className joiner. Filters out falsy values and joins with spaces.
 * e.g. cn('btn', isActive && 'active', className) => "btn active ..."
 */
export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if an object has prototype pollution keys.
 * Used to validate localStorage data before merging.
 */
export function hasPrototypePollution(obj: unknown): boolean {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return false;
  }
  return (
    Object.prototype.hasOwnProperty.call(obj, '__proto__') ||
    Object.prototype.hasOwnProperty.call(obj, 'constructor') ||
    Object.prototype.hasOwnProperty.call(obj, 'prototype')
  );
}
