'use client';

import React from 'react';
import { Card, StatCard, Avatar, Badge } from '@/components/ui';
import { Sparkline, DonutChart, AreaChart } from '@/components/charts';
import {
  nwHistory,
  cashFlow,
  topMerchants,
  transactions,
  achievements,
  monthlySpending,
} from '@/lib/data';
import { formatCurrency, trendIndicator } from '@/lib/utils';

/* ---- Derived data ---- */
const currentNW = nwHistory[nwHistory.length - 1].v;
const prevNW = nwHistory[nwHistory.length - 2].v;
const nwTrend = trendIndicator(currentNW, prevNW);
const sparkData = nwHistory.map((p) => p.v);

const latestSpend = monthlySpending[monthlySpending.length - 1];
const totalSpent = latestSpend.g + latestSpend.d + latestSpend.s + latestSpend.e + latestSpend.t;

const completedAch = achievements.filter((a) => a.done).length;

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
  V: 'var(--acc)',
  C: 'var(--gold)',
  J: 'var(--info)',
};

export default function HomePage() {
  return (
    <div className="space-y-4">
      {/* ---- Hero ---- */}
      <div className="nw-hero">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs font-semibold opacity-80 mb-0.5">
              Household Net Worth
            </p>
            <p className="text-3xl font-black tracking-tight">
              {formatCurrency(currentNW)}
            </p>
          </div>
          <div className="w-[80px]">
            <Sparkline data={sparkData} color="rgba(255,255,255,0.85)" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold opacity-90">
          <svg
            width={10}
            height={10}
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

      {/* ---- Stat cards row ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <StatCard
          label="Flex Budget"
          value="$1,680"
          change="63% used"
          trend="flat"
        />
        <StatCard
          label="Spending"
          value={formatCurrency(totalSpent)}
          change="$480 groceries"
          trend="down"
        />
        <StatCard
          label="Savings Rate"
          value="39%"
          change="+1% vs last mo"
          trend="up"
        />
        <StatCard
          label="Wellness"
          value={`${completedAch}/${achievements.length}`}
          change="Budget streak: 14d"
          trend="up"
        />
      </div>

      {/* ---- Quick links ---- */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'ChargeIQ', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
          { label: 'Bills', icon: 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z M16 2v4 M8 2v4 M3 10h18' },
          { label: 'Goals', icon: 'M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h6v2h4v-3.5c2-1.5 2-2.7 2-4.5 0-2.5-1-4-4-5z' },
          { label: 'Coach', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
        ].map((q) => (
          <Card key={q.label} onClick={() => {}}>
            <div className="flex flex-col items-center gap-1 py-1">
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--acc)"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={q.icon} />
              </svg>
              <span className="text-[11px] font-semibold text-[var(--t1)]">
                {q.label}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* ---- Two-column layout ---- */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-4">
          {/* Spending donut */}
          <Card>
            <p className="text-sm font-bold text-[var(--t1)] mb-3">
              April Spending
            </p>
            <DonutChart
              segments={spendingSegments}
              centerText={formatCurrency(totalSpent)}
              centerSub="of $4,600"
              size={160}
            />
          </Card>

          {/* Recent transactions */}
          <Card>
            <p className="text-sm font-bold text-[var(--t1)] mb-3">
              Recent Transactions
            </p>
            <div className="space-y-0">
              {transactions.slice(0, 8).map((tx, i) => (
                <div
                  key={i}
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
                      tx.amount.startsWith('+')
                        ? 'text-[var(--pos)]'
                        : 'text-[var(--t1)]'
                    }`}
                  >
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Cash flow */}
          <Card>
            <p className="text-sm font-bold text-[var(--t1)] mb-3">
              Cash Flow (6 mo)
            </p>
            <AreaChart
              data1={cfIncome}
              data2={cfExpense}
              label1="Income"
              label2="Expenses"
            />
          </Card>

          {/* Wellness / achievements */}
          <Card>
            <p className="text-sm font-bold text-[var(--t1)] mb-3">
              Achievements
            </p>
            <div className="space-y-2">
              {achievements.slice(0, 6).map((ach, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 py-1.5"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] ${
                      ach.done
                        ? 'bg-[var(--pos)] text-white'
                        : 'bg-[var(--sep)] text-[var(--t3)]'
                    }`}
                  >
                    {ach.done ? (
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
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span className="font-bold">{ach.progress}%</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[var(--t1)]">
                      {ach.name}
                    </p>
                    <p className="text-[10px] text-[var(--t2)]">
                      {ach.description}
                    </p>
                  </div>
                  {ach.done && (
                    <span className="text-[10px] font-medium text-[var(--t3)]">
                      {ach.date}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Top merchants */}
          <Card>
            <p className="text-sm font-bold text-[var(--t1)] mb-3">
              Top Merchants
            </p>
            <div className="space-y-0">
              {topMerchants.slice(0, 6).map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-[var(--sep)] last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-[var(--accS)] flex items-center justify-center text-[10px] font-bold text-[var(--acc)]">
                      {i + 1}
                    </span>
                    <span className="text-[13px] font-semibold text-[var(--t1)]">
                      {m.n}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[13px] font-bold font-[tabular-nums] text-[var(--t1)]">
                      {formatCurrency(m.total)}
                    </span>
                    <span className="text-[10px] text-[var(--t2)] ml-1.5">
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
