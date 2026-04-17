'use client';

import React from 'react';
import Link from 'next/link';
import { Card, StatCard, Avatar, Badge, ProgressBar } from '@/components/ui';
import { Sparkline, DonutChart, AreaChart, LineChart } from '@/components/charts';
import {
  nwHistory,
  cashFlow,
  topMerchants,
  transactions,
  achievements,
  monthlySpending,
  budgetCategories,
  savingsRateHistory,
  bills,
} from '@/lib/data';
import { formatCurrency, formatCurrencyExact, trendIndicator } from '@/lib/utils';

/* ---- Computed data ---- */
const currentNW = nwHistory[nwHistory.length - 1].v;
const prevNW = nwHistory[nwHistory.length - 2].v;
const nwTrend = trendIndicator(currentNW, prevNW);
const sparkData = nwHistory.map((p) => p.v);

const totalAllocated = budgetCategories.reduce((a, c) => a + c.allocated, 0);
const totalSpent = budgetCategories.reduce((a, c) => a + c.spent, 0);
const flexBudget = totalAllocated - totalSpent;
const daysRemaining = 13;
const dailySafe = Math.round(flexBudget / daysRemaining);

const savingsRate = savingsRateHistory[savingsRateHistory.length - 1].r;
const prevSavingsRate = savingsRateHistory[savingsRateHistory.length - 2].r;
const completedAch = achievements.filter((a) => a.done).length;

const latestSpend = monthlySpending[monthlySpending.length - 1];
const monthlyTotal = latestSpend.g + latestSpend.d + latestSpend.s + latestSpend.e + latestSpend.t;

const spendingSegments = [
  { label: 'Groceries', value: latestSpend.g, color: 'var(--acc)' },
  { label: 'Dining', value: latestSpend.d, color: 'var(--warn)' },
  { label: 'Shopping', value: latestSpend.s, color: 'var(--neg)' },
  { label: 'Entertainment', value: latestSpend.e, color: 'var(--info)' },
  { label: 'Transport', value: latestSpend.t, color: 'var(--gold)' },
];

const cfIncome = cashFlow.map((p) => ({ label: p.m, value: p.inc }));
const cfExpense = cashFlow.map((p) => ({ label: p.m, value: p.exp }));
const nwChartData = nwHistory.map((p) => ({ label: p.m, value: p.v }));

const whoColor: Record<string, string> = {
  C: 'var(--acc)',
  Ch: 'var(--gold)',
  J: 'var(--info)',
};

const upcomingBills = bills.filter((b) => !b.paid).slice(0, 4);

/* ============================================================ */

export default function HomePage() {
  return (
    <div className="space-y-6">

      {/* ═══════ HERO — Net Worth ═══════ */}
      <section className="nw-hero">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 mb-2">
              Household Net Worth
            </p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-none font-[tabular-nums]">
              {formatCurrency(currentNW)}
            </h1>
            <div className="flex items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold bg-white/15 backdrop-blur-sm rounded-full px-3 py-1">
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" aria-hidden="true">
                  <polyline points={nwTrend.direction === 'up' ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
                </svg>
                +{formatCurrency(currentNW - prevNW)} ({nwTrend.percent}%)
              </span>
              <span className="text-xs opacity-50">this month</span>
            </div>
          </div>
          <div className="w-full sm:w-[180px] h-[60px]">
            <Sparkline data={sparkData} color="rgba(255,255,255,0.8)" height={60} />
          </div>
        </div>
      </section>

      {/* ═══════ STAT CARDS ═══════ */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Safe to Spend" value={formatCurrency(flexBudget)} change={`$${dailySafe}/day for ${daysRemaining} days`} trend="up" />
        <StatCard label="Budget Spent" value={formatCurrency(totalSpent)} change={`${Math.round((totalSpent / totalAllocated) * 100)}% of ${formatCurrency(totalAllocated)}`} trend="flat" />
        <StatCard label="Savings Rate" value={`${savingsRate}%`} change={`${savingsRate > prevSavingsRate ? '+' : ''}${savingsRate - prevSavingsRate}% vs last month`} trend={savingsRate >= prevSavingsRate ? 'up' : 'down'} />
        <StatCard label="Achievements" value={`${completedAch} of ${achievements.length}`} change="14-day budget streak" trend="up" />
      </section>

      {/* ═══════ NET WORTH CHART — Full Width ═══════ */}
      <section>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[var(--t1)]">Net Worth Over Time</h2>
              <p className="text-xs text-[var(--t2)] mt-0.5">12-month household trajectory</p>
            </div>
            <Link href="/forecast" className="text-xs font-semibold text-[var(--acc)] hover:underline">
              Forecast →
            </Link>
          </div>
          <LineChart data={nwChartData} color="var(--acc)" height={200} showArea />
        </Card>
      </section>

      {/* ═══════ TWO-COLUMN DASHBOARD ═══════ */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* ── LEFT COLUMN (3/5) ── */}
        <div className="lg:col-span-3 space-y-5">

          {/* Spending Breakdown */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[var(--t1)]">April Spending</h2>
                <p className="text-xs text-[var(--t2)] mt-0.5">
                  {formatCurrency(monthlyTotal)} of {formatCurrency(totalAllocated)} budget
                </p>
              </div>
              <Link href="/spend" className="text-xs font-semibold text-[var(--acc)] hover:underline">
                Details →
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <DonutChart
                segments={spendingSegments}
                centerText={formatCurrency(monthlyTotal)}
                centerSub="this month"
                size={150}
              />
              <div className="flex-1 w-full space-y-3">
                {budgetCategories.slice(0, 6).map((cat) => (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-medium text-[var(--t1)]">{cat.name}</span>
                      <span className="text-[12px] font-bold text-[var(--t1)] font-[tabular-nums]">
                        {formatCurrency(cat.spent)}
                        <span className="text-[var(--t3)] font-normal"> / {formatCurrency(cat.allocated)}</span>
                      </span>
                    </div>
                    <ProgressBar
                      percent={Math.round((cat.spent / cat.allocated) * 100)}
                      color={cat.spent > cat.allocated ? 'var(--neg)' : cat.spent / cat.allocated > 0.8 ? 'var(--warn)' : 'var(--pos)'}
                      height={4}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Transactions */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[var(--t1)]">Recent Transactions</h2>
                <p className="text-xs text-[var(--t2)] mt-0.5">{transactions.length} transactions this month</p>
              </div>
              <Link href="/transactions" className="text-xs font-semibold text-[var(--acc)] hover:underline">
                View All →
              </Link>
            </div>
            <div className="divide-y divide-[var(--sep)]">
              {transactions.slice(0, 8).map((tx) => (
                <div key={`${tx.who}-${tx.name}-${tx.date}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <Avatar letter={tx.who} size={38} color={whoColor[tx.who] ?? 'var(--t3)'} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-semibold text-[var(--t1)] truncate">{tx.name}</span>
                      {tx.flagged && <Badge text="FLAG" color="var(--neg)" />}
                      {tx.refund && <Badge text="REFUND" color="var(--pos)" />}
                      {tx.income && <Badge text="INCOME" color="var(--pos)" />}
                    </div>
                    <span className="text-[11px] text-[var(--t2)]">{tx.category} · {tx.date}</span>
                  </div>
                  <span className={`text-[13px] font-bold font-[tabular-nums] shrink-0 ${tx.amount > 0 ? 'text-[var(--pos)]' : 'text-[var(--t1)]'}`}>
                    {tx.amount > 0 ? '+' : '−'}{formatCurrencyExact(Math.abs(tx.amount))}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── RIGHT COLUMN (2/5) ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Cash Flow */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[var(--t1)]">Cash Flow</h2>
              <span className="text-xs text-[var(--t2)]">6 months</span>
            </div>
            <AreaChart data1={cfIncome} data2={cfExpense} label1="Income" label2="Expenses" height={180} />
          </Card>

          {/* Upcoming Bills */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[var(--t1)]">Upcoming Bills</h2>
              <span className="text-xs font-semibold text-[var(--warn)]">{upcomingBills.length} due</span>
            </div>
            <div className="divide-y divide-[var(--sep)]">
              {upcomingBills.map((b) => (
                <div key={b.name} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-[13px] font-semibold text-[var(--t1)]">{b.name}</p>
                    <p className="text-[11px] text-[var(--t2)]">Due the {b.dueDay}th</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-bold font-[tabular-nums] text-[var(--t1)]">{formatCurrency(b.amount)}</p>
                    {b.autopay ? (
                      <Badge text="Autopay" color="var(--pos)" />
                    ) : (
                      <Badge text="Manual" color="var(--warn)" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h2 className="text-base font-bold text-[var(--t1)] mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/chargeiq" className="flex items-center gap-3 p-3 rounded-xl bg-[var(--accS)] hover:bg-[color-mix(in_srgb,var(--acc)_12%,transparent)] transition-colors">
                <div className="w-9 h-9 rounded-lg bg-[var(--warn)]/10 flex items-center justify-center shrink-0">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--warn)" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--t1)]">ChargeIQ</p>
                  <p className="text-[11px] text-[var(--t2)]">Identify unknown charges</p>
                </div>
              </Link>
              <Link href="/forecast" className="flex items-center gap-3 p-3 rounded-xl bg-[var(--accS)] hover:bg-[color-mix(in_srgb,var(--acc)_12%,transparent)] transition-colors">
                <div className="w-9 h-9 rounded-lg bg-[var(--pos)]/10 flex items-center justify-center shrink-0">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--pos)" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--t1)]">Cash Forecast</p>
                  <p className="text-[11px] text-[var(--t2)]">90-day projection</p>
                </div>
              </Link>
              <Link href="/credit" className="flex items-center gap-3 p-3 rounded-xl bg-[var(--accS)] hover:bg-[color-mix(in_srgb,var(--acc)_12%,transparent)] transition-colors">
                <div className="w-9 h-9 rounded-lg bg-[var(--info)]/10 flex items-center justify-center shrink-0">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--info)" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--t1)]">Credit Health</p>
                  <p className="text-[11px] text-[var(--t2)]">Track your score</p>
                </div>
              </Link>
            </div>
          </Card>

          {/* Achievements */}
          <Card>
            <h2 className="text-base font-bold text-[var(--t1)] mb-3">Achievements</h2>
            <div className="space-y-2.5">
              {achievements.slice(0, 5).map((ach) => (
                <div key={ach.name} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${ach.done ? 'bg-[var(--pos)] text-white' : 'bg-[var(--sep)] text-[var(--t3)]'}`}>
                    {ach.done ? (
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    ) : (
                      `${ach.progress}%`
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--t1)]">{ach.name}</p>
                    <p className="text-[11px] text-[var(--t2)]">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Merchants */}
          <Card>
            <h2 className="text-base font-bold text-[var(--t1)] mb-3">Top Merchants</h2>
            <div className="divide-y divide-[var(--sep)]">
              {topMerchants.slice(0, 5).map((m, i) => (
                <div key={m.n} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-[var(--accS)] flex items-center justify-center text-[10px] font-bold text-[var(--acc)]">{i + 1}</span>
                    <span className="text-[13px] font-semibold text-[var(--t1)]">{m.n}</span>
                  </div>
                  <span className="text-[13px] font-bold font-[tabular-nums] text-[var(--t1)]">{formatCurrency(m.total)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
