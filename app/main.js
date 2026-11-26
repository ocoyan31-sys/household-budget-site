// HomeLedger router and wiring: hash routes, the month picker, and every
// form and button on the site. No network calls anywhere — state lives in
// localStorage (see store.js).
import {
  DEFAULT_MONTH, addToGoal, addTransaction, deleteTransaction, loadState,
  monthLabel, monthOptions, resetState, setBudget, updateTransaction,
} from './store.js';
import {
  renderBudgets, renderDashboard, renderEntryForm, renderGoals,
  renderReport, renderTransactions,
} from './views.js';

const app = document.getElementById('app');
const monthSelect = document.getElementById('month-select');
const resetButton = document.getElementById('reset-data');

let state = loadState();
let month = DEFAULT_MONTH;
let notice = '';

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, queryString] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  const query = Object.fromEntries(new URLSearchParams(queryString ?? ''));
  return { parts, query };
}

function setActiveNav(route) {
  for (const link of document.querySelectorAll('[data-nav]')) {
    link.classList.toggle('active', link.dataset.nav === route);
  }
}

function render() {
  const { parts, query } = parseHash();
  const route = parts[0] ?? '';
  let html = '';

  if (route === 'transactions') {
    setActiveNav('transactions');
    html = renderTransactions(state, month, query);
  } else if (route === 'add') {
    setActiveNav('add');
    html = renderEntryForm(state, month, null);
  } else if (route === 'edit' && parts[1]) {
    setActiveNav('transactions');
    const tx = state.transactions.find((t) => t.id === parts[1]);
    html = tx ? renderEntryForm(state, month, tx)
      : `<h1>Entry not found</h1><p class="lede">That entry was deleted or never existed.</p><p><a class="btn btn-primary" href="#/transactions">Back to transactions</a></p>`;
  } else if (route === 'budgets') {
    setActiveNav('budgets');
    html = renderBudgets(state, month);
  } else if (route === 'goals') {
    setActiveNav('goals');
    html = renderGoals(state);
  } else if (route === 'report') {
    setActiveNav('report');
    html = renderReport(state, month);
  } else {
    setActiveNav('dashboard');
    html = renderDashboard(state, month);
  }

  app.innerHTML = (notice ? `<div class="notice" role="status">${notice}</div>` : '') + html;
  notice = '';
}

function refreshMonths() {
  const options = monthOptions(state);
  monthSelect.innerHTML = options
    .map((m) => `<option value="${m}" ${m === month ? 'selected' : ''}>${monthLabel(m)}</option>`)
    .join('');
  if (!options.includes(month)) month = options[options.length - 1] ?? DEFAULT_MONTH;
}

monthSelect.addEventListener('change', () => {
  month = monthSelect.value;
  render();
});

resetButton.addEventListener('click', () => {
  if (window.confirm('Reset HomeLedger to the example household? Your added, edited and deleted entries will be replaced by the example data.')) {
    state = resetState();
    month = DEFAULT_MONTH;
    refreshMonths();
    notice = 'Example data restored — the Rivera household is back as it was.';
    location.hash = '#/';
    render();
  }
});

app.addEventListener('submit', (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  event.preventDefault();
  const data = new FormData(form);

  if (form.id === 'entry-form') {
    const type = data.get('type') === 'income' ? 'income' : 'expense';
    const entry = {
      type,
      category: type === 'income' ? 'income' : String(data.get('category') || 'other'),
      amount: Number(data.get('amount')),
      date: String(data.get('date')),
      note: String(data.get('note') || '').trim(),
    };
    if (!entry.amount || entry.amount <= 0 || !entry.date) return;
    const editId = form.dataset.editId;
    if (editId) {
      updateTransaction(state, editId, entry);
      notice = `Entry updated — ${entry.type === 'income' ? 'income' : 'spending'} of $${entry.amount.toFixed(2)} saved.`;
    } else {
      addTransaction(state, entry);
      notice = `Entry added — ${entry.type === 'income' ? 'income' : 'spending'} of $${entry.amount.toFixed(2)} saved.`;
    }
    month = entry.date.slice(0, 7);
    refreshMonths();
    location.hash = '#/transactions';
    render();
    return;
  }

  if (form.dataset.budget) {
    const limit = Number(data.get('limit'));
    if (Number.isFinite(limit) && limit >= 0) {
      setBudget(state, form.dataset.budget, limit);
      notice = 'Budget limit saved.';
      render();
    }
    return;
  }

  if (form.dataset.goal) {
    const amount = Number(data.get('amount'));
    if (Number.isFinite(amount) && amount > 0) {
      const goal = addToGoal(state, form.dataset.goal, amount);
      notice = goal ? `$${amount.toFixed(2)} added to “${goal.name}” — now $${goal.saved.toFixed(2)} of $${goal.target.toFixed(2)}.` : '';
      render();
    }
    return;
  }

  if (form.id === 'tx-filter') {
    const params = new URLSearchParams();
    for (const [key, value] of data.entries()) {
      if (value) params.set(key, String(value));
    }
    location.hash = `#/transactions${params.toString() ? `?${params}` : ''}`;
    render();
  }
});

app.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const deleteId = target.dataset.delete;
  if (deleteId) {
    const tx = state.transactions.find((t) => t.id === deleteId);
    if (tx && window.confirm(`Delete this entry (${tx.note || tx.category}, $${tx.amount.toFixed(2)})?`)) {
      deleteTransaction(state, deleteId);
      notice = 'Entry deleted.';
      if (parseHash().parts[0] === 'edit') location.hash = '#/transactions';
      render();
    }
  }
});

refreshMonths();
render();
window.addEventListener('hashchange', render);
