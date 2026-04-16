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
            <circle cx={12} cy={12} r={3} />
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          </svg>
          <div>
            <h1 className="text-lg font-black tracking-tight">Settings</h1>
            <p className="text-xs opacity-80">Customize your NestWorth experience</p>
          </div>
        </div>
      </div>

      {/* ---- Profile Section ---- */}
      <Card>
        <p className="text-sm font-bold text-[var(--t1)] mb-3">Household Profile</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Avatar letter="V" size={40} color="var(--acc)" />
            <div className="flex-1">
              <p className="text-[14px] font-bold text-[var(--t1)]">Von Scott</p>
              <p className="text-[11px] text-[var(--t2)]">Primary &middot; vscott@alta.org</p>
            </div>
            <Badge text="PRIMARY" color="var(--acc)" />
          </div>
          <div className="flex items-center gap-3">
            <Avatar letter="C" size={40} color="var(--gold)" />
            <div className="flex-1">
              <p className="text-[14px] font-bold text-[var(--t1)]">Caroline</p>
              <p className="text-[11px] text-[var(--t2)]">Partner &middot; Full access</p>
            </div>
            <Badge text="PARTNER" color="var(--gold)" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-[var(--sep)]">
          <div className="text-center">
            <p className="text-lg font-black text-[var(--t1)]">{totalAccounts}</p>
            <p className="text-[10px] text-[var(--t2)]">Accounts</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-[var(--t1)]">{activeNests}</p>
            <p className="text-[10px] text-[var(--t2)]">Nests</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-[var(--t1)]">2</p>
            <p className="text-[10px] text-[var(--t2)]">Members</p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* ---- Theme Picker ---- */}
        <Card>
          <p className="text-sm font-bold text-[var(--t1)] mb-3">Theme</p>
          <div className="grid grid-cols-5 gap-2">
            {THEMES.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setTheme(t.name)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-150 ${
                  theme === t.name
                    ? 'bg-[var(--accS)] ring-2 ring-[var(--acc)] ring-offset-1'
                    : 'hover:bg-[var(--accS)]'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-lg border border-[var(--sep)] flex items-center justify-center"
                  style={{ background: t.bg }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: t.accent }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-[var(--t1)]">
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* ---- Alert Preferences ---- */}
        <Card>
          <p className="text-sm font-bold text-[var(--t1)] mb-3">
            Alert Preferences
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-[var(--t1)]">Email Alerts</p>
                <p className="text-[11px] text-[var(--t2)]">{alertPrefs.emailAddr}</p>
              </div>
              <Toggle
                checked={alertPrefs.email}
                onChange={(checked) =>
                  setAlertPrefs({ ...alertPrefs, email: checked })
                }
                label="Email alerts"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-[var(--t1)]">SMS Alerts</p>
                <p className="text-[11px] text-[var(--t2)]">
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
          <p className="text-sm font-bold text-[var(--t1)] mb-3">
            Ad Preferences
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-[var(--t1)]">Native Ads</p>
              <Toggle
                checked={adPrefs.showNativeAds}
                onChange={(checked) =>
                  setAdPrefs({ ...adPrefs, showNativeAds: checked })
                }
                label="Native ads"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-[var(--t1)]">Premium Banner</p>
              <Toggle
                checked={adPrefs.showPremiumBanner}
                onChange={(checked) =>
                  setAdPrefs({ ...adPrefs, showPremiumBanner: checked })
                }
                label="Premium banner"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-[var(--t1)]">Partner Offers</p>
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
          <p className="text-sm font-bold text-[var(--t1)] mb-3">
            Connected Accounts
          </p>
          <div className="space-y-2.5">
            {[
              { name: 'Chase', status: 'Connected', ok: true },
              { name: 'Capital One', status: 'Warning', ok: false },
              { name: 'Ally Invest', status: 'Connected', ok: true },
              { name: 'Venmo', status: 'Pending', pending: true },
              { name: 'Coinbase', status: 'Pending', pending: true },
            ].map((acc) => (
              <div
                key={acc.name}
                className="flex items-center justify-between py-1.5"
              >
                <span className="text-[13px] font-semibold text-[var(--t1)]">
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
        <p className="text-sm font-bold text-[var(--t1)] mb-3">
          Data & Export
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { label: 'Export CSV', desc: 'Download all transactions' },
            { label: 'Export PDF', desc: 'Generate report' },
            { label: 'Clear Cache', desc: 'Reset local data' },
            { label: 'Privacy', desc: 'View data policy' },
          ].map((item) => (
            <Card key={item.label} variant="inner">
              <p className="text-[13px] font-bold text-[var(--t1)]">
                {item.label}
              </p>
              <p className="text-[10px] text-[var(--t2)] mt-0.5">
                {item.desc}
              </p>
            </Card>
          ))}
        </div>
      </Card>

      {/* ---- Version Footer ---- */}
      <div className="text-center py-4">
        <p className="text-[11px] text-[var(--t3)] font-medium">
          NestWorth v5.0 &middot; Built for households
        </p>
      </div>
    </div>
  );
}
