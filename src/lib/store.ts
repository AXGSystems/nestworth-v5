'use client';

import { create } from 'zustand';
import type {
  AlertPrefs,
  AlertTypes,
  AdPrefs,
  CreditScore,
  FeatureRequest,
  BugReport,
  ThemeName,
  TabName,
} from './types';
import { VALID_THEMES } from './types';
import { hasPrototypePollution } from './utils';

// --- Default values ---

const ALERT_DEFAULT: AlertPrefs = {
  email: true,
  sms: false,
  emailAddr: 'von@example.com',
  phone: '',
  types: {
    overspend: true,
    sync: true,
    bills: true,
    goals: true,
    anomaly: true,
    velocity: true,
    weekly: true,
  },
};

const AD_DEFAULT: AdPrefs = {
  showNativeAds: true,
  showPremiumBanner: true,
  showPartnerOffers: true,
};

// --- localStorage helpers with validation ---

function loadTheme(): ThemeName {
  try {
    const stored = localStorage.getItem('nw-theme');
    if (stored && VALID_THEMES.includes(stored as ThemeName)) {
      return stored as ThemeName;
    }
  } catch {
    // localStorage unavailable (SSR, private browsing, etc.)
  }
  return 'emerald';
}

function loadSidebarCollapsed(): boolean {
  try {
    return localStorage.getItem('nw-sidebar-collapsed') === 'true';
  } catch {
    return false;
  }
}

function loadAlertPrefs(): AlertPrefs {
  try {
    const raw = localStorage.getItem('nw-alerts');
    if (!raw) return { ...ALERT_DEFAULT, types: { ...ALERT_DEFAULT.types } };

    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed) ||
      hasPrototypePollution(parsed)
    ) {
      return { ...ALERT_DEFAULT, types: { ...ALERT_DEFAULT.types } };
    }

    const obj = parsed as Record<string, unknown>;
    const result: AlertPrefs = {
      ...ALERT_DEFAULT,
      types: { ...ALERT_DEFAULT.types },
    };

    result.email = typeof obj.email === 'boolean' ? obj.email : ALERT_DEFAULT.email;
    result.sms = typeof obj.sms === 'boolean' ? obj.sms : ALERT_DEFAULT.sms;

    if (typeof obj.emailAddr === 'string') {
      result.emailAddr = obj.emailAddr.substring(0, 200);
    }
    if (typeof obj.phone === 'string') {
      result.phone = obj.phone.substring(0, 30);
    }

    if (
      obj.types &&
      typeof obj.types === 'object' &&
      !Array.isArray(obj.types) &&
      !hasPrototypePollution(obj.types)
    ) {
      const types = obj.types as Record<string, unknown>;
      const validKeys: (keyof AlertTypes)[] = [
        'overspend', 'sync', 'bills', 'goals', 'anomaly', 'velocity', 'weekly',
      ];
      for (const key of validKeys) {
        if (typeof types[key] === 'boolean') {
          result.types[key] = types[key] as boolean;
        }
      }
    }

    return result;
  } catch {
    return { ...ALERT_DEFAULT, types: { ...ALERT_DEFAULT.types } };
  }
}

function loadAdPrefs(): AdPrefs {
  try {
    const raw = localStorage.getItem('nw-ad-prefs');
    if (!raw) return { ...AD_DEFAULT };

    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed) ||
      hasPrototypePollution(parsed)
    ) {
      return { ...AD_DEFAULT };
    }

    const obj = parsed as Record<string, unknown>;
    return {
      showNativeAds: typeof obj.showNativeAds === 'boolean' ? obj.showNativeAds : AD_DEFAULT.showNativeAds,
      showPremiumBanner: typeof obj.showPremiumBanner === 'boolean' ? obj.showPremiumBanner : AD_DEFAULT.showPremiumBanner,
      showPartnerOffers: typeof obj.showPartnerOffers === 'boolean' ? obj.showPartnerOffers : AD_DEFAULT.showPartnerOffers,
    };
  } catch {
    return { ...AD_DEFAULT };
  }
}

function loadCreditScoreHistory(): CreditScore[] {
  try {
    const raw = localStorage.getItem('nw-credit-history');
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .slice(0, 200)
      .filter((h: unknown): h is CreditScore => {
        if (!h || typeof h !== 'object' || Array.isArray(h)) return false;
        const obj = h as Record<string, unknown>;
        if (typeof obj.score !== 'number' || obj.score < 300 || obj.score > 850) return false;
        if (typeof obj.date !== 'string') return false;
        if (obj.source !== undefined && typeof obj.source !== 'string') return false;
        return true;
      });
  } catch {
    return [];
  }
}

function loadFeatureRequests(): FeatureRequest[] {
  try {
    const raw = localStorage.getItem('nw-feature-requests');
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const validPriorities = ['low', 'medium', 'high', 'critical'];
    return parsed
      .slice(0, 100)
      .filter((f: unknown): f is FeatureRequest => {
        if (!f || typeof f !== 'object' || Array.isArray(f)) return false;
        const obj = f as Record<string, unknown>;
        if (typeof obj.title !== 'string' || obj.title.length > 200) return false;
        if (obj.priority && !validPriorities.includes(obj.priority as string)) return false;
        return true;
      });
  } catch {
    return [];
  }
}

function loadBugReports(): BugReport[] {
  try {
    const raw = localStorage.getItem('nw-bug-reports');
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .slice(0, 100)
      .filter((b: unknown): b is BugReport => {
        if (!b || typeof b !== 'object' || Array.isArray(b)) return false;
        const obj = b as Record<string, unknown>;
        return typeof obj.title === 'string' && obj.title.length <= 200;
      });
  } catch {
    return [];
  }
}

// --- Store interface ---

interface NestWorthState {
  // Navigation
  currentTab: TabName;
  currentPage: string | null;
  drawerOpen: boolean;
  sheetOpen: boolean;
  sheetTitle: string;
  sheetContent: React.ReactNode | null;

  // User preferences
  theme: ThemeName;
  sidebarCollapsed: boolean;
  alertPrefs: AlertPrefs;
  adPrefs: AdPrefs;

  // User data
  creditScoreHistory: CreditScore[];
  featureRequests: FeatureRequest[];
  bugReports: BugReport[];

  // Actions — Navigation
  setTab: (tab: TabName) => void;
  setPage: (page: string | null) => void;
  toggleDrawer: () => void;
  openSheet: (title: string, content: React.ReactNode) => void;
  closeSheet: () => void;

  // Actions — Preferences
  setTheme: (theme: ThemeName) => void;
  toggleSidebar: () => void;
  setAlertPrefs: (prefs: AlertPrefs) => void;
  setAdPrefs: (prefs: AdPrefs) => void;

  // Actions — User data
  addCreditScore: (score: CreditScore) => void;
  addFeatureRequest: (request: FeatureRequest) => void;
  addBugReport: (report: BugReport) => void;
}

// --- Create store ---
// Initial state is loaded lazily on first client access.
// During SSR, defaults are used (localStorage is not available).

export const useNestWorthStore = create<NestWorthState>()((set) => ({
  // Navigation
  currentTab: 'home',
  currentPage: null,
  drawerOpen: false,
  sheetOpen: false,
  sheetTitle: '',
  sheetContent: null,

  // User preferences (loaded from localStorage in hydration)
  theme: 'emerald',
  sidebarCollapsed: false,
  alertPrefs: { ...ALERT_DEFAULT, types: { ...ALERT_DEFAULT.types } },
  adPrefs: { ...AD_DEFAULT },

  // User data
  creditScoreHistory: [],
  featureRequests: [],
  bugReports: [],

  // Actions — Navigation
  setTab: (tab) =>
    set({ currentTab: tab, currentPage: null, sheetOpen: false, drawerOpen: false }),

  setPage: (page) =>
    set({ currentPage: page, sheetOpen: false, drawerOpen: false }),

  toggleDrawer: () =>
    set((state) => ({ drawerOpen: !state.drawerOpen })),

  openSheet: (title, content) =>
    set({ sheetOpen: true, sheetTitle: title, sheetContent: content }),

  closeSheet: () =>
    set({ sheetOpen: false, sheetTitle: '', sheetContent: null }),

  // Actions — Preferences
  setTheme: (theme) => {
    if (!VALID_THEMES.includes(theme)) return;
    try {
      localStorage.setItem('nw-theme', theme);
    } catch { /* noop */ }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    set({ theme });
  },

  toggleSidebar: () =>
    set((state) => {
      const next = !state.sidebarCollapsed;
      try {
        localStorage.setItem('nw-sidebar-collapsed', String(next));
      } catch { /* noop */ }
      return { sidebarCollapsed: next };
    }),

  setAlertPrefs: (prefs) => {
    try {
      localStorage.setItem('nw-alerts', JSON.stringify(prefs));
    } catch { /* noop */ }
    set({ alertPrefs: prefs });
  },

  setAdPrefs: (prefs) => {
    try {
      localStorage.setItem('nw-ad-prefs', JSON.stringify(prefs));
    } catch { /* noop */ }
    set({ adPrefs: prefs });
  },

  // Actions — User data (with input validation)
  addCreditScore: (score) => {
    // Validate score before persisting
    if (typeof score.score !== 'number' || score.score < 300 || score.score > 850) return;
    if (typeof score.date !== 'string' || score.date.length > 50) return;
    if (score.source !== undefined && (typeof score.source !== 'string' || score.source.length > 100)) return;

    set((state) => {
      const next = [score, ...state.creditScoreHistory].slice(0, 200);
      try {
        localStorage.setItem('nw-credit-history', JSON.stringify(next));
      } catch { /* noop */ }
      return { creditScoreHistory: next };
    });
  },

  addFeatureRequest: (request) => {
    // Validate request before persisting
    if (typeof request.title !== 'string' || request.title.length === 0 || request.title.length > 200) return;
    if (request.description !== undefined && (typeof request.description !== 'string' || request.description.length > 2000)) return;
    const validPriorities = ['low', 'medium', 'high', 'critical'];
    if (request.priority && !validPriorities.includes(request.priority)) return;

    set((state) => {
      const next = [...state.featureRequests, request].slice(0, 100);
      try {
        localStorage.setItem('nw-feature-requests', JSON.stringify(next));
      } catch { /* noop */ }
      return { featureRequests: next };
    });
  },

  addBugReport: (report) => {
    // Validate report before persisting
    if (typeof report.title !== 'string' || report.title.length === 0 || report.title.length > 200) return;
    if (report.description !== undefined && (typeof report.description !== 'string' || report.description.length > 2000)) return;

    set((state) => {
      const next = [...state.bugReports, report].slice(0, 100);
      try {
        localStorage.setItem('nw-bug-reports', JSON.stringify(next));
      } catch { /* noop */ }
      return { bugReports: next };
    });
  },
}));

/**
 * Call this once from a client component to hydrate the store
 * from localStorage. Must run after mount (useEffect).
 */
export function hydrateStore(): void {
  useNestWorthStore.setState({
    theme: loadTheme(),
    sidebarCollapsed: loadSidebarCollapsed(),
    alertPrefs: loadAlertPrefs(),
    adPrefs: loadAdPrefs(),
    creditScoreHistory: loadCreditScoreHistory(),
    featureRequests: loadFeatureRequests(),
    bugReports: loadBugReports(),
  });
}
