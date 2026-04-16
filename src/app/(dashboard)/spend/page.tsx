'use client';

import React from 'react';
import { Card, StatCard, Badge, ProgressBar } from '@/components/ui';
import { BarChart, DonutChart, LineChart } from '@/components/charts';
import {
  budgetCategories,
  monthlyBudgetHistory,
  monthlySpending,
} from '@/lib/data';
import { formatCurrency } from '@/lib/utils';

/* ---- Derived data ---- */
const totalAllocated = budgetCategories.reduce((a, c) => a + c.allocated, 0);
const totalSpent = budgetCategories.reduce((a, c) => a + c.spent, 0);
const remaining = totalAllocated - totalSpent;
const pctUsed = Math.round((totalSpent / totalAllocated) * 100);

const overBudget = budgetCategories.filter((c) => c.over);
const warningCats = budgetCategories.filter((c) => c.warning);

/* Donut for category split */
const catColors = [
  'var(--acc)',
  'var(--warn)',
  'var(--neg)',
  'var(--info)',
  'var(--gold)',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#f97316',
  'var(--t3)',
];
const spendSegments = budgetCategories.map((c, i) => ({
  label: c.name,
  value: c.spent,
  color: catColors[i % catColors.length],
}));

/* Budget history line chart */
const budgetLineData = monthlyBudgetHistory.map((p) => ({
  label: p.m,
  value: p.spent,
}));

/* Stacked bar for monthly trend */
const spendingTrend = monthlySpending.map((ms) => ({
  label: ms.m,
  value: ms.g + ms.d + ms.s + ms.e + ms.t,
  color: 'var(--acc)',
}));

export default function SpendPage() {
  return (
    <div className="space-y-4">
      {/* ---- Hero ---- */}
      <div className="nw-hero">
        <p className="text-xs font-semibold opacity-80 mb-0.5">
          April Budget
        </p>
        <h1 className="text-3xl font-black tracking-tight">
          {formatCurrency(totalSpent)}{' '}
          <span className="text-base font-semibold opacity-70">
            of {formatCurrency(totalAllocated)}
          </span>
        </h1>
        <div className="mt-3 bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-700"
            style={{
              width: `${Math.min(pctUsed, 100)}%`,
              background:
                pctUsed > 90
                  ? 'var(--neg)'
                  : pctUsed > 75
                    ? 'var(--warn)'
                    : 'rgba(255,255,255,0.85)',
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs font-semibold opacity-80">
          <span>{pctUsed}% used</span>
          <span>{formatCurrency(remaining)} remaining</span>
        </div>
      </div>

      {/* ---- Stat cards ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <StatCard
          label="Daily Safe Rate"
          value="$140/day"
          change="12 days left"
          trend="flat"
        />
        <StatCard
          label="Over Budget"
          value={String(overBudget.length)}
          change={overBudget.length > 0 ? overBudget[0].name : 'None'}
          trend={overBudget.length > 0 ? 'down' : 'up'}
        />
        <StatCard
          label="Warnings"
          value={String(warningCats.length)}
          change={warningCats.length > 0 ? warningCats[0].name : 'None'}
          trend={warningCats.length > 0 ? 'down' : 'flat'}
        />
        <StatCard
          label="Projected Surplus"
          value="~$1,000"
          change="At current pace"
          trend="up"
        />
      </div>

      {/* ---- Two columns ---- */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Left: Category breakdown */}
        <div className="space-y-4">
          <Card>
            <p className="text-sm font-bold text-[var(--t1)] mb-3">
              Spending by Category
            </p>
            <DonutChart
              segments={spendSegments}
              centerText={formatCurrency(totalSpent)}
              centerSub={`${pctUsed}% of budget`}
              size={160}
            />
          </Card>

          {/* Category list with progress bars */}
          <Card>
            <p className="text-sm font-bold text-[var(--t1)] mb-3">
              Category Caps
            </p>
            <div className="space-y-3">
              {budgetCategories.map((cat, i) => {
                const pct = Math.round((cat.spent / cat.allocated) * 100);
                const barColor = cat.over
                  ? 'var(--neg)'
                  : cat.warning
                    ? 'var(--warn)'
                    : catColors[i % catColors.length];

                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-semibold text-[var(--t1)]">
                          {cat.name}
                        </span>
                        {cat.fixed && (
                          <Badge text="FIXED" color="var(--t3)" />
                        )}
                        {cat.over && (
                          <Badge text="OVER" color="var(--neg)" />
                        )}
                        {cat.warning && (
                          <Badge text="WARN" color="var(--warn)" />
                        )}
                      </div>
                      <span className="text-[12px] font-bold font-[tabular-nums] text-[var(--t2)]">
                        {formatCurrency(cat.spent)} / {formatCurrency(cat.allocated)}
                      </span>
                    </div>
                    <ProgressBar percent={pct} color={barColor} height={5} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right: Trends */}
        <div className="space-y-4">
          {/* Budget vs spent history */}
          <Card>
            <p className="text-sm font-bold text-[var(--t1)] mb-3">
              Monthly Spend (2024)
            </p>
            <LineChart data={budgetLineData} color="var(--acc)" height={160} />
          </Card>

          {/* Spending trend (6 months) */}
          <Card>
            <p className="text-sm font-bold text-[var(--t1)] mb-3">
              Spending Trend (6 mo)
            </p>
            <BarChart data={spendingTrend} height={180} />
          </Card>

          {/* Budget tips */}
          <Card variant="accent">
            <p className="text-sm font-bold text-[var(--t1)] mb-2">
              Budget Tips
            </p>
            <div className="space-y-2 text-[12px] text-[var(--t2)]">
              <div className="flex items-start gap-2">
                <span className="text-[var(--acc)] mt-0.5">1.</span>
                <p>
                  Shopping is <strong className="text-[var(--neg)]">$35 over cap</strong>. Consider pausing non-essentials.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[var(--acc)] mt-0.5">2.</span>
                <p>
                  Dining Out is <strong className="text-[var(--warn)]">93% used</strong> with 12 days remaining.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[var(--acc)] mt-0.5">3.</span>
                <p>
                  At current pace, you will finish April with approximately <strong className="text-[var(--pos)]">$1,000 surplus</strong>.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
