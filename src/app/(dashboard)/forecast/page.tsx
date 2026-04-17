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
    <div className="space-y-5">
      {/* ---- Hero ---- */}
      <div className="nw-hero">
        <p className="text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">
          Cash Forecast
        </p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
          90-Day Projection
        </h1>
        <div className="flex items-center gap-4 mt-2 text-[13px] font-semibold opacity-80">
          <span>Current NW: {formatCurrency(currentNW)}</span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span>Monthly Savings: {formatCurrency(monthlySavings)}</span>
        </div>
      </div>

      {/* ---- Stats ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Net Worth Projection */}
        <Card>
          <div className="nw-section-header">
            <span>Net Worth: Actual vs Projected</span>
          </div>
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
          <div className="nw-section-header">
            <span>Cash Flow (6 mo)</span>
          </div>
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
          <div className="nw-section-header">
            <span>Monthly Net (Income - Expenses)</span>
          </div>
          <BarChart data={monthlyNetData} height={180} />
        </Card>

        {/* Savings Rate */}
        <Card>
          <div className="nw-section-header">
            <span>Savings Rate Trend</span>
          </div>
          <LineChart data={rateData} color="var(--pos)" height={180} />
        </Card>

        {/* Savings: Actual vs Projected */}
        <Card>
          <div className="nw-section-header">
            <span>Savings: Actual vs Projected</span>
          </div>
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
          <div className="nw-section-header">
            <span>Forecast Summary</span>
          </div>
          <div className="space-y-0">
            <div className="nw-table-row">
              <span className="text-[13px] text-[var(--t2)]">Monthly Income</span>
              <span className="text-[14px] font-bold text-[var(--pos)] font-[tabular-nums]">{formatCurrency(monthlyIncome)}</span>
            </div>
            <div className="nw-table-row">
              <span className="text-[13px] text-[var(--t2)]">Monthly Expenses</span>
              <span className="text-[14px] font-bold text-[var(--neg)] font-[tabular-nums]">{formatCurrency(monthlyExpenses)}</span>
            </div>
            <div className="nw-table-row">
              <span className="text-[13px] text-[var(--t2)]">Monthly Net</span>
              <span className="text-[14px] font-bold text-[var(--t1)] font-[tabular-nums]">{formatCurrency(monthlySavings)}</span>
            </div>
            <div className="nw-table-row">
              <span className="text-[13px] text-[var(--t2)]">Budget Used</span>
              <span className="text-[14px] font-bold text-[var(--t1)] font-[tabular-nums]">{Math.round((totalSpent / totalBudget) * 100)}%</span>
            </div>
            <div className="nw-table-row">
              <span className="text-[13px] text-[var(--t2)]">End of Year (projected)</span>
              <span className="text-[14px] font-bold text-[var(--acc)] font-[tabular-nums]">{formatCurrency(eoyProjected)}</span>
            </div>
            <div className="flex items-center justify-between py-3.5 bg-[var(--accS)] -mx-5 px-5 rounded-xl mt-2" style={{ minHeight: 52 }}>
              <span className="text-[13px] font-semibold text-[var(--t1)]">With bill audit savings</span>
              <span className="text-[14px] font-bold text-[var(--pos)] font-[tabular-nums]">{formatCurrency(eoyWithSavings)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
