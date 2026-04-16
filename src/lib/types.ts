// NestWorth v5 — Shared TypeScript Types

export type ThemeName = 'emerald' | 'light' | 'dark' | 'midnight' | 'gold';

export const VALID_THEMES: ThemeName[] = ['emerald', 'light', 'dark', 'midnight', 'gold'];

export const TABS = ['home', 'spend', 'save', 'money', 'coach'] as const;
export type TabName = (typeof TABS)[number];

// --- Navigation ---

export interface SheetState {
  open: boolean;
  title: string;
  content: React.ReactNode | null;
}

// --- User Preferences ---

export interface AlertTypes {
  overspend: boolean;
  sync: boolean;
  bills: boolean;
  goals: boolean;
  anomaly: boolean;
  velocity: boolean;
  weekly: boolean;
}

export interface AlertPrefs {
  email: boolean;
  sms: boolean;
  emailAddr: string;
  phone: string;
  types: AlertTypes;
}

export interface AdPrefs {
  showNativeAds: boolean;
  showPremiumBanner: boolean;
  showPartnerOffers: boolean;
}

// --- Financial Data ---

export interface NetWorthPoint {
  m: string;
  v: number;
}

export interface MonthlySpending {
  m: string;
  g: number; // groceries
  d: number; // dining
  s: number; // shopping
  e: number; // entertainment
  t: number; // transport
}

export interface CashFlowPoint {
  m: string;
  inc: number;
  exp: number;
}

export interface Merchant {
  n: string;
  total: number;
  count: number;
  avg: number;
}

export interface SavingsRatePoint {
  m: string;
  r: number;
}

export interface MonthlyBudgetPoint {
  m: string;
  budget: number;
  spent: number;
}

export interface ProjectedSavingsPoint {
  m: string;
  actual: number | null;
  proj: number;
}

export interface ActualSavingsPoint {
  m: string;
  v: number;
}

// --- Transactions ---

export interface Transaction {
  who: string;
  name: string;
  category: string;
  amount: string;
  date: string;
  flagged?: boolean;
  refund?: boolean;
  income?: boolean;
}

// --- Accounts ---

export interface Account {
  name: string;
  type: string;
  value: number;
  status: 'ok' | 'warn' | 'stale';
  lastSync: string;
  owner: string;
}

// --- Bills ---

export interface Bill {
  name: string;
  amount: number;
  dueLabel: string;
  dueDay: number;
  autopay: boolean;
  paid?: boolean;
}

// --- Subscriptions ---

export interface Subscription {
  name: string;
  amount: number;
  owner: string;
  issue?: string;
  usageScore: number;
  category: string;
  ok?: boolean;
}

// --- Savings Nests / Goals ---

export interface Nest {
  name: string;
  current: number;
  goal: number;
  autoAmount: number;
  frequency: 'Daily' | 'Weekly' | 'Biweekly' | 'Monthly';
}

// --- Budget ---

export interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  fixed?: boolean;
  warning?: boolean;
  over?: boolean;
}

// --- Income ---

export interface IncomeSource {
  source: string;
  frequency: string;
  nextDate: string;
  amount: string;
  amountNum: number;
  status: 'ok' | 'due';
}

export interface IncomeHistoryPoint {
  m: string;
  v: number;
}

// --- Achievements ---

export interface Achievement {
  name: string;
  description: string;
  done: boolean;
  date?: string;
  progress?: number;
}

// --- Credit Score ---

export interface CreditScore {
  score: number;
  date: string;
  source?: string;
}

// --- Feature Requests & Bug Reports ---

export interface FeatureRequest {
  title: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  date?: string;
  description?: string;
}

export interface BugReport {
  title: string;
  date?: string;
  description?: string;
  severity?: string;
}

// --- ChargeIQ ---

export interface ChargeIQResult {
  raw: string;
  merchant: string;
  description: string;
  category: string;
  confidence: number;
  phone: string;
  website: string;
}

// --- Coach ---

export interface CoachResponses {
  [key: string]: string;
}

// --- Trend ---

export interface TrendResult {
  direction: 'up' | 'down' | 'flat';
  percent: number;
}
