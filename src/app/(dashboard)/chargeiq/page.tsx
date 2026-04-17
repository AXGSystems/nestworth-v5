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
    <div className="space-y-5">
      {/* ---- Hero ---- */}
      <div className="nw-hero">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
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
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">ChargeIQ</h1>
            <p className="text-[13px] opacity-80">
              Decode mystery charges on your statements
            </p>
          </div>
        </div>
      </div>

      {/* ---- Stats ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Charges Decoded" value={String(chargeIQDemoCharges.length)} change="Demo data" trend="up" />
        <StatCard label="Avg Confidence" value={`${avgConfidence}%`} change="High accuracy" trend="up" />
        <StatCard label="Categories" value={String(new Set(chargeIQDemoCharges.map((c) => c.category)).size)} change="Auto-categorized" trend="flat" />
        <StatCard label="Unresolved" value="0" change="All identified" trend="up" />
      </div>

      {/* ---- Search ---- */}
      <Card className="!p-4">
        <div className="relative">
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--t3)"
            strokeWidth={2}
            strokeLinecap="round"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10"
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
            className="nw-input !pl-10"
          />
        </div>
      </Card>

      {/* ---- Results ---- */}
      <div className="space-y-3">
        {filteredCharges.map((charge, idx) => (
          <Card key={charge.raw}>
            <button
              type="button"
              onClick={() => setSelectedCharge(selectedCharge === idx ? null : idx)}
              className="w-full text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-mono font-bold text-[var(--t1)] break-all sm:break-normal">
                    {charge.raw}
                  </p>
                  <p className="text-[14px] font-semibold text-[var(--acc)] mt-1">
                    {charge.merchant}
                  </p>
                  <p className="text-[12px] text-[var(--t2)] mt-0.5">
                    {charge.description}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <Badge text={charge.category} color="var(--acc)" />
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-bold"
                    style={{
                      background: charge.confidence >= 90
                        ? 'var(--posBg)'
                        : 'var(--warnBg)',
                      color: charge.confidence >= 90
                        ? 'var(--pos)'
                        : 'var(--warn)',
                    }}
                  >
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true">
                      {charge.confidence >= 90
                        ? <polyline points="20 6 9 17 4 12" />
                        : <><circle cx={12} cy={12} r={10} /><line x1={12} y1={8} x2={12} y2={12} /><line x1={12} y1={16} x2={12.01} y2={16} /></>
                      }
                    </svg>
                    {charge.confidence}%
                  </div>
                </div>
              </div>
            </button>

            {selectedCharge === idx && (
              <div className="mt-4 pt-4 border-t border-[var(--sep)] grid grid-cols-2 gap-4">
                <div className="nw-card-inner">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--t3)] mb-1">Phone</p>
                  <p className="text-[14px] font-semibold text-[var(--t1)]">{charge.phone}</p>
                </div>
                <div className="nw-card-inner">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--t3)] mb-1">Website</p>
                  <p className="text-[14px] font-semibold text-[var(--acc)]">{charge.website}</p>
                </div>
              </div>
            )}
          </Card>
        ))}

        {filteredCharges.length === 0 && (
          <Card>
            <p className="text-[14px] text-[var(--t2)] text-center py-8">
              No matching charges found. Try a different search term.
            </p>
          </Card>
        )}
      </div>

      {/* ---- Help Card ---- */}
      <Card variant="accent">
        <div className="nw-section-header">
          <span>How ChargeIQ Works</span>
        </div>
        <div className="space-y-3">
          {[
            { step: '1', text: 'Paste any mystery charge descriptor from your statement' },
            { step: '2', text: 'ChargeIQ decodes the merchant, category, and contact info' },
            { step: '3', text: 'Dispute unrecognized charges directly with the merchant' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-lg bg-[var(--accS)] flex items-center justify-center text-[11px] font-bold text-[var(--acc)] shrink-0">
                {item.step}
              </span>
              <p className="text-[13px] text-[var(--t2)] leading-relaxed pt-0.5">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
