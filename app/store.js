// HomeLedger store: loads the seed data, keeps every change in localStorage
// (nothing leaves the browser), and answers the questions every view asks:
// totals for a month, spending by category, budget progress, goal progress.
import {
  CATEGORIES, MONTHLY_BUDGETS, SAVINGS_GOALS, SEED_TRANSACTIONS,
  STARTING_BALANCE, DEFAULT_MONTH, MONTHS,
} from './data.js';

const STORAGE_KEY = 'homeledger-v1';

function freshState() {
  return {
    transactions: structuredClone(SEED_TRANSACTIONS),
    budgets: { ...MONTHLY_BUDGETS },
    goals: structuredClone(SAVINGS_GOALS),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.transactions) || typeof parsed.budgets !== 'object') return freshState();
    return parsed;
  } catch {
    return freshState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return freshState();
}

export function categoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function categoryGroup(id) {
  return CATEGORIES.find((c) => c.id === id)?.group ?? 'other';
}

export function monthLabel(month) {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function monthOptions(state) {
  const seen = new Set(MONTHS);
  for (const t of state.transactions) seen.add(t.date.slice(0, 7));
  return [...seen].sort();
}

export function monthTransactions(state, month) {
  return state.transactions
    .filter((t) => t.date.startsWith(month))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function monthTotals(state, month) {
  let income = 0;
  let spent = 0;
  for (const t of state.transactions) {
    if (!t.date.startsWith(month)) continue;
    if (t.type === 'income') income += t.amount;
    else spent += t.amount;
  }
  return { income, spent, net: income - spent };
}

export function balanceThrough(state, month) {
  let balance = STARTING_BALANCE;
  for (const t of state.transactions) {
    if (t.date.slice(0, 7) > month) continue;
    balance += t.type === 'income' ? t.amount : -t.amount;
  }
  return balance;
}

export function spendingByCategory(state, month) {
  const totals = new Map();
  for (const t of state.transactions) {
    if (t.type !== 'expense' || !t.date.startsWith(month)) continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  }
  return [...totals.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function budgetRows(state, month) {
  const spent = new Map(spendingByCategory(state, month).map((r) => [r.category, r.amount]));
  return Object.entries(state.budgets)
    .map(([category, limit]) => {
      const used = spent.get(category) ?? 0;
      return { category, limit, used, left: limit - used, pct: limit > 0 ? used / limit : 0 };
    })
    .sort((a, b) => b.pct - a.pct);
}

export function dailySpending(state, month) {
  const days = new Map();
  for (const t of state.transactions) {
    if (t.type !== 'expense' || !t.date.startsWith(month)) continue;
    const day = Number(t.date.slice(8, 10));
    days.set(day, (days.get(day) ?? 0) + t.amount);
  }
  return [...days.entries()].sort((a, b) => a[0] - b[0]);
}

export function addTransaction(state, entry) {
  const tx = {
    id: `u${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`,
    ...entry,
    amount: Math.round(entry.amount * 100) / 100,
  };
  state.transactions.push(tx);
  saveState(state);
  return tx;
}

export function updateTransaction(state, id, entry) {
  const tx = state.transactions.find((t) => t.id === id);
  if (!tx) return null;
  Object.assign(tx, entry, { amount: Math.round(entry.amount * 100) / 100 });
  saveState(state);
  return tx;
}

export function deleteTransaction(state, id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  saveState(state);
}

export function setBudget(state, category, limit) {
  state.budgets[category] = Math.max(0, Math.round(limit * 100) / 100);
  saveState(state);
}

export function addToGoal(state, goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return null;
  goal.saved = Math.round((goal.saved + amount) * 100) / 100;
  saveState(state);
  return goal;
}

export function formatMoney(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export { DEFAULT_MONTH };
