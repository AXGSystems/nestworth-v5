'use client';

import React from 'react';
import { Card, StatCard, Badge, ProgressBar } from '@/components/ui';
import { LineChart, BarChart, AreaChart } from '@/components/charts';
import {
  nests,
  savingsRateHistory,
  actualSavings,
  projectedSavings,
} from '@/lib/data';
import { formatCurrency, trendIndicator } from '@/lib/utils';

/* ---- Derived data ---- */
const totalSaved = nests.reduce((a, n) => a + n.current, 0);
const totalGoals = nests.reduce((a, n) => a + n.goal, 0);
const overallPct = Math.round((totalSaved / totalGoals) * 100);

const latestRate = savingsRateHistory[savingsRateHistory.length - 1].r;
const prevRate = savingsRateHistory[savingsRateHistory.length - 2].r;
const rateTrend = trendIndicator(latestRate, prevRate);

const latestActual = actualSavings[actualSavings.length - 1].v;

/* Emergency fund: first nest */
const emergency = nests[0];
const emergencyPct = Math.round((emergency.current / emergency.goal) * 100);

/* Savings rate line chart */
const rateChartData = savingsRateHistory.map((p) => ({
  label: p.m,
  value: p.r,
}));

/* Projected vs actual savings */
const actualChartData = actualSavings.map((p) => ({
  label: p.m,
  value: p.v,
}));
const projChartData = projectedSavings.slice(0, 4).map((p) => ({
  label: p.m,
  value: p.proj,
}));

/* Nests as horizontal bar */
const nestBarData = nests.map((n) => ({
  label: n.name,
  value: n.current,
  color: n.current >= n.goal ? 'var(--pos)' : 'var(--acc)',
}));

/* Nest colors */
const nestColors = [
  'var(--neg)',
  'var(--info)',
  'var(--acc)',
  'var(--gold)',
  '#8b5cf6',
  '#ec4899',
];

export default function SavePage() {
  return (
    <div className="space-y-5">
      {/* ---- Hero ---- */}
      <div className="nw-hero">
        <p className="text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">
          Total Saved Across Nests
        </p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
          {formatCurrency(totalSaved)}{' '}
          <span className="text-base font-semibold opacity-60">
            of {formatCurrency(totalGoals)}
          </span>
        </h1>
        <div className="mt-4 bg-white/10 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-white/85 transition-[width] duration-700"
            style={{ width: `${Math.min(overallPct, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2.5 text-[13px] font-semibold opacity-80">
          <span>{overallPct}% of all goals</span>
          <span>{formatCurrency(totalGoals - totalSaved)} to go</span>
        </div>
      </div>

      {/* ---- Stat cards ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Savings Rate"
          value={`${latestRate}%`}
          change={`${rateTrend.direction === 'up' ? '+' : ''}${rateTrend.percent}% vs last mo`}
          trend={rateTrend.direction}
        />
        <StatCard
          label="Saved This Year"
          value={formatCurrency(latestActual)}
          change="Since January"
          trend="up"
        />
        <StatCard
          label="Emergency Fund"
          value={`${emergencyPct}%`}
          change={`${formatCurrency(emergency.current)} of ${formatCurrency(emergency.goal)}`}
          trend={emergencyPct >= 100 ? 'up' : 'flat'}
        />
        <StatCard
          label="Active Nests"
          value={String(nests.length)}
          change="Auto-saving daily"
          trend="up"
        />
      </div>

      {/* ---- Two columns ---- */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Left: Nests */}
        <div className="space-y-5">
          {/* Nest cards */}
          <Card>
            <div className="nw-section-header">
              <span>Savings Nests</span>
            </div>
            <div className="space-y-3">
              {nests.map((nest, i) => {
                const pct = Math.round((nest.current / nest.goal) * 100);
                return (
                  <Card key={nest.name} variant="inner">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ background: nestColors[i % nestColors.length] }}
                        />
                        <span className="text-[14px] font-bold text-[var(--t1)]">
                          {nest.name}
                        </span>
                      </div>
                      <Badge
                        text={`${pct}%`}
                        color={pct >= 80 ? 'var(--pos)' : pct >= 50 ? 'var(--warn)' : 'var(--acc)'}
                      />
                    </div>
                    <ProgressBar
                      percent={pct}
                      color={nestColors[i % nestColors.length]}
                      height={6}
                    />
                    <div className="flex items-center justify-between mt-2 text-[12px] text-[var(--t2)]">
                      <span>
                        {formatCurrency(nest.current)} / {formatCurrency(nest.goal)}
                      </span>
                      <span>
                        ${nest.autoAmount}/{nest.frequency}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>

          {/* Nest bar chart */}
          <Card>
            <div className="nw-section-header">
              <span>Nest Progress</span>
            </div>
            <BarChart data={nestBarData} horizontal height={220} />
          </Card>
        </div>

        {/* Right: Trends */}
        <div className="space-y-5">
          {/* Savings rate trend */}
          <Card>
            <div className="nw-section-header">
              <span>Savings Rate (6 mo)</span>
            </div>
            <LineChart data={rateChartData} color="var(--pos)" height={160} />
          </Card>

          {/* Actual savings YTD */}
          <Card>
            <div className="nw-section-header">
              <span>Actual vs Projected Savings</span>
            </div>
            <AreaChart
              data1={actualChartData}
              data2={projChartData}
              color1="var(--pos)"
              color2="var(--acc)"
              label1="Actual"
              label2="Projected"
              height={180}
            />
          </Card>

          {/* Emergency fund detail */}
          <Card variant="accent">
            <div className="nw-section-header">
              <span>Emergency Fund</span>
            </div>
            <div className="mb-3">
              <ProgressBar percent={emergencyPct} color="var(--neg)" height={8} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="nw-card-inner py-3">
                <p className="text-xl font-black text-[var(--t1)]">
                  {formatCurrency(emergency.current)}
                </p>
                <p className="text-[11px] text-[var(--t2)] mt-0.5">Saved</p>
              </div>
              <div className="nw-card-inner py-3">
                <p className="text-xl font-black text-[var(--t1)]">
                  {formatCurrency(emergency.goal)}
                </p>
                <p className="text-[11px] text-[var(--t2)] mt-0.5">Target</p>
              </div>
            </div>
            <p className="text-[12px] text-[var(--t2)] mt-3">
              Auto-saving ${emergency.autoAmount}/{emergency.frequency}. At this
              pace, you will reach your goal in approximately{' '}
              {Math.ceil(
                (emergency.goal - emergency.current) / (emergency.autoAmount * 30),
              )}{' '}
              months.
            </p>
          </Card>

          {/* Debt payoff teaser */}
          <Card>
            <div className="nw-section-header">
              <span>Debt Snapshot</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[var(--t2)]">
                  Credit Cards
                </span>
                <span className="text-[14px] font-bold text-[var(--neg)]">
                  -$1,200
                </span>
              </div>
              <ProgressBar percent={65} color="var(--warn)" height={6} />
              <p className="text-[12px] text-[var(--t2)]">
                65% toward debt-free goal. Projected payoff: August 2024.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
