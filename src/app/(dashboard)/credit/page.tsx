'use client';

import React, { useState } from 'react';
import { Card, StatCard, Badge, ProgressBar } from '@/components/ui';
import { LineChart } from '@/components/charts';
import { useNestWorthStore } from '@/lib/store';

/* Credit score color */
function scoreColor(score: number): string {
  if (score >= 750) return 'var(--pos)';
  if (score >= 670) return 'var(--acc)';
  if (score >= 580) return 'var(--warn)';
  return 'var(--neg)';
}

function scoreLabel(score: number): string {
  if (score >= 750) return 'Excellent';
  if (score >= 670) return 'Good';
  if (score >= 580) return 'Fair';
  return 'Poor';
}

export default function CreditPage() {
  const creditScoreHistory = useNestWorthStore((s) => s.creditScoreHistory);
  const addCreditScore = useNestWorthStore((s) => s.addCreditScore);
  const [scoreInput, setScoreInput] = useState('');

  const latestScore = creditScoreHistory.length > 0 ? creditScoreHistory[0].score : 742;
  const prevScore = creditScoreHistory.length > 1 ? creditScoreHistory[1].score : 738;
  const change = latestScore - prevScore;

  /* Chart data from history */
  const chartData = creditScoreHistory.length >= 2
    ? [...creditScoreHistory].reverse().map((h) => ({
        label: h.date,
        value: h.score,
      }))
    : [
        { label: 'Oct', value: 720 },
        { label: 'Nov', value: 725 },
        { label: 'Dec', value: 730 },
        { label: 'Jan', value: 735 },
        { label: 'Feb', value: 738 },
        { label: 'Mar', value: 740 },
        { label: 'Apr', value: latestScore },
      ];

  function handleAddScore(): void {
    const n = parseInt(scoreInput, 10);
    if (!Number.isFinite(n) || n < 300 || n > 850) return;
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    addCreditScore({ score: n, date, source: 'Manual entry' });
    setScoreInput('');
  }

  /* Credit factors */
  const factors = [
    { name: 'Payment History', pct: 95, weight: 35, color: 'var(--pos)' },
    { name: 'Credit Utilization', pct: 22, weight: 30, color: 'var(--acc)' },
    { name: 'Length of History', pct: 68, weight: 15, color: 'var(--info)' },
    { name: 'Credit Mix', pct: 80, weight: 10, color: 'var(--gold)' },
    { name: 'New Inquiries', pct: 90, weight: 10, color: 'var(--warn)' },
  ];

  return (
    <div className="space-y-4">
      {/* ---- Hero ---- */}
      <div className="nw-hero">
        <p className="text-xs font-semibold opacity-80 mb-0.5">
          Credit Health Score
        </p>
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-black tracking-tight">{latestScore}</h1>
          <Badge
            text={scoreLabel(latestScore)}
            color={scoreColor(latestScore)}
          />
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold opacity-80">
          <span>
            {change >= 0 ? '+' : ''}{change} pts from last check
          </span>
        </div>
      </div>

      {/* ---- Stats ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <StatCard label="Score" value={String(latestScore)} change={scoreLabel(latestScore)} trend={change >= 0 ? 'up' : 'down'} />
        <StatCard label="Utilization" value="22%" change="Good (under 30%)" trend="up" />
        <StatCard label="Accounts" value="6" change="Mix of types" trend="flat" />
        <StatCard label="Inquiries" value="1" change="Last 6 months" trend="up" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Score History */}
        <Card>
          <p className="text-sm font-bold text-[var(--t1)] mb-3">Score History</p>
          <LineChart data={chartData} color={scoreColor(latestScore)} height={180} />
        </Card>

        {/* Add Score */}
        <Card>
          <p className="text-sm font-bold text-[var(--t1)] mb-3">Log New Score</p>
          <p className="text-[12px] text-[var(--t2)] mb-3">
            Enter your latest credit score (300-850) to track over time.
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              min={300}
              max={850}
              placeholder="e.g. 742"
              aria-label="Credit score"
              value={scoreInput}
              onChange={(e) => setScoreInput(e.target.value)}
              className="flex-1 px-4 py-3 bg-[var(--cardBg)] border border-[var(--cardBorder)] rounded-xl text-sm text-[var(--t1)] placeholder:text-[var(--t3)] outline-none focus:border-[var(--acc)] transition-colors"
            />
            <button
              type="button"
              onClick={handleAddScore}
              disabled={!scoreInput.trim()}
              className="px-5 py-3 rounded-xl bg-[var(--acc)] text-white font-semibold text-sm disabled:opacity-40 hover:brightness-110 active:scale-95 transition-all duration-150"
            >
              Add
            </button>
          </div>
          {creditScoreHistory.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <p className="text-[11px] font-bold text-[var(--t3)] uppercase">Recent Entries</p>
              {creditScoreHistory.slice(0, 5).map((h, i) => (
                <div key={i} className="flex items-center justify-between text-[12px]">
                  <span className="text-[var(--t2)]">{h.date}</span>
                  <span className="font-bold text-[var(--t1)]">{h.score}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ---- Credit Factors ---- */}
      <Card>
        <p className="text-sm font-bold text-[var(--t1)] mb-3">Credit Factors</p>
        <div className="space-y-3">
          {factors.map((f) => (
            <div key={f.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-[var(--t1)]">{f.name}</span>
                  <span className="text-[10px] text-[var(--t3)]">{f.weight}% weight</span>
                </div>
                <span className="text-[12px] font-bold text-[var(--t1)]">{f.pct}%</span>
              </div>
              <ProgressBar percent={f.pct} color={f.color} height={5} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
