// NestWorth v5 — Sample Data
// Ported from the v4 prototype. All data is typed.

import type {
  NetWorthPoint,
  MonthlySpending,
  CashFlowPoint,
  Merchant,
  SavingsRatePoint,
  MonthlyBudgetPoint,
  ProjectedSavingsPoint,
  ActualSavingsPoint,
  Transaction,
  Account,
  Bill,
  Subscription,
  Nest,
  BudgetCategory,
  IncomeSource,
  IncomeHistoryPoint,
  Achievement,
  ChargeIQResult,
  CoachResponses,
} from './types';

// --- Net Worth History (12 months) ---
export const nwHistory: NetWorthPoint[] = [
  { m: 'May', v: 72400 },
  { m: 'Jun', v: 73800 },
  { m: 'Jul', v: 74200 },
  { m: 'Aug', v: 75600 },
  { m: 'Sep', v: 76100 },
  { m: 'Oct', v: 77800 },
  { m: 'Nov', v: 79200 },
  { m: 'Dec', v: 80100 },
  { m: 'Jan', v: 80800 },
  { m: 'Feb', v: 81200 },
  { m: 'Mar', v: 81900 },
  { m: 'Apr', v: 82450 },
];

// --- Monthly Spending by Category (6 months) ---
export const monthlySpending: MonthlySpending[] = [
  { m: 'Nov', g: 520, d: 310, s: 180, e: 120, t: 90 },
  { m: 'Dec', g: 680, d: 420, s: 350, e: 200, t: 95 },
  { m: 'Jan', g: 490, d: 280, s: 150, e: 100, t: 85 },
  { m: 'Feb', g: 510, d: 300, s: 190, e: 130, t: 88 },
  { m: 'Mar', g: 530, d: 290, s: 210, e: 110, t: 92 },
  { m: 'Apr', g: 480, d: 280, s: 235, e: 85, t: 45 },
];

// --- Cash Flow (6 months) ---
export const cashFlow: CashFlowPoint[] = [
  { m: 'Nov', inc: 7080, exp: 4800 },
  { m: 'Dec', inc: 7080, exp: 5200 },
  { m: 'Jan', inc: 7280, exp: 4400 },
  { m: 'Feb', inc: 7080, exp: 4600 },
  { m: 'Mar', inc: 7280, exp: 4520 },
  { m: 'Apr', inc: 7080, exp: 4320 },
];

// --- Top Merchants (9) ---
export const topMerchants: Merchant[] = [
  { n: 'Whole Foods', total: 1240, count: 18, avg: 68.89 },
  { n: 'Amazon', total: 890, count: 12, avg: 74.17 },
  { n: 'Shell Gas', total: 580, count: 12, avg: 48.33 },
  { n: 'Target', total: 520, count: 8, avg: 65.0 },
  { n: 'Costco', total: 480, count: 4, avg: 120.0 },
  { n: "Trader Joe's", total: 340, count: 8, avg: 42.5 },
  { n: 'Starbucks', total: 180, count: 22, avg: 8.18 },
  { n: 'CVS Pharmacy', total: 165, count: 6, avg: 27.5 },
  { n: 'Uber/Lyft', total: 148, count: 9, avg: 16.44 },
];

// --- Savings Rate History (6 months) ---
export const savingsRateHistory: SavingsRatePoint[] = [
  { m: 'Nov', r: 32 },
  { m: 'Dec', r: 27 },
  { m: 'Jan', r: 40 },
  { m: 'Feb', r: 35 },
  { m: 'Mar', r: 38 },
  { m: 'Apr', r: 39 },
];

// --- Monthly Budget History ---
export const monthlyBudgetHistory: MonthlyBudgetPoint[] = [
  { m: 'Jan', budget: 4400, spent: 4100 },
  { m: 'Feb', budget: 4500, spent: 4200 },
  { m: 'Mar', budget: 4600, spent: 4320 },
  { m: 'Apr', budget: 4600, spent: 2920 },
];

// --- Projected Savings ---
export const projectedSavings: ProjectedSavingsPoint[] = [
  { m: 'May', actual: null, proj: 9000 },
  { m: 'Jun', actual: null, proj: 11760 },
  { m: 'Jul', actual: null, proj: 14520 },
  { m: 'Aug', actual: null, proj: 17280 },
  { m: 'Sep', actual: null, proj: 20040 },
  { m: 'Oct', actual: null, proj: 22800 },
  { m: 'Nov', actual: null, proj: 25560 },
  { m: 'Dec', actual: null, proj: 28320 },
];

// --- Actual Savings ---
export const actualSavings: ActualSavingsPoint[] = [
  { m: 'Jan', v: 2760 },
  { m: 'Feb', v: 5240 },
  { m: 'Mar', v: 8000 },
  { m: 'Apr', v: 10760 },
];

// --- Transactions (16+) ---
export const transactions: Transaction[] = [
  { who: 'V', name: 'Whole Foods', category: 'Groceries', amount: -67.43, date: 'Today' },
  { who: 'C', name: 'TreatYoSelf', category: 'Clothing', amount: -650.00, date: 'Yesterday', flagged: true },
  { who: 'V', name: 'Shell Gas', category: 'Transport', amount: -48.20, date: 'Yesterday' },
  { who: 'J', name: 'Mortgage', category: 'Housing', amount: -2000, date: 'Friday' },
  { who: 'C', name: 'Target Refund', category: 'Refund', amount: 84.50, date: 'Apr 10', refund: true },
  { who: 'V', name: 'Netflix', category: 'Subscriptions', amount: -15.49, date: 'Apr 10' },
  { who: 'C', name: 'Amazon', category: 'Shopping', amount: -150.00, date: 'Apr 10' },
  { who: 'V', name: 'ALTA Payroll', category: 'Income', amount: 4280, date: 'Apr 11', income: true },
  { who: 'V', name: 'Costco', category: 'Groceries', amount: -124.30, date: 'Apr 8' },
  { who: 'C', name: 'Starbucks', category: 'Dining', amount: -6.75, date: 'Apr 8' },
  { who: 'V', name: 'Trader Joe\'s', category: 'Groceries', amount: -42.50, date: 'Apr 7' },
  { who: 'C', name: 'Uber Eats', category: 'Dining', amount: -32.00, date: 'Apr 7' },
  { who: 'J', name: 'Insurance', category: 'Insurance', amount: -184.00, date: 'Apr 5' },
  { who: 'V', name: 'CVS Pharmacy', category: 'Health', amount: -27.50, date: 'Apr 4' },
  { who: 'C', name: 'Caroline Freelance', category: 'Income', amount: 2800, date: 'Apr 1', income: true },
  { who: 'V', name: 'Gym', category: 'Fitness', amount: -50.00, date: 'Apr 1' },
];

// --- Accounts (6) ---
export const accounts: Account[] = [
  { name: 'Chase Checking', type: 'Checking', value: 5360, status: 'ok', lastSync: '2h', owner: 'Joint' },
  { name: 'Chase Savings', type: 'Savings', value: 12400, status: 'ok', lastSync: '2h', owner: 'Joint' },
  { name: 'Capital One', type: 'Checking', value: 2100, status: 'warn', lastSync: '3d', owner: 'Von' },
  { name: 'Cap One Savings', type: 'Savings', value: 8200, status: 'stale', lastSync: '47d', owner: 'Caroline' },
  { name: 'Ally Invest', type: 'Investment', value: 26500, status: 'ok', lastSync: '1d', owner: 'Von' },
  { name: 'Credit Cards', type: 'Credit', value: -1200, status: 'ok', lastSync: '6h', owner: 'Joint' },
];

// --- Bills (9) ---
export const bills: Bill[] = [
  { name: 'Mortgage', amount: 2000, dueLabel: '1st', dueDay: 1, autopay: true, paid: true },
  { name: 'Insurance', amount: 184, dueLabel: '5th', dueDay: 5, autopay: true, paid: true },
  { name: 'Electric', amount: 145, dueLabel: '10th', dueDay: 10, autopay: false },
  { name: 'Water', amount: 65, dueLabel: '12th', dueDay: 12, autopay: false },
  { name: 'Internet', amount: 89, dueLabel: '15th', dueDay: 15, autopay: true },
  { name: 'Car Payment', amount: 385, dueLabel: '15th', dueDay: 15, autopay: true },
  { name: 'Phone', amount: 140, dueLabel: '18th', dueDay: 18, autopay: true },
  { name: 'Gym', amount: 50, dueLabel: '20th', dueDay: 20, autopay: true },
  { name: 'Student Loans', amount: 320, dueLabel: '25th', dueDay: 25, autopay: true },
];

// --- Subscriptions (12) ---
export const subscriptions: Subscription[] = [
  { name: 'Netflix', amount: 15.49, owner: 'Shared', ok: true, usageScore: 9, category: 'Entertainment' },
  { name: 'Hulu', amount: 17.99, owner: 'Shared', issue: 'Low use', usageScore: 3, category: 'Entertainment' },
  { name: 'Disney+', amount: 13.99, owner: 'Caroline', issue: '<5%', usageScore: 1, category: 'Entertainment' },
  { name: 'Headspace', amount: 14.99, owner: 'Von', issue: '60d', usageScore: 2, category: 'Wellness' },
  { name: 'Adobe CC', amount: 22.99, owner: 'Caroline', issue: '90d', usageScore: 1, category: 'Productivity' },
  { name: 'Spotify', amount: 16.99, owner: 'Shared', ok: true, usageScore: 10, category: 'Entertainment' },
  { name: 'iCloud', amount: 2.99, owner: 'Von', ok: true, usageScore: 8, category: 'Storage' },
  { name: 'YouTube Premium', amount: 13.99, owner: 'Shared', ok: true, usageScore: 7, category: 'Entertainment' },
  { name: 'Gym', amount: 50, owner: 'Shared', ok: true, usageScore: 6, category: 'Fitness' },
  { name: 'NYT', amount: 4.25, owner: 'Von', ok: true, usageScore: 5, category: 'News' },
  { name: 'ChatGPT Plus', amount: 20, owner: 'Von', ok: true, usageScore: 9, category: 'AI' },
  { name: 'Dropbox', amount: 11.99, owner: 'Caroline', issue: 'Low use', usageScore: 2, category: 'Storage' },
];

// --- Nests / Savings Goals (6) ---
export const nests: Nest[] = [
  { name: 'Emergency', current: 3600, goal: 5000, autoAmount: 15, frequency: 'Daily' },
  { name: 'Hawaii', current: 1800, goal: 4000, autoAmount: 25, frequency: 'Weekly' },
  { name: 'Mortgage DP', current: 2100, goal: 10000, autoAmount: 50, frequency: 'Biweekly' },
  { name: 'College', current: 450, goal: 20000, autoAmount: 10, frequency: 'Daily' },
  { name: 'New Car', current: 800, goal: 8000, autoAmount: 20, frequency: 'Weekly' },
  { name: 'Wedding Fund', current: 1200, goal: 5000, autoAmount: 30, frequency: 'Weekly' },
];

// --- Budget Categories (10) ---
export const budgetCategories: BudgetCategory[] = [
  { name: 'Housing', allocated: 2400, spent: 1500, fixed: true },
  { name: 'Groceries', allocated: 800, spent: 480 },
  { name: 'Dining Out', allocated: 300, spent: 280, warning: true },
  { name: 'Shopping', allocated: 200, spent: 235, over: true },
  { name: 'Entertainment', allocated: 150, spent: 85 },
  { name: 'Transport', allocated: 200, spent: 120 },
  { name: 'Subscriptions', allocated: 100, spent: 62 },
  { name: 'Health', allocated: 150, spent: 45 },
  { name: 'Personal', allocated: 200, spent: 90 },
  { name: 'Misc', allocated: 100, spent: 23 },
];

// --- Income Sources (5) ---
export const incomeSources: IncomeSource[] = [
  { source: 'ALTA Payroll (Von)', frequency: 'Biweekly', nextDate: 'Apr 25', amount: '$4,280', amountNum: 4280, status: 'ok' },
  { source: 'Freelance (Caroline)', frequency: 'Monthly', nextDate: 'Apr 15', amount: '~$2,800', amountNum: 2800, status: 'due' },
  { source: 'Rental', frequency: 'Monthly 1st', nextDate: 'May 1', amount: '$1,200', amountNum: 1200, status: 'ok' },
  { source: 'Etsy Shop (Caroline)', frequency: 'Weekly', nextDate: 'Apr 21', amount: '~$320', amountNum: 320, status: 'ok' },
  { source: 'Stock Dividends', frequency: 'Quarterly', nextDate: 'Jun 15', amount: '$185', amountNum: 185, status: 'ok' },
];

// --- Income History (12 months) ---
export const incomeHistory: IncomeHistoryPoint[] = [
  { m: 'May', v: 7800 },
  { m: 'Jun', v: 8100 },
  { m: 'Jul', v: 7400 },
  { m: 'Aug', v: 8280 },
  { m: 'Sep', v: 7080 },
  { m: 'Oct', v: 8560 },
  { m: 'Nov', v: 7080 },
  { m: 'Dec', v: 7080 },
  { m: 'Jan', v: 7280 },
  { m: 'Feb', v: 7080 },
  { m: 'Mar', v: 7280 },
  { m: 'Apr', v: 7080 },
];

// --- Achievements ---
export const achievements: Achievement[] = [
  { name: 'Budget Streak', description: '14 days under budget', done: true, date: 'Apr 14' },
  { name: 'First Nest', description: 'Created first savings goal', done: true, date: 'Jan 15' },
  { name: '$1k Saved', description: 'Auto-saved over $1,000', done: true, date: 'Feb 22' },
  { name: '$5k Saved', description: 'Auto-saved over $5,000', done: true, date: 'Mar 30' },
  { name: 'Net Worth $100k', description: 'Reach $100k net worth', done: false, progress: 82 },
  { name: '3-Month Fund', description: 'Emergency fund covers 3 months', done: false, progress: 28 },
  { name: 'Debt Free', description: 'Pay off all consumer debt', done: false, progress: 65 },
  { name: 'Bill Master', description: 'All bills on autopay', done: false, progress: 78 },
  { name: 'Money Date x4', description: '4 money dates completed', done: true, date: 'Apr 1' },
  { name: 'Scanner Pro', description: '10 receipts scanned', done: false, progress: 30 },
];

// --- ChargeIQ Demo Data (6 charges) ---
export const chargeIQDemoCharges: ChargeIQResult[] = [
  {
    raw: 'APCR*DIGITALRVRM',
    merchant: 'Apple Card - Digital River',
    description: 'Software/App purchase via Apple payment system',
    category: 'Software',
    confidence: 92,
    phone: '1-800-275-2273',
    website: 'apple.com/card',
  },
  {
    raw: 'SQ *EBC CO LLC',
    merchant: 'East Bay Coffee Co.',
    description: 'Local coffee shop using Square POS',
    category: 'Dining',
    confidence: 88,
    phone: '(510) 555-0142',
    website: 'eastbaycoffee.com',
  },
  {
    raw: 'PAYPAL *STEAMGAMES',
    merchant: 'Steam (Valve Corp)',
    description: 'Video game purchase via PayPal',
    category: 'Entertainment',
    confidence: 95,
    phone: '1-425-889-9642',
    website: 'store.steampowered.com',
  },
  {
    raw: 'TST* BURGER BARN',
    merchant: 'Burger Barn Restaurant',
    description: 'Restaurant using Toast POS system',
    category: 'Dining',
    confidence: 91,
    phone: '(703) 555-0188',
    website: 'burgerbarn.com',
  },
  {
    raw: 'AMZN MKTP US*2K4J',
    merchant: 'Amazon Marketplace',
    description: 'Third-party seller purchase on Amazon',
    category: 'Shopping',
    confidence: 97,
    phone: '1-888-280-4331',
    website: 'amazon.com',
  },
  {
    raw: 'VZWRLSS*APOCC VB',
    merchant: 'Verizon Wireless',
    description: 'Monthly phone plan payment',
    category: 'Bills',
    confidence: 94,
    phone: '1-800-922-0204',
    website: 'verizon.com',
  },
];

// --- Coach AI Responses ---
export const coachResponses: CoachResponses = {
  Spending:
    'This week:\n\n\u2022 Von: $145\n\u2022 Caroline: $755 (TreatYoSelf $650)\n\nSpending 38% faster than average. May exceed budget by $420.',
  Sync:
    'Cap One Savings disconnected by Caroline Mar 12. 47 days stale. Cross-reference shows 3 unmatched ($342).\n\nMonarch shows stale numbers silently. We flag it.',
  Bills:
    '4 savings opportunities:\n1. Insurance: -$38\n2. Streaming: -$24\n3. Internet: -$25\n4. Phone: -$60\n\n+3 unused subs: $62\nTotal: $209/mo \u2192 $2,508/yr',
  Save:
    '7 moves for $409/mo ($4,908/yr):\n1. Bill audit $147\n2. Drop subs $62\n3. Tighten Shopping\n4. Tighten Dining\n5. Round-Ups for Caroline\n6. Bump daily save\n7. Switch phone',
  Audit:
    'Mar 12 \u2014 Caroline disconnected Cap One\nMar 10 \u2014 Caroline deleted Target $84.50\nMar 14 \u2014 Von reconnected\nFeb 25 \u2014 Recategorized Amazon\nFeb 20 \u2014 Von exported Q1',
  Forecast:
    'At current pace:\n\u2022 End of April: $84,800\n\u2022 End of Q2: $89,200\n\u2022 End of Year: $115,400\n\nWith bill audit savings applied:\n\u2022 End of Year: $117,200 (+$1,764)',
  Budget:
    'April budget: $4,600 total, $2,920 spent (63%).\n\nYou have $1,680 left across 12 days ($140/day safe rate).\n\nShopping is $35 over cap. All other categories are tracking within limits.\n\nAt this pace, you\'ll finish April with ~$1,000 surplus.',
};

// --- Theme meta colors (for <meta name="theme-color">) ---
export const themeMetaColors: Record<string, string> = {
  emerald: '#1a5e3a',
  light: '#f2f2f7',
  dark: '#000000',
  midnight: '#0a0e1a',
  gold: '#12100b',
};
