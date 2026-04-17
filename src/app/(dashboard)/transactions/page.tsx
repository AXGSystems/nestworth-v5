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
  C: 'var(--acc)',
  Ch: 'var(--gold)',
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
    <div className="space-y-5">
      {/* ---- Hero ---- */}
      <div className="nw-hero">
        <p className="text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">
          All Transactions
        </p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
          {transactions.length} Transactions
        </h1>
        <div className="flex items-center gap-4 mt-2 text-[13px] font-semibold opacity-80">
          <span>Income: {formatCurrency(totalIncome)}</span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span>Expenses: {formatCurrency(totalExpenses)}</span>
        </div>
      </div>

      {/* ---- Stats ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total" value={String(transactions.length)} change="This period" trend="flat" />
        <StatCard label="Income" value={formatCurrency(totalIncome)} change={`${transactions.filter((t) => t.amount > 0).length} deposits`} trend="up" />
        <StatCard label="Expenses" value={formatCurrency(totalExpenses)} change={`${transactions.filter((t) => t.amount < 0).length} charges`} trend="down" />
        <StatCard label="Flagged" value={String(flaggedCount)} change={flaggedCount > 0 ? 'Needs review' : 'All clear'} trend={flaggedCount > 0 ? 'down' : 'up'} />
      </div>

      {/* ---- Filters ---- */}
      <Card className="!p-4">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0 sm:min-w-[220px]">
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--t3)"
              strokeWidth={2}
              strokeLinecap="round"
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
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
              className="nw-input !pl-10"
            />
          </div>

          {/* Category filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            className="nw-input !w-auto"
          >
            <option value="">All Categories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Who filter */}
          <div className="flex gap-1.5">
            {['', 'C', 'Ch', 'J'].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWhoFilter(w)}
                className={`px-3.5 py-2.5 rounded-xl text-[12px] font-semibold transition-all duration-150 min-h-[44px] min-w-[44px] ${
                  whoFilter === w
                    ? 'bg-[var(--acc)] text-white shadow-sm'
                    : 'bg-[var(--accS)] text-[var(--t2)] hover:bg-[var(--cardBgH)]'
                }`}
              >
                {w || 'All'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* ---- Transaction List ---- */}
      <Card>
        <div>
          {filteredTx.map((tx) => (
            <div
              key={`${tx.who}-${tx.name}-${tx.date}`}
              className="nw-tx-row"
            >
              <Avatar
                letter={tx.who}
                size={36}
                color={whoColor[tx.who] ?? 'var(--t3)'}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[14px] font-semibold text-[var(--t1)] truncate">
                    {tx.name}
                  </p>
                  {tx.flagged && <Badge text="FLAG" color="var(--neg)" />}
                  {tx.refund && <Badge text="REFUND" color="var(--pos)" />}
                  {tx.income && <Badge text="INCOME" color="var(--pos)" />}
                </div>
                <p className="text-[12px] text-[var(--t2)] mt-0.5">
                  {tx.category} &middot; {tx.date}
                </p>
              </div>
              <span
                className={`text-[14px] font-bold font-[tabular-nums] ${
                  tx.amount > 0 ? 'text-[var(--pos)]' : 'text-[var(--t1)]'
                }`}
              >
                {tx.amount > 0 ? '+' : '-'}{formatCurrencyExact(Math.abs(tx.amount))}
              </span>
            </div>
          ))}
          {filteredTx.length === 0 && (
            <p className="text-[14px] text-[var(--t2)] text-center py-8">
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
          <span className="text-[14px] font-bold font-[tabular-nums] text-[var(--t1)]">
            Net: {formatCurrency(filteredTx.reduce((s, tx) => s + tx.amount, 0))}
          </span>
        </div>
      </Card>
    </div>
  );
}
