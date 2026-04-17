'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, StatCard, Avatar, Badge } from '@/components/ui';
import { Sparkline, DonutChart, AreaChart } from '@/components/charts';
import {
  nwHistory,
  cashFlow,
  topMerchants,
  transactions,
  achievements,
  monthlySpending,
  budgetCategories,
  savingsRateHistory,
} from '@/lib/data';
import { formatCurrency, formatCurrencyExact, trendIndicator } from '@/lib/utils';
import { useNestWorthStore } from '@/lib/store';

/* ---- Derived / computed data (Issue 11) ---- */
const currentNW = nwHistory[nwHistory.length - 1].v;
const prevNW = nwHistory[nwHistory.length - 2].v;
const nwTrend = trendIndicator(currentNW, prevNW);
const sparkData = nwHistory.map((p) => p.v);

/* Compute stats from data instead of hardcoding */
const totalAllocated = budgetCategories.reduce((a, c) => a + c.allocated, 0);
const totalSpent = budgetCategories.reduce((a, c) => a + c.spent, 0);
const flexBudget = totalAllocated - totalSpent;
const daysRemaining = 12; // days left in April
const dailySafe = Math.round(flexBudget / daysRemaining);

const latestCF = cashFlow[cashFlow.length - 1];
const savingsRate = savingsRateHistory[savingsRateHistory.length - 1].r;
const prevSavingsRate = savingsRateHistory[savingsRateHistory.length - 2].r;

const completedAch = achievements.filter((a) => a.done).length;

const latestSpend = monthlySpending[monthlySpending.length - 1];
const monthlyTotal = latestSpend.g + latestSpend.d + latestSpend.s + latestSpend.e + latestSpend.t;

/* Spending by category donut */
const spendingSegments = [
  { label: 'Groceries', value: latestSpend.g, color: 'var(--acc)' },
  { label: 'Dining', value: latestSpend.d, color: 'var(--warn)' },
  { label: 'Shopping', value: latestSpend.s, color: 'var(--neg)' },
  { label: 'Entertainment', value: latestSpend.e, color: 'var(--info)' },
  { label: 'Transport', value: latestSpend.t, color: 'var(--gold)' },
];

/* Cash flow chart data */
const cfIncome = cashFlow.map((p) => ({ label: p.m, value: p.inc }));
const cfExpense = cashFlow.map((p) => ({ label: p.m, value: p.exp }));

/* Transaction who-color map */
const whoColor: Record<string, string> = {
  C: 'var(--acc)',
  Ch: 'var(--gold)',
  J: 'var(--info)',
};

/* Quick link configs */
const quickLinks = [
  {
    label: 'ChargeIQ',
    icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    bg: 'rgba(255, 159, 10, 0.12)',
    iconColor: 'var(--warn)',
    key: 'chargeiq',
  },
  {
    label: 'Bills',
    icon: 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z M16 2v4 M8 2v4 M3 10h18',
    bg: 'rgba(52, 199, 89, 0.12)',
    iconColor: 'var(--pos)',
    key: 'bills',
  },
  {
    label: 'Goals',
    icon: 'M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h6v2h4v-3.5c2-1.5 2-2.7 2-4.5 0-2.5-1-4-4-5z',
    bg: 'rgba(10, 132, 255, 0.12)',
    iconColor: 'var(--info)',
    key: 'save',
  },
  {
    label: 'Coach',
    icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    bg: 'var(--accS)',
    iconColor: 'var(--acc)',
    key: 'coach',
  },
];

export default function HomePage() {
  const router = useRouter();
  const setPage = useNestWorthStore((s) => s.setPage);

  function handleQuickLink(key: string) {
    if (key === 'bills') {
      setPage('bills');
    } else {
      router.push(`/${key}`);
    }
  }

  return (
    <div className="space-y-5">
      {/* ---- Hero ---- */}
      <div className="nw-hero">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">
              Household Net Worth
            </p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
              {formatCurrency(currentNW)}
            </h1>
          </div>
          <div className="w-[100px] sm:w-[120px]">
            <Sparkline data={sparkData} color="rgba(255,255,255,0.85)" />
          </div>
        </div>
        <div className="inline-flex items-center gap-2 text-[13px] font-semibold bg-white/10 backdrop-blur-sm rounded-full px-3.5 py-1.5">
          <svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <polyline
              points={nwTrend.direction === 'up' ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}
            />
          </svg>
          <span>
            {nwTrend.direction === 'up' ? '+' : '-'}
            {formatCurrency(Math.abs(currentNW - prevNW))} ({nwTrend.percent}%)
            this month
          </span>
        </div>
      </div>

      {/* ---- Stat cards row (computed from data) ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Flex Budget"
          value={formatCurrency(flexBudget)}
          change={`${Math.round((totalSpent / totalAllocated) * 100)}% used`}
          trend="flat"
        />
        <StatCard
          label="Spending"
          value={formatCurrency(monthlyTotal)}
          change={`$${dailySafe}/day safe`}
          trend="down"
        />
        <StatCard
          label="Savings Rate"
          value={`${savingsRate}%`}
          change={`${savingsRate > prevSavingsRate ? '+' : ''}${savingsRate - prevSavingsRate}% vs last mo`}
          trend={savingsRate >= prevSavingsRate ? 'up' : 'down'}
        />
        <StatCard
          label="Wellness"
          value={`${completedAch}/${achievements.length}`}
          change="Budget streak: 14d"
          trend="up"
        />
      </div>

      {/* ---- Quick links ---- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickLinks.map((q) => (
          <button
            key={q.label}
            type="button"
            onClick={() => handleQuickLink(q.key)}
            className="nw-quick-link"
          >
            <div
              className="nw-quick-link-icon"
              style={{ background: q.bg }}
            >
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke={q.iconColor}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={q.icon} />
              </svg>
            </div>
            <span className="text-[13px] font-semibold text-[var(--t1)]">
              {q.label}
            </span>
          </button>
        ))}
      </div>

      {/* ---- Two-column layout ---- */}
      <div className="grid lg:grid-cols-[3fr_2fr] gap-5">
        {/* Left column */}
        <div className="space-y-5">
          {/* Spending donut */}
          <Card>
            <div className="nw-section-header">
              <span>April Spending</span>
              <span className="nw-view-all" onClick={() => router.push('/spend')}>
                View All &rarr;
              </span>
            </div>
            <DonutChart
              segments={spendingSegments}
              centerText={formatCurrency(monthlyTotal)}
              centerSub={`of ${formatCurrency(totalAllocated)}`}
              size={160}
            />
          </Card>

          {/* Recent transactions */}
          <Card>
            <div className="nw-section-header">
              <span>Recent Transactions</span>
              <span className="nw-view-all" onClick={() => router.push('/transactions')}>
                View All &rarr;
              </span>
            </div>
            <div>
              {transactions.slice(0, 8).map((tx) => (
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
                      tx.amount > 0
                        ? 'text-[var(--pos)]'
                        : 'text-[var(--t1)]'
                    }`}
                  >
                    {tx.amount > 0 ? '+' : '-'}{formatCurrencyExact(Math.abs(tx.amount))}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Cash flow */}
          <Card>
            <div className="nw-section-header">
              <span>Cash Flow (6 mo)</span>
            </div>
            <AreaChart
              data1={cfIncome}
              data2={cfExpense}
              label1="Income"
              label2="Expenses"
            />
          </Card>

          {/* Wellness / achievements */}
          <Card>
            <div className="nw-section-header">
              <span>Achievements</span>
            </div>
            <div className="space-y-2">
              {achievements.slice(0, 6).map((ach) => (
                <div
                  key={ach.name}
                  className="nw-achievement"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] ${
                      ach.done
                        ? 'bg-[var(--pos)] text-white'
                        : 'bg-[var(--sep)] text-[var(--t3)]'
                    }`}
                  >
                    {ach.done ? (
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span className="font-bold">{ach.progress}%</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--t1)]">
                      {ach.name}
                    </p>
                    <p className="text-[11px] text-[var(--t2)]">
                      {ach.description}
                    </p>
                  </div>
                  {ach.done && (
                    <span className="text-[10px] font-medium text-[var(--t3)] bg-[var(--accS)] px-2 py-0.5 rounded-md whitespace-nowrap shrink-0">
                      {ach.date}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Top merchants */}
          <Card>
            <div className="nw-section-header">
              <span>Top Merchants</span>
            </div>
            <div>
              {topMerchants.slice(0, 6).map((m, i) => (
                <div
                  key={m.n}
                  className="nw-table-row"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[var(--accS)] flex items-center justify-center text-[11px] font-bold text-[var(--acc)]">
                      {i + 1}
                    </span>
                    <span className="text-[14px] font-semibold text-[var(--t1)]">
                      {m.n}
                    </span>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="text-[14px] font-bold font-[tabular-nums] text-[var(--t1)]">
                      {formatCurrency(m.total)}
                    </span>
                    <span className="text-[11px] text-[var(--t2)] bg-[var(--accS)] px-2 py-0.5 rounded-md">
                      {m.count}x
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
