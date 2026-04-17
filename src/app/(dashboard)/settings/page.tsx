'use client';

import React from 'react';
import { Card, Toggle, Avatar, Badge, PendingBadge } from '@/components/ui';
import { useNestWorthStore } from '@/lib/store';
import type { ThemeName } from '@/lib/types';
import { accounts, nests } from '@/lib/data';

/* ---- Theme swatches ---- */
const THEMES: { name: ThemeName; label: string; bg: string; accent: string }[] = [
  { name: 'emerald', label: 'Emerald', bg: '#0f2a1d', accent: '#34d399' },
  { name: 'light', label: 'Light', bg: '#f2f2f7', accent: '#10b981' },
  { name: 'dark', label: 'Dark', bg: '#111111', accent: '#22c55e' },
  { name: 'midnight', label: 'Midnight', bg: '#0a0e1a', accent: '#818cf8' },
  { name: 'gold', label: 'Gold', bg: '#12100b', accent: '#c8a848' },
];

export default function SettingsPage() {
  const theme = useNestWorthStore((s) => s.theme);
  const setTheme = useNestWorthStore((s) => s.setTheme);
  const alertPrefs = useNestWorthStore((s) => s.alertPrefs);
  const setAlertPrefs = useNestWorthStore((s) => s.setAlertPrefs);
  const adPrefs = useNestWorthStore((s) => s.adPrefs);
  const setAdPrefs = useNestWorthStore((s) => s.setAdPrefs);

  const totalAccounts = accounts.length;
  const activeNests = nests.length;

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
              <circle cx={12} cy={12} r={3} />
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Settings</h1>
            <p className="text-[13px] opacity-80">Customize your NestWorth experience</p>
          </div>
        </div>
      </div>

      {/* ---- Profile Section ---- */}
      <Card>
        <div className="nw-section-header">
          <span>Household Profile</span>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3.5">
            <Avatar letter="C" size={44} color="var(--acc)" />
            <div className="flex-1">
              <p className="text-[15px] font-bold text-[var(--t1)]">Christian</p>
              <p className="text-[12px] text-[var(--t2)]">Primary &middot; vscott@alta.org</p>
            </div>
            <Badge text="PRIMARY" color="var(--acc)" />
          </div>
          <div className="flex items-center gap-3.5">
            <Avatar letter="Ch" size={44} color="var(--gold)" />
            <div className="flex-1">
              <p className="text-[15px] font-bold text-[var(--t1)]">Channelle</p>
              <p className="text-[12px] text-[var(--t2)]">Partner &middot; Full access</p>
            </div>
            <Badge text="PARTNER" color="var(--gold)" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-[var(--sep)]">
          <div className="text-center nw-card-inner py-3">
            <p className="text-2xl font-black text-[var(--t1)] font-[tabular-nums]">{totalAccounts}</p>
            <p className="text-[11px] text-[var(--t2)] mt-0.5">Accounts</p>
          </div>
          <div className="text-center nw-card-inner py-3">
            <p className="text-2xl font-black text-[var(--t1)] font-[tabular-nums]">{activeNests}</p>
            <p className="text-[11px] text-[var(--t2)] mt-0.5">Nests</p>
          </div>
          <div className="text-center nw-card-inner py-3">
            <p className="text-2xl font-black text-[var(--t1)] font-[tabular-nums]">2</p>
            <p className="text-[11px] text-[var(--t2)] mt-0.5">Members</p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* ---- Theme Picker ---- */}
        <Card>
          <div className="nw-section-header">
            <span>Theme</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setTheme(t.name)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                  theme === t.name
                    ? 'bg-[var(--accS)] ring-2 ring-[var(--acc)] ring-offset-2 ring-offset-[var(--cardBg)] scale-105'
                    : 'hover:bg-[var(--accS)] hover:scale-102'
                }`}
              >
                <div
                  className="w-14 h-14 rounded-xl border-2 flex items-center justify-center shadow-sm transition-transform duration-200"
                  style={{
                    background: t.bg,
                    borderColor: theme === t.name ? t.accent : 'var(--sep)',
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full shadow-sm"
                    style={{ background: t.accent }}
                  />
                </div>
                <span className={`text-[11px] font-semibold ${theme === t.name ? 'text-[var(--acc)]' : 'text-[var(--t1)]'}`}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* ---- Alert Preferences ---- */}
        <Card>
          <div className="nw-section-header">
            <span>Alert Preferences</span>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold text-[var(--t1)]">Email Alerts</p>
                <p className="text-[12px] text-[var(--t2)] mt-0.5">{alertPrefs.emailAddr}</p>
              </div>
              <Toggle
                checked={alertPrefs.email}
                onChange={(checked) =>
                  setAlertPrefs({ ...alertPrefs, email: checked })
                }
                label="Email alerts"
              />
            </div>
            <div className="nw-section-divider" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold text-[var(--t1)]">SMS Alerts</p>
                <p className="text-[12px] text-[var(--t2)] mt-0.5">
                  {alertPrefs.phone || 'No phone set'}
                </p>
              </div>
              <Toggle
                checked={alertPrefs.sms}
                onChange={(checked) =>
                  setAlertPrefs({ ...alertPrefs, sms: checked })
                }
                label="SMS alerts"
              />
            </div>
          </div>
        </Card>

        {/* ---- Ad Preferences ---- */}
        <Card>
          <div className="nw-section-header">
            <span>Ad Preferences</span>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[14px] font-semibold text-[var(--t1)]">Native Ads</p>
              <Toggle
                checked={adPrefs.showNativeAds}
                onChange={(checked) =>
                  setAdPrefs({ ...adPrefs, showNativeAds: checked })
                }
                label="Native ads"
              />
            </div>
            <div className="nw-section-divider" />
            <div className="flex items-center justify-between gap-4">
              <p className="text-[14px] font-semibold text-[var(--t1)]">Premium Banner</p>
              <Toggle
                checked={adPrefs.showPremiumBanner}
                onChange={(checked) =>
                  setAdPrefs({ ...adPrefs, showPremiumBanner: checked })
                }
                label="Premium banner"
              />
            </div>
            <div className="nw-section-divider" />
            <div className="flex items-center justify-between gap-4">
              <p className="text-[14px] font-semibold text-[var(--t1)]">Partner Offers</p>
              <Toggle
                checked={adPrefs.showPartnerOffers}
                onChange={(checked) =>
                  setAdPrefs({ ...adPrefs, showPartnerOffers: checked })
                }
                label="Partner offers"
              />
            </div>
          </div>
        </Card>

        {/* ---- Connected Accounts ---- */}
        <Card>
          <div className="nw-section-header">
            <span>Connected Accounts</span>
          </div>
          <div className="space-y-0">
            {[
              { name: 'Chase', status: 'Connected', ok: true },
              { name: 'Capital One', status: 'Warning', ok: false },
              { name: 'Ally Invest', status: 'Connected', ok: true },
              { name: 'Venmo', status: 'Pending', pending: true },
              { name: 'Coinbase', status: 'Pending', pending: true },
            ].map((acc) => (
              <div
                key={acc.name}
                className="nw-table-row"
              >
                <span className="text-[14px] font-semibold text-[var(--t1)]">
                  {acc.name}
                </span>
                <div className="flex items-center gap-2">
                  {acc.ok && <Badge text="CONNECTED" color="var(--pos)" />}
                  {!acc.ok && !acc.pending && (
                    <Badge text="WARNING" color="var(--warn)" />
                  )}
                  {acc.pending && <PendingBadge reason="PENDING" />}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ---- Data & Export ---- */}
      <Card>
        <div className="nw-section-header">
          <span>Data & Export</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Export CSV', desc: 'Download all transactions', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
            { label: 'Export PDF', desc: 'Generate report', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
            { label: 'Clear Cache', desc: 'Reset local data', icon: 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' },
            { label: 'Privacy', desc: 'View data policy', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
          ].map((item) => (
            <Card key={item.label} variant="inner">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--accS)] flex items-center justify-center shrink-0">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--acc)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={item.icon} />
                  </svg>
                </div>
                <p className="text-[14px] font-bold text-[var(--t1)]">
                  {item.label}
                </p>
              </div>
              <p className="text-[11px] text-[var(--t2)]">
                {item.desc}
              </p>
            </Card>
          ))}
        </div>
      </Card>

      {/* ---- Version Footer ---- */}
      <div className="text-center py-5">
        <p className="text-[12px] text-[var(--t3)] font-medium">
          NestWorth v5.0 &middot; Built for households
        </p>
      </div>
    </div>
  );
}
