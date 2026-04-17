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
    <div className="space-y-5">
      {/* ---- Hero with Score Gauge ---- */}
      <div className="nw-hero">
        <p className="text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">
          Credit Health Score
        </p>
        <div className="flex items-center gap-4">
          {/* Score gauge */}
          <div className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] shrink-0">
            <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
              {/* Track */}
              <circle
                cx={60} cy={60} r={52}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray="245.04"
                strokeDashoffset="61.26"
                transform="rotate(135 60 60)"
              />
              {/* Fill */}
              <circle
                cx={60} cy={60} r={52}
                fill="none"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray="245.04"
                strokeDashoffset={245.04 - ((latestScore - 300) / 550) * 183.78 + 61.26}
                transform="rotate(135 60 60)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl font-black leading-none">{latestScore}</span>
              <span className="text-[10px] font-semibold opacity-70 mt-0.5">{scoreLabel(latestScore)}</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{latestScore}</h1>
            <Badge
              text={scoreLabel(latestScore)}
              color={scoreColor(latestScore)}
            />
            <div className="flex items-center gap-1.5 mt-2 text-[13px] font-semibold opacity-80">
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" aria-hidden="true">
                <polyline points={change >= 0 ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
              </svg>
              <span>
                {change >= 0 ? '+' : ''}{change} pts from last check
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Stats ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Score" value={String(latestScore)} change={scoreLabel(latestScore)} trend={change >= 0 ? 'up' : 'down'} />
        <StatCard label="Utilization" value="22%" change="Good (under 30%)" trend="up" />
        <StatCard label="Accounts" value="6" change="Mix of types" trend="flat" />
        <StatCard label="Inquiries" value="1" change="Last 6 months" trend="up" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Score History */}
        <Card>
          <div className="nw-section-header">
            <span>Score History</span>
          </div>
          <LineChart data={chartData} color={scoreColor(latestScore)} height={180} />
        </Card>

        {/* Add Score */}
        <Card>
          <div className="nw-section-header">
            <span>Log New Score</span>
          </div>
          <p className="text-[13px] text-[var(--t2)] mb-4">
            Enter your latest credit score (300-850) to track over time.
          </p>
          <div className="flex gap-2.5">
            <input
              type="number"
              min={300}
              max={850}
              placeholder="e.g. 742"
              aria-label="Credit score"
              value={scoreInput}
              onChange={(e) => setScoreInput(e.target.value)}
              className="nw-input flex-1"
            />
            <button
              type="button"
              onClick={handleAddScore}
              disabled={!scoreInput.trim()}
              className="nw-btn disabled:opacity-40"
              style={{ height: 50, padding: '0 20px', fontSize: 14 }}
            >
              Add
            </button>
          </div>
          {creditScoreHistory.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[var(--sep)]">
              <p className="text-[11px] font-bold text-[var(--t3)] uppercase tracking-wider mb-2">Recent Entries</p>
              {creditScoreHistory.slice(0, 5).map((h, i) => (
                <div key={i} className="nw-table-row" style={{ minHeight: 40, padding: '8px 0' }}>
                  <span className="text-[13px] text-[var(--t2)]">{h.date}</span>
                  <span className="text-[14px] font-bold text-[var(--t1)] font-[tabular-nums]">{h.score}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ---- Credit Factors ---- */}
      <Card>
        <div className="nw-section-header">
          <span>Credit Factors</span>
        </div>
        <div className="space-y-5">
          {factors.map((f) => (
            <div key={f.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: f.color }} />
                  <span className="text-[14px] font-semibold text-[var(--t1)]">{f.name}</span>
                  <span className="text-[11px] text-[var(--t3)] bg-[var(--accS)] px-2 py-0.5 rounded-md">{f.weight}% weight</span>
                </div>
                <span className="text-[14px] font-bold text-[var(--t1)] font-[tabular-nums]">{f.pct}%</span>
              </div>
              <ProgressBar percent={f.pct} color={f.color} height={6} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
