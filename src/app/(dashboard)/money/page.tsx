'use client';

import React, { useMemo, useState } from 'react';
import { Card, StatCard, Badge, Avatar } from '@/components/ui';
import { accounts, transactions, bills, subscriptions } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';

/* ---- Derived data ---- */
const totalAssets = accounts
  .filter((a) => a.value > 0)
  .reduce((s, a) => s + a.value, 0);
const totalLiabilities = accounts
  .filter((a) => a.value < 0)
  .reduce((s, a) => s + Math.abs(a.value), 0);

const staleAccounts = accounts.filter((a) => a.status === 'stale');
const warnAccounts = accounts.filter((a) => a.status === 'warn');

const nextBillDue = bills.find((b) => !b.paid);
const subTotal = subscriptions.reduce((s, sub) => s + sub.amount, 0);
const flaggedSubs = subscriptions.filter((s) => s.issue);

/* Who color */
const whoColor: Record<string, string> = {
  V: 'var(--acc)',
  C: 'var(--gold)',
  J: 'var(--info)',
};

/* Status indicator */
function StatusDot({ status }: { status: 'ok' | 'warn' | 'stale' }) {
  const colors: Record<string, string> = {
    ok: 'bg-[var(--pos)]',
    warn: 'bg-[var(--warn)]',
    stale: 'bg-[var(--neg)]',
  };
  return (
    <span
      className={`w-2 h-2 rounded-full shrink-0 ${colors[status]}`}
      title={status}
    />
  );
}

type MoneyTab = 'accounts' | 'transactions' | 'bills' | 'subscriptions';

export default function MoneyPage() {
  const [activeTab, setActiveTab] = useState<MoneyTab>('accounts');
  const [searchTerm, setSearchTerm] = useState('');

  /* Filtered transactions */
  const filteredTx = useMemo(() => {
    if (!searchTerm.trim()) return transactions;
    const q = searchTerm.toLowerCase();
    return transactions.filter(
      (tx) =>
        tx.name.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        tx.amount.toLowerCase().includes(q),
    );
  }, [searchTerm]);

  const tabs: { key: MoneyTab; label: string }[] = [
    { key: 'accounts', label: 'Accounts' },
    { key: 'transactions', label: 'Transactions' },
    { key: 'bills', label: 'Bills' },
    { key: 'subscriptions', label: 'Subs' },
  ];

  return (
    <div className="space-y-4">
      {/* ---- Hero ---- */}
      <div className="nw-hero">
        <p className="text-xs font-semibold opacity-80 mb-0.5">
          Total Assets
        </p>
        <p className="text-3xl font-black tracking-tight">
          {formatCurrency(totalAssets)}
        </p>
        <div className="flex items-center gap-4 mt-2 text-xs font-semibold opacity-80">
          <span>
            Liabilities: {formatCurrency(totalLiabilities)}
          </span>
          <span>
            Net: {formatCurrency(totalAssets - totalLiabilities)}
          </span>
        </div>
      </div>

      {/* ---- Stat cards ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <StatCard
          label="Accounts"
          value={String(accounts.length)}
          change={`${staleAccounts.length} stale`}
          trend={staleAccounts.length > 0 ? 'down' : 'up'}
        />
        <StatCard
          label="Next Bill"
          value={nextBillDue ? formatCurrency(nextBillDue.amount) : 'None'}
          change={nextBillDue ? `${nextBillDue.name} - ${nextBillDue.dueLabel}` : ''}
          trend="flat"
        />
        <StatCard
          label="Monthly Subs"
          value={`$${Math.round(subTotal)}`}
          change={`${flaggedSubs.length} flagged`}
          trend={flaggedSubs.length > 0 ? 'down' : 'up'}
        />
        <StatCard
          label="Sync Warnings"
          value={String(warnAccounts.length + staleAccounts.length)}
          change={staleAccounts.length > 0 ? 'Action needed' : 'All clear'}
          trend={staleAccounts.length > 0 ? 'down' : 'up'}
        />
      </div>

      {/* ---- Tab switcher ---- */}
      <div className="flex gap-1 bg-[var(--accS)] p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-3 rounded-lg text-[13px] font-semibold transition-all duration-150 ${
              activeTab === tab.key
                ? 'bg-[var(--cardBg)] text-[var(--t1)] shadow-sm'
                : 'text-[var(--t2)] hover:text-[var(--t1)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---- Tab content ---- */}

      {/* Accounts */}
      {activeTab === 'accounts' && (
        <div className="space-y-2.5">
          {accounts.map((acc) => (
            <Card key={acc.name} onClick={() => {}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusDot status={acc.status} />
                  <div>
                    <p className="text-[13px] font-bold text-[var(--t1)]">
                      {acc.name}
                    </p>
                    <p className="text-[11px] text-[var(--t2)]">
                      {acc.type} &middot; {acc.owner} &middot; Synced {acc.lastSync} ago
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-[15px] font-bold font-[tabular-nums] ${
                      acc.value < 0 ? 'text-[var(--neg)]' : 'text-[var(--t1)]'
                    }`}
                  >
                    {formatCurrency(acc.value)}
                  </p>
                  {acc.status !== 'ok' && (
                    <Badge
                      text={acc.status === 'stale' ? 'STALE' : 'WARN'}
                      color={acc.status === 'stale' ? 'var(--neg)' : 'var(--warn)'}
                    />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Transactions */}
      {activeTab === 'transactions' && (
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative">
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--t3)"
              strokeWidth={2}
              strokeLinecap="round"
              className="absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            >
              <circle cx={11} cy={11} r={8} />
              <line x1={21} y1={21} x2={16.65} y2={16.65} />
            </svg>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--cardBg)] border border-[var(--cardBorder)] rounded-xl text-sm text-[var(--t1)] placeholder:text-[var(--t3)] outline-none focus:border-[var(--acc)] transition-colors"
            />
          </div>

          {/* Transaction list */}
          <Card>
            <div className="space-y-0">
              {filteredTx.map((tx, i) => (
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
              {filteredTx.length === 0 && (
                <p className="text-sm text-[var(--t2)] text-center py-6">
                  No transactions match your search.
                </p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Bills */}
      {activeTab === 'bills' && (
        <div className="space-y-2.5">
          {bills.map((bill) => (
            <Card key={bill.name} onClick={() => {}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                      bill.paid
                        ? 'bg-[var(--posBg)] text-[var(--pos)]'
                        : 'bg-[var(--accS)] text-[var(--acc)]'
                    }`}
                  >
                    {bill.dueLabel}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[var(--t1)]">
                      {bill.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-[var(--t2)]">
                      {bill.autopay && <Badge text="AUTOPAY" color="var(--acc)" />}
                      {bill.paid && <Badge text="PAID" color="var(--pos)" />}
                    </div>
                  </div>
                </div>
                <span className="text-[15px] font-bold font-[tabular-nums] text-[var(--t1)]">
                  {formatCurrency(bill.amount)}
                </span>
              </div>
            </Card>
          ))}
          <Card variant="inner">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--t2)]">
                Total Monthly Bills
              </span>
              <span className="text-[15px] font-bold text-[var(--t1)]">
                {formatCurrency(bills.reduce((s, b) => s + b.amount, 0))}
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* Subscriptions */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-2.5">
          {subscriptions.map((sub) => (
            <Card key={sub.name} onClick={() => {}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accS)] flex items-center justify-center">
                    <span className="text-[12px] font-bold text-[var(--acc)]">
                      {sub.usageScore}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[13px] font-bold text-[var(--t1)]">
                        {sub.name}
                      </p>
                      {sub.issue && (
                        <Badge text={sub.issue} color="var(--warn)" />
                      )}
                      {sub.ok && (
                        <Badge text="OK" color="var(--pos)" />
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--t2)]">
                      {sub.owner} &middot; {sub.category}
                    </p>
                  </div>
                </div>
                <span className="text-[14px] font-bold font-[tabular-nums] text-[var(--t1)]">
                  ${sub.amount.toFixed(2)}/mo
                </span>
              </div>
            </Card>
          ))}
          <Card variant="inner">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--t2)]">
                Total Monthly Subscriptions
              </span>
              <span className="text-[15px] font-bold text-[var(--t1)]">
                ${subTotal.toFixed(2)}/mo
              </span>
            </div>
          </Card>
          {flaggedSubs.length > 0 && (
            <Card variant="accent">
              <p className="text-sm font-bold text-[var(--t1)] mb-2">
                Flagged Subscriptions ({flaggedSubs.length})
              </p>
              <p className="text-[12px] text-[var(--t2)]">
                Potential savings of{' '}
                <strong className="text-[var(--pos)]">
                  ${flaggedSubs.reduce((s, f) => s + f.amount, 0).toFixed(2)}/mo
                </strong>{' '}
                by cancelling low-use subscriptions: {flaggedSubs.map((f) => f.name).join(', ')}.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
