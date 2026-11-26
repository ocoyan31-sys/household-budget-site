// HomeLedger seed data: the example household's money, so the site opens
// with real figures instead of empty tables. Everything here is fiction —
// original names, amounts and notes written for this site. A visitor can
// clear it all with "Reset to the example household" or delete entries one
// by one. Amounts are in US dollars.

export const HOUSEHOLD_NAME = 'The Rivera household';
export const STARTING_BALANCE = 2340; // cash on hand before October 2026

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', group: 'housing' },
  { id: 'groceries', label: 'Groceries', group: 'food' },
  { id: 'dining', label: 'Dining out', group: 'food' },
  { id: 'utilities', label: 'Utilities & bills', group: 'bills' },
  { id: 'transport', label: 'Transport', group: 'transport' },
  { id: 'health', label: 'Health', group: 'health' },
  { id: 'kids', label: 'Kids & school', group: 'kids' },
  { id: 'entertainment', label: 'Entertainment', group: 'fun' },
  { id: 'clothing', label: 'Clothing', group: 'other' },
  { id: 'income', label: 'Income', group: 'income' },
  { id: 'other', label: 'Other', group: 'other' },
];

export const MONTHLY_BUDGETS = {
  housing: 1450,
  groceries: 650,
  dining: 200,
  utilities: 230,
  transport: 260,
  health: 150,
  kids: 250,
  entertainment: 120,
  clothing: 100,
};

export const SAVINGS_GOALS = [
  { id: 'emergency', name: 'Emergency fund', target: 5000, saved: 3150,
    note: 'Three months of essentials, kept in a separate savings account.' },
  { id: 'vacation', name: 'Summer road trip', target: 1800, saved: 720,
    note: 'Gas, motels and park passes for a week on the coast.' },
  { id: 'laptop', name: 'New laptop for Maya', target: 900, saved: 410,
    note: 'The old one shuts off when the battery dips below 20%.' },
];

// id, date (YYYY-MM-DD), type, category, amount, note
export const SEED_TRANSACTIONS = [
  // ---- October 2026 ----
  { id: 't101', date: '2026-10-01', type: 'income', category: 'income', amount: 3400, note: 'Salary — Maya (Riverbend Clinic)' },
  { id: 't102', date: '2026-10-01', type: 'income', category: 'income', amount: 2150, note: 'Salary — Jordan (City Transit)' },
  { id: 't103', date: '2026-10-02', type: 'expense', category: 'housing', amount: 1450, note: 'Monthly rent' },
  { id: 't104', date: '2026-10-03', type: 'expense', category: 'groceries', amount: 132.40, note: 'Weekly shop — GreenMart' },
  { id: 't105', date: '2026-10-05', type: 'expense', category: 'transport', amount: 48, note: 'Bus passes for the month' },
  { id: 't106', date: '2026-10-07', type: 'expense', category: 'utilities', amount: 96.20, note: 'Electric bill' },
  { id: 't107', date: '2026-10-09', type: 'expense', category: 'groceries', amount: 118.75, note: 'Weekly shop — GreenMart' },
  { id: 't108', date: '2026-10-11', type: 'expense', category: 'dining', amount: 54.60, note: 'Pizza night with the kids' },
  { id: 't109', date: '2026-10-12', type: 'expense', category: 'kids', amount: 86, note: 'School supplies — Leo' },
  { id: 't110', date: '2026-10-14', type: 'expense', category: 'transport', amount: 62.30, note: 'Fuel — family car' },
  { id: 't111', date: '2026-10-15', type: 'expense', category: 'income', amount: 0, note: '' },
  { id: 't112', date: '2026-10-16', type: 'expense', category: 'groceries', amount: 141.10, note: 'Weekly shop + birthday cake mix' },
  { id: 't113', date: '2026-10-17', type: 'expense', category: 'entertainment', amount: 38, note: 'Movie tickets — family of four' },
  { id: 't114', date: '2026-10-18', type: 'expense', category: 'health', amount: 45, note: 'Pharmacy — allergy medicine' },
  { id: 't115', date: '2026-10-20', type: 'income', category: 'income', amount: 320, note: 'Weekend shifts — Maya' },
  { id: 't116', date: '2026-10-21', type: 'expense', category: 'utilities', amount: 74.50, note: 'Internet + phone' },
  { id: 't117', date: '2026-10-22', type: 'expense', category: 'groceries', amount: 126.85, note: 'Weekly shop — GreenMart' },
  { id: 't118', date: '2026-10-24', type: 'expense', category: 'dining', amount: 47.90, note: 'Lunch out after soccer practice' },
  { id: 't119', date: '2026-10-25', type: 'expense', category: 'clothing', amount: 79.99, note: 'Winter jackets — kids' },
  { id: 't120', date: '2026-10-27', type: 'expense', category: 'transport', amount: 58.40, note: 'Fuel — family car' },
  { id: 't121', date: '2026-10-28', type: 'expense', category: 'groceries', amount: 119.60, note: 'Weekly shop — GreenMart' },
  { id: 't122', date: '2026-10-30', type: 'expense', category: 'other', amount: 35, note: 'Haircuts — both kids' },
  // ---- November 2026 ----
  { id: 't201', date: '2026-11-01', type: 'income', category: 'income', amount: 3400, note: 'Salary — Maya (Riverbend Clinic)' },
  { id: 't202', date: '2026-11-01', type: 'income', category: 'income', amount: 2150, note: 'Salary — Jordan (City Transit)' },
  { id: 't203', date: '2026-11-02', type: 'expense', category: 'housing', amount: 1450, note: 'Monthly rent' },
  { id: 't204', date: '2026-11-03', type: 'expense', category: 'groceries', amount: 138.20, note: 'Weekly shop — GreenMart' },
  { id: 't205', date: '2026-11-04', type: 'expense', category: 'transport', amount: 48, note: 'Bus passes for the month' },
  { id: 't206', date: '2026-11-05', type: 'expense', category: 'utilities', amount: 102.40, note: 'Electric bill' },
  { id: 't207', date: '2026-11-06', type: 'expense', category: 'dining', amount: 63.50, note: 'Dinner out — Maya and Jordan' },
  { id: 't208', date: '2026-11-08', type: 'expense', category: 'groceries', amount: 121.55, note: 'Weekly shop — GreenMart' },
  { id: 't209', date: '2026-11-09', type: 'expense', category: 'kids', amount: 112, note: 'School field trip — Leo' },
  { id: 't210', date: '2026-11-10', type: 'expense', category: 'health', amount: 68, note: 'Dentist check-up — Ana' },
  { id: 't211', date: '2026-11-11', type: 'expense', category: 'transport', amount: 64.10, note: 'Fuel — family car' },
  { id: 't212', date: '2026-11-12', type: 'expense', category: 'entertainment', amount: 29.99, note: 'Streaming subscription' },
  { id: 't213', date: '2026-11-13', type: 'expense', category: 'groceries', amount: 146.80, note: 'Weekly shop + Thanksgiving supplies' },
  { id: 't214', date: '2026-11-14', type: 'income', category: 'income', amount: 480, note: 'Freelance design — Jordan' },
  { id: 't215', date: '2026-11-15', type: 'expense', category: 'utilities', amount: 78.90, note: 'Internet + phone' },
  { id: 't216', date: '2026-11-16', type: 'expense', category: 'kids', amount: 94.50, note: 'New shoes — Ana' },
  { id: 't217', date: '2026-11-17', type: 'expense', category: 'dining', amount: 58.25, note: 'Takeout — busy Tuesday' },
  { id: 't218', date: '2026-11-18', type: 'expense', category: 'groceries', amount: 129.40, note: 'Weekly shop — GreenMart' },
  { id: 't219', date: '2026-11-19', type: 'expense', category: 'transport', amount: 57.60, note: 'Fuel — family car' },
  { id: 't220', date: '2026-11-20', type: 'expense', category: 'entertainment', amount: 42, note: 'Board game night supplies' },
  { id: 't221', date: '2026-11-21', type: 'expense', category: 'health', amount: 52.75, note: 'Pharmacy — vitamins and cold medicine' },
  { id: 't222', date: '2026-11-22', type: 'expense', category: 'groceries', amount: 118.90, note: 'Weekly shop — GreenMart' },
  { id: 't223', date: '2026-11-23', type: 'expense', category: 'dining', amount: 71.40, note: 'Thanksgiving dinner with grandparents' },
  { id: 't224', date: '2026-11-24', type: 'expense', category: 'clothing', amount: 64.99, note: 'Work shirt — Jordan' },
  { id: 't225', date: '2026-11-25', type: 'expense', category: 'other', amount: 40, note: 'Gift for neighbour’s new baby' },
].filter((t) => t.amount > 0);

export const MONTHS = ['2026-10', '2026-11'];
export const DEFAULT_MONTH = '2026-11';
