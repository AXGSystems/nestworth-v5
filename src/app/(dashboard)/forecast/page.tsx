'use client';

import React from 'react';
import { Card, StatCard } from '@/components/ui';
import { AreaChart, LineChart, BarChart } from '@/components/charts';
import {
  nwHistory,
  cashFlow,
  projectedSavings,
  actualSavings,
  budgetCategories,
  savingsRateHistory,
} from '@/lib/data';
import { formatCurrency, trendIndicator } from '@/lib/utils';

/* ---- Derived data ---- */
const currentNW = nwHistory[nwHistory.length - 1].v;
const monthlyIncome = cashFlow[cashFlow.length - 1].inc;
const monthlyExpenses = cashFlow[cashFlow.length - 1].exp;
const monthlySavings = monthlyIncome - monthlyExpenses;
const latestRate = savingsRateHistory[savingsRateHistory.length - 1].r;

/* 90-day projection */
const projectionMonths = [
  { label: 'May', offset: 1 },
  { label: 'Jun', offset: 2 },
  { label: 'Jul', offset: 3 },
];

const nwProjection = projectionMonths.map((pm) => ({
  label: pm.label,
  value: Math.round(currentNW + monthlySavings * pm.offset),
}));

const nwActual = nwHistory.slice(-4).map((p) => ({
  label: p.m,
  value: p.v,
}));

/* Cash flow chart */
const cfIncome = cashFlow.map((p) => ({ label: p.m, value: p.inc }));
const cfExpense = cashFlow.map((p) => ({ label: p.m, value: p.exp }));

/* Savings rate */
const rateData = savingsRateHistory.map((p) => ({
  label: p.m,
  value: p.r,
}));

/* Actual vs projected savings */
const actualData = actualSavings.map((p) => ({
  label: p.m,
  value: p.v,
}));
const projData = projectedSavings.slice(0, 4).map((p) => ({
  label: p.m,
  value: p.proj,
}));

/* Monthly net */
const monthlyNetData = cashFlow.map((p) => ({
  label: p.m,
  value: p.inc - p.exp,
  color: p.inc - p.exp > 0 ? 'var(--pos)' : 'var(--neg)',
}));

/* End of year projection */
const monthsLeft = 8; // May through Dec
const eoyProjected = Math.round(currentNW + monthlySavings * monthsLeft);

/* With bill audit savings ($209/mo) */
const billAuditSavings = 209;
const eoyWithSavings = Math.round(eoyProjected + billAuditSavings * monthsLeft);

const totalBudget = budgetCategories.reduce((a, c) => a + c.allocated, 0);
const totalSpent = budgetCategories.reduce((a, c) => a + c.spent, 0);

export default function ForecastPage() {
  return (
    <div className="space-y-4">
      {/* ---- Hero ---- */}
      <div className="nw-hero">
        <p className="text-xs font-semibold opacity-80 mb-0.5">
          Cash Forecast
        </p>
        <h1 className="text-3xl font-black tracking-tight">
          90-Day Projection
        </h1>
        <div className="flex items-center gap-4 mt-2 text-xs font-semibold opacity-80">
          <span>Current NW: {formatCurrency(currentNW)}</span>
          <span>Monthly Savings: {formatCurrency(monthlySavings)}</span>
        </div>
      </div>

      {/* ---- Stats ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <StatCard
          label="End of Q2"
          value={formatCurrency(Math.round(currentNW + monthlySavings * 2))}
          change="Jun 2024"
          trend="up"
        />
        <StatCard
          label="End of Year"
          value={formatCurrency(eoyProjected)}
          change="Dec 2024"
          trend="up"
        />
        <StatCard
          label="With Bill Audit"
          value={formatCurrency(eoyWithSavings)}
          change={`+${formatCurrency(billAuditSavings * monthsLeft)}`}
          trend="up"
        />
        <StatCard
          label="Savings Rate"
          value={`${latestRate}%`}
          change="Current pace"
          trend="up"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Net Worth Projection */}
        <Card>
          <p className="text-sm font-bold text-[var(--t1)] mb-3">
            Net Worth: Actual vs Projected
          </p>
          <AreaChart
            data1={nwActual}
            data2={nwProjection}
            color1="var(--acc)"
            color2="var(--info)"
            label1="Actual"
            label2="Projected"
            height={200}
          />
        </Card>

        {/* Cash Flow */}
        <Card>
          <p className="text-sm font-bold text-[var(--t1)] mb-3">
            Cash Flow (6 mo)
          </p>
          <AreaChart
            data1={cfIncome}
            data2={cfExpense}
            label1="Income"
            label2="Expenses"
            height={200}
          />
        </Card>

        {/* Monthly Net */}
        <Card>
          <p className="text-sm font-bold text-[var(--t1)] mb-3">
            Monthly Net (Income - Expenses)
          </p>
          <BarChart data={monthlyNetData} height={180} />
        </Card>

        {/* Savings Rate */}
        <Card>
          <p className="text-sm font-bold text-[var(--t1)] mb-3">
            Savings Rate Trend
          </p>
          <LineChart data={rateData} color="var(--pos)" height={180} />
        </Card>

        {/* Savings: Actual vs Projected */}
        <Card>
          <p className="text-sm font-bold text-[var(--t1)] mb-3">
            Savings: Actual vs Projected
          </p>
          <AreaChart
            data1={actualData}
            data2={projData}
            color1="var(--pos)"
            color2="var(--acc)"
            label1="Actual"
            label2="Projected"
            height={180}
          />
        </Card>

        {/* Forecast Summary */}
        <Card variant="accent">
          <p className="text-sm font-bold text-[var(--t1)] mb-3">
            Forecast Summary
          </p>
          <div className="space-y-3 text-[12px] text-[var(--t2)]">
            <div className="flex items-center justify-between py-1.5 border-b border-[var(--sep)]">
              <span>Monthly Income</span>
              <span className="font-bold text-[var(--pos)]">{formatCurrency(monthlyIncome)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[var(--sep)]">
              <span>Monthly Expenses</span>
              <span className="font-bold text-[var(--neg)]">{formatCurrency(monthlyExpenses)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[var(--sep)]">
              <span>Monthly Net</span>
              <span className="font-bold text-[var(--t1)]">{formatCurrency(monthlySavings)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[var(--sep)]">
              <span>Budget Used</span>
              <span className="font-bold text-[var(--t1)]">{Math.round((totalSpent / totalBudget) * 100)}%</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span>End of Year (projected)</span>
              <span className="font-bold text-[var(--acc)]">{formatCurrency(eoyProjected)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 bg-[var(--accS)] -mx-4 px-4 rounded-lg">
              <span className="font-semibold">With bill audit savings</span>
              <span className="font-bold text-[var(--pos)]">{formatCurrency(eoyWithSavings)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
