'use client';

import React, { useState, useMemo } from 'react';
import { Card, StatCard, Badge } from '@/components/ui';
import { chargeIQDemoCharges } from '@/lib/data';

export default function ChargeIQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCharge, setSelectedCharge] = useState<number | null>(null);

  const filteredCharges = useMemo(() => {
    if (!searchTerm.trim()) return chargeIQDemoCharges;
    const q = searchTerm.toLowerCase();
    return chargeIQDemoCharges.filter(
      (c) =>
        c.raw.toLowerCase().includes(q) ||
        c.merchant.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q),
    );
  }, [searchTerm]);

  const avgConfidence = Math.round(
    chargeIQDemoCharges.reduce((s, c) => s + c.confidence, 0) / chargeIQDemoCharges.length,
  );

  return (
    <div className="space-y-4">
      {/* ---- Hero ---- */}
      <div className="nw-hero">
        <div className="flex items-center gap-3">
          <svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <div>
            <h1 className="text-lg font-black tracking-tight">ChargeIQ</h1>
            <p className="text-xs opacity-80">
              Decode mystery charges on your statements
            </p>
          </div>
        </div>
      </div>

      {/* ---- Stats ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <StatCard label="Charges Decoded" value={String(chargeIQDemoCharges.length)} change="Demo data" trend="up" />
        <StatCard label="Avg Confidence" value={`${avgConfidence}%`} change="High accuracy" trend="up" />
        <StatCard label="Categories" value={String(new Set(chargeIQDemoCharges.map((c) => c.category)).size)} change="Auto-categorized" trend="flat" />
        <StatCard label="Unresolved" value="0" change="All identified" trend="up" />
      </div>

      {/* ---- Search ---- */}
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
          placeholder="Paste a mystery charge (e.g. APCR*DIGITALRVRM)..."
          aria-label="Search charges"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxLength={200}
          className="w-full pl-10 pr-4 py-3 bg-[var(--cardBg)] border border-[var(--cardBorder)] rounded-xl text-sm text-[var(--t1)] placeholder:text-[var(--t3)] outline-none focus:border-[var(--acc)] transition-colors"
        />
      </div>

      {/* ---- Results ---- */}
      <div className="space-y-2.5">
        {filteredCharges.map((charge, idx) => (
          <Card key={charge.raw}>
            <button
              type="button"
              onClick={() => setSelectedCharge(selectedCharge === idx ? null : idx)}
              className="w-full text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-mono font-bold text-[var(--t1)] break-all sm:break-normal">
                    {charge.raw}
                  </p>
                  <p className="text-[13px] font-semibold text-[var(--acc)] mt-0.5">
                    {charge.merchant}
                  </p>
                  <p className="text-[11px] text-[var(--t2)] mt-0.5">
                    {charge.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge text={charge.category} color="var(--acc)" />
                  <Badge
                    text={`${charge.confidence}%`}
                    color={charge.confidence >= 90 ? 'var(--pos)' : 'var(--warn)'}
                  />
                </div>
              </div>
            </button>

            {selectedCharge === idx && (
              <div className="mt-3 pt-3 border-t border-[var(--sep)] grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase text-[var(--t3)]">Phone</p>
                  <p className="text-[13px] text-[var(--t1)] mt-0.5">{charge.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-[var(--t3)]">Website</p>
                  <p className="text-[13px] text-[var(--acc)] mt-0.5">{charge.website}</p>
                </div>
              </div>
            )}
          </Card>
        ))}

        {filteredCharges.length === 0 && (
          <Card>
            <p className="text-sm text-[var(--t2)] text-center py-6">
              No matching charges found. Try a different search term.
            </p>
          </Card>
        )}
      </div>

      {/* ---- Help Card ---- */}
      <Card variant="accent">
        <p className="text-sm font-bold text-[var(--t1)] mb-2">
          How ChargeIQ Works
        </p>
        <div className="space-y-1.5 text-[12px] text-[var(--t2)]">
          <p>1. Paste any mystery charge descriptor from your statement</p>
          <p>2. ChargeIQ decodes the merchant, category, and contact info</p>
          <p>3. Dispute unrecognized charges directly with the merchant</p>
        </div>
      </Card>
    </div>
  );
}
