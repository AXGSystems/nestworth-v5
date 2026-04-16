// NestWorth v5 — Shared Navigation Config
// Single source of truth for sidebar and drawer navigation.

export interface NavItem {
  label: string;
  icon: string;
  href?: string;
  page?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

/* SVG icon paths (feather / lucide style, viewBox 0 0 24 24) */
export const ICONS: Record<string, string> = {
  home: 'M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z',
  spend: 'M12 1v22M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6',
  save: 'M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h6v2h4v-3.5c2-1.5 2-2.7 2-4.5 0-2.5-1-4-4-5zM2 9.1C1.5 6.7 4 2 8 2',
  money: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  coach: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  accounts: 'M2 17V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z M6 15h.01 M2 9h20',
  transactions: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  spending: 'M21.21 15.89A10 10 0 1 1 8 2.83 M22 12A10 10 0 0 0 12 2v10z',
  chargeiq: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  credit: 'M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z M9 12l2 2 4-4',
  calendar: 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z M16 2v4 M8 2v4 M3 10h18',
  subscriptions: 'M4 4h16v16H4z M9 9h6 M9 13h6 M9 17h4',
  audit: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z',
  forecast: 'M22 12h-4l-3 9L9 3l-3 9H2',
  score: 'M12 20V10 M18 20V4 M6 20v-4',
  achievements: 'M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7 M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7 M4 22h16 M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22 M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22 M18 2H6v7a6 6 0 0 0 12 0V2z',
  fees: 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8',
  tax: 'M4 7V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H4 M8 12h.01 M12 12h.01 M16 12h.01 M8 16h.01 M12 16h.01 M16 16h.01',
  income: 'M12 2v20 M2 12h20 M20 16l-4 4-4-4 M4 8l4-4 4 4',
  messages: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  partner: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  sync: 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  date: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z',
  alerts: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  export: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  settings: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  feature: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 13 18.47V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  bug: 'M8 2l1.88 1.88 M14.12 3.88L16 2 M9 7.13v-1a3.003 3.003 0 1 1 6 0v1 M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6 M12 20v-9 M6.53 9C4.6 8.8 3 7.1 3 5 M6 13H2 M3 21c0-2.1 1.7-3.9 3.8-4 M20.97 5c0 2.1-1.6 3.8-3.5 4 M22 13h-4 M17.2 17c2.1.1 3.8 1.9 3.8 4',
  collapse: 'M11 19l-7-7 7-7 M18 19l-7-7 7-7',
  expand: 'M13 5l7 7-7 7 M6 5l7 7-7 7',
};

export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Main',
    items: [
      { label: 'Home', icon: 'home', href: '/' },
      { label: 'Spend', icon: 'spend', href: '/spend' },
      { label: 'Save', icon: 'save', href: '/save' },
      { label: 'Money', icon: 'money', href: '/money' },
      { label: 'Coach', icon: 'coach', href: '/coach' },
    ],
  },
  {
    title: 'Money',
    items: [
      { label: 'Accounts', icon: 'accounts', href: '/accounts' },
      { label: 'Transactions', icon: 'transactions', href: '/transactions' },
      { label: 'Spending', icon: 'spending', page: 'spending' },
      { label: 'ChargeIQ', icon: 'chargeiq', href: '/chargeiq' },
      { label: 'Credit Health', icon: 'credit', href: '/credit' },
    ],
  },
  {
    title: 'Bills & Recurring',
    items: [
      { label: 'Bills Calendar', icon: 'calendar', page: 'bills' },
      { label: 'Subscriptions', icon: 'subscriptions', page: 'subscriptions' },
      { label: 'Bill Audit', icon: 'audit', page: 'bill-audit' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { label: 'Cash Forecast', icon: 'forecast', href: '/forecast' },
      { label: 'NestWorth Score', icon: 'score', page: 'score' },
      { label: 'Achievements', icon: 'achievements', page: 'achievements' },
      { label: 'Fee Analyzer', icon: 'fees', page: 'fee-analyzer' },
      { label: 'Tax Deductions', icon: 'tax', page: 'tax' },
      { label: 'Income Cadence', icon: 'income', page: 'income' },
    ],
  },
  {
    title: 'Household',
    items: [
      { label: 'Messages', icon: 'messages', page: 'messages' },
      { label: 'Partner Transparency', icon: 'partner', page: 'partner' },
      { label: 'Sync Health', icon: 'sync', page: 'sync' },
      { label: 'Money Date', icon: 'date', page: 'money-date' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Alerts', icon: 'alerts', page: 'alerts' },
      { label: 'Export Data', icon: 'export', page: 'export' },
      { label: 'Settings', icon: 'settings', href: '/settings' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Feature Request', icon: 'feature', page: 'feature-request' },
      { label: 'Report Bug', icon: 'bug', page: 'report-bug' },
    ],
  },
];
