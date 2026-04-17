'use client';

import React from 'react';
import { Card, StatCard, Badge } from '@/components/ui';
import { Sparkline } from '@/components/charts';
import { accounts, nwHistory } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';

/* ---- Derived data ---- */
const totalAssets = accounts
  .filter((a) => a.value > 0)
  .reduce((s, a) => s + a.value, 0);
const totalLiabilities = accounts
  .filter((a) => a.value < 0)
  .reduce((s, a) => s + Math.abs(a.value), 0);
const netWorth = totalAssets - totalLiabilities;
const sparkData = nwHistory.map((p) => p.v);

const staleCount = accounts.filter((a) => a.status === 'stale').length;
const warnCount = accounts.filter((a) => a.status === 'warn').length;

/* Status helpers */
function StatusDot({ status }: { status: 'ok' | 'warn' | 'stale' }) {
  const colors: Record<string, string> = {
    ok: 'bg-[var(--pos)]',
    warn: 'bg-[var(--warn)]',
    stale: 'bg-[var(--neg)]',
  };
  const pulseClass = status !== 'ok' ? 'animate-pulse' : '';
  return (
    <span
      className={`w-2.5 h-2.5 rounded-full shrink-0 ${colors[status]} ${pulseClass}`}
      title={status}
    />
  );
}

export default function AccountsPage() {
  return (
    <div className="space-y-5">
      {/* ---- Hero ---- */}
      <div className="nw-hero">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">
              Total Net Worth
            </p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
              {formatCurrency(netWorth)}
            </h1>
          </div>
          <div className="w-[100px] sm:w-[120px]">
            <Sparkline data={sparkData} color="rgba(255,255,255,0.85)" />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-1 text-[13px] font-semibold opacity-80">
          <span>Assets: {formatCurrency(totalAssets)}</span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span>Liabilities: {formatCurrency(totalLiabilities)}</span>
        </div>
      </div>

      {/* ---- Stats ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Accounts" value={String(accounts.length)} change="Linked" trend="up" />
        <StatCard label="Assets" value={formatCurrency(totalAssets)} change="Checking + Savings + Invest" trend="up" />
        <StatCard label="Liabilities" value={formatCurrency(totalLiabilities)} change="Credit cards" trend="down" />
        <StatCard
          label="Sync Issues"
          value={String(staleCount + warnCount)}
          change={staleCount > 0 ? `${staleCount} stale` : 'All healthy'}
          trend={staleCount > 0 ? 'down' : 'up'}
        />
      </div>

      {/* ---- Account List ---- */}
      <Card>
        <div className="nw-section-header">
          <span>All Accounts</span>
          <span className="text-[13px] font-semibold text-[var(--t2)]">
            {accounts.length} linked
          </span>
        </div>
        <div className="overflow-x-auto -mx-5 sm:mx-0">
          <table className="w-full text-sm border-collapse min-w-[640px]">
            <thead>
              <tr>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--t3)] text-left">Status</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--t3)] text-left">Account</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--t3)] text-left">Type</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--t3)] text-left">Owner</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--t3)] text-right">Balance</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--t3)] text-right">Last Sync</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr
                  key={acc.name}
                  className="border-b border-[var(--sep)] last:border-b-0 hover:bg-[var(--accS)] transition-colors duration-150"
                  style={{ minHeight: 52 }}
                >
                  <td className="px-5 py-3.5">
                    <StatusDot status={acc.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[14px] font-semibold text-[var(--t1)]">{acc.name}</span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[var(--t2)]">{acc.type}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[var(--t2)]">{acc.owner}</td>
                  <td className={`px-5 py-3.5 text-right text-[14px] font-bold font-[tabular-nums] ${acc.value < 0 ? 'text-[var(--neg)]' : 'text-[var(--t1)]'}`}>
                    {formatCurrency(acc.value)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-[13px] text-[var(--t2)]">{acc.lastSync} ago</span>
                      {acc.status !== 'ok' && (
                        <Badge
                          text={acc.status === 'stale' ? 'STALE' : 'WARN'}
                          color={acc.status === 'stale' ? 'var(--neg)' : 'var(--warn)'}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ---- Sync Status Summary ---- */}
      {(staleCount > 0 || warnCount > 0) && (
        <Card variant="accent">
          <div className="nw-section-header">
            <span>Sync Alerts</span>
            <Badge
              text={`${staleCount + warnCount} issues`}
              color="var(--warn)"
            />
          </div>
          <div className="space-y-3">
            {accounts
              .filter((a) => a.status !== 'ok')
              .map((acc) => (
                <div key={acc.name} className="flex items-center gap-3 py-2">
                  <StatusDot status={acc.status} />
                  <span className="text-[13px] text-[var(--t2)]">
                    <strong className="text-[var(--t1)] font-semibold">{acc.name}</strong> &mdash;
                    Last synced {acc.lastSync} ago
                  </span>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}
