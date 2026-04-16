'use client';

import React, { useMemo, useState } from 'react';
import { Card, StatCard, Badge, Avatar } from '@/components/ui';
import { transactions } from '@/lib/data';
import { formatCurrency, formatCurrencyExact } from '@/lib/utils';

/* ---- Derived data ---- */
const totalExpenses = transactions
  .filter((tx) => tx.amount < 0)
  .reduce((s, tx) => s + Math.abs(tx.amount), 0);
const totalIncome = transactions
  .filter((tx) => tx.amount > 0)
  .reduce((s, tx) => s + tx.amount, 0);
const flaggedCount = transactions.filter((tx) => tx.flagged).length;

/* Who color */
const whoColor: Record<string, string> = {
  V: 'var(--acc)',
  C: 'var(--gold)',
  J: 'var(--info)',
};

/* Category list for filter */
const allCategories = Array.from(new Set(transactions.map((tx) => tx.category))).sort();

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [whoFilter, setWhoFilter] = useState('');

  const filteredTx = useMemo(() => {
    let result = transactions;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.name.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          tx.date.toLowerCase().includes(q),
      );
    }

    if (category) {
      result = result.filter((tx) => tx.category === category);
    }

    if (whoFilter) {
      result = result.filter((tx) => tx.who === whoFilter);
    }

    return result;
  }, [searchTerm, category, whoFilter]);

  return (
    <div className="space-y-4">
      {/* ---- Hero ---- */}
      <div className="nw-hero">
        <p className="text-xs font-semibold opacity-80 mb-0.5">
          All Transactions
        </p>
        <h1 className="text-3xl font-black tracking-tight">
          {transactions.length} Transactions
        </h1>
        <div className="flex items-center gap-4 mt-2 text-xs font-semibold opacity-80">
          <span>Income: {formatCurrency(totalIncome)}</span>
          <span>Expenses: {formatCurrency(totalExpenses)}</span>
        </div>
      </div>

      {/* ---- Stats ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <StatCard label="Total" value={String(transactions.length)} change="This period" trend="flat" />
        <StatCard label="Income" value={formatCurrency(totalIncome)} change={`${transactions.filter((t) => t.amount > 0).length} deposits`} trend="up" />
        <StatCard label="Expenses" value={formatCurrency(totalExpenses)} change={`${transactions.filter((t) => t.amount < 0).length} charges`} trend="down" />
        <StatCard label="Flagged" value={String(flaggedCount)} change={flaggedCount > 0 ? 'Needs review' : 'All clear'} trend={flaggedCount > 0 ? 'down' : 'up'} />
      </div>

      {/* ---- Filters ---- */}
      <div className="flex flex-wrap gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--t3)"
            strokeWidth={2}
            strokeLinecap="round"
            className="absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
          <input
            type="text"
            placeholder="Search transactions..."
            aria-label="Search transactions"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxLength={200}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--cardBg)] border border-[var(--cardBorder)] rounded-xl text-sm text-[var(--t1)] placeholder:text-[var(--t3)] outline-none focus:border-[var(--acc)] transition-colors"
          />
        </div>

        {/* Category filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="px-3 py-2.5 bg-[var(--cardBg)] border border-[var(--cardBorder)] rounded-xl text-sm text-[var(--t1)] outline-none focus:border-[var(--acc)] transition-colors"
        >
          <option value="">All Categories</option>
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Who filter */}
        <div className="flex gap-1">
          {['', 'V', 'C', 'J'].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWhoFilter(w)}
              className={`px-3 py-2 rounded-lg text-[12px] font-semibold transition-all duration-150 ${
                whoFilter === w
                  ? 'bg-[var(--accS)] text-[var(--acc)]'
                  : 'text-[var(--t2)] hover:bg-[var(--accS)]'
              }`}
            >
              {w || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Transaction List ---- */}
      <Card>
        <div className="space-y-0">
          {filteredTx.map((tx) => (
            <div
              key={`${tx.who}-${tx.name}-${tx.date}`}
              className="flex items-center gap-3 py-2.5 border-b border-[var(--sep)] last:border-b-0"
            >
              <Avatar
                letter={tx.who}
                size={28}
                color={whoColor[tx.who] ?? 'var(--t3)'}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-[var(--t1)] truncate">
                    {tx.name}
                  </p>
                  {tx.flagged && <Badge text="FLAG" color="var(--neg)" />}
                  {tx.refund && <Badge text="REFUND" color="var(--pos)" />}
                  {tx.income && <Badge text="INCOME" color="var(--pos)" />}
                </div>
                <p className="text-[11px] text-[var(--t2)]">
                  {tx.category} &middot; {tx.date}
                </p>
              </div>
              <span
                className={`text-sm font-bold font-[tabular-nums] ${
                  tx.amount > 0 ? 'text-[var(--pos)]' : 'text-[var(--t1)]'
                }`}
              >
                {tx.amount > 0 ? '+' : '-'}{formatCurrencyExact(Math.abs(tx.amount))}
              </span>
            </div>
          ))}
          {filteredTx.length === 0 && (
            <p className="text-sm text-[var(--t2)] text-center py-6">
              No transactions match your filters.
            </p>
          )}
        </div>
      </Card>

      {/* ---- Summary ---- */}
      <Card variant="inner">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-[var(--t2)]">
            Showing {filteredTx.length} of {transactions.length} transactions
          </span>
          <span className="text-[13px] font-bold text-[var(--t1)]">
            Net: {formatCurrency(filteredTx.reduce((s, tx) => s + tx.amount, 0))}
          </span>
        </div>
      </Card>
    </div>
  );
}
