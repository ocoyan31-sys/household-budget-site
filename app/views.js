// HomeLedger views: one render function per page. Every page is reached by
// a link in the header nav, shows real figures from the store, and every
// button on it does something.
import {
  balanceThrough, budgetRows, categoryGroup, categoryLabel, dailySpending,
  formatDate, formatMoney, monthLabel, monthTotals, monthTransactions,
  spendingByCategory,
} from './store.js';
import { CATEGORIES } from './data.js';
import { CHART_COLORS, dailyBars, donutChart, legendList } from './charts.js';

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function txRow(t) {
  const cls = t.type === 'income' ? 'amount-in' : 'amount-out';
  const sign = t.type === 'income' ? '+' : '−';
  return `<tr>
    <td>${formatDate(t.date)}</td>
    <td><span class="cat-chip ${categoryGroup(t.category)}">${esc(categoryLabel(t.category))}</span></td>
    <td>${esc(t.note || '—')}</td>
    <td class="num ${cls}">${sign}${formatMoney(t.amount)}</td>
    <td class="num">
      <a class="btn btn-ghost btn-small" href="#/edit/${t.id}">Edit</a>
      <button type="button" class="btn btn-danger btn-small" data-delete="${t.id}">Delete</button>
    </td>
  </tr>`;
}

export function renderDashboard(state, month) {
  const totals = monthTotals(state, month);
  const balance = balanceThrough(state, month);
  const byCat = spendingByCategory(state, month);
  const rows = byCat.map((r, i) => ({ ...r, label: categoryLabel(r.category), color: CHART_COLORS[i % CHART_COLORS.length] }));
  const recent = monthTransactions(state, month).slice(0, 6);
  const budgets = budgetRows(state, month);
  const over = budgets.filter((b) => b.pct > 1);
  const near = budgets.filter((b) => b.pct >= 0.85 && b.pct <= 1);

  return `
  <h1>${esc(monthLabel(month))} at a glance</h1>
  <p class="lede">Your household balance, what came in, what went out, and where it went — for ${esc(monthLabel(month))}.</p>
  ${over.length ? `<div class="callout"><strong>Over budget:</strong> ${over.map((b) => `${esc(categoryLabel(b.category))} (${formatMoney(b.used)} of ${formatMoney(b.limit)})`).join(', ')}. See <a href="#/budgets">Budgets</a> to raise a limit or plan next month.</div>` : ''}
  ${!over.length && near.length ? `<div class="notice warn">Heads up: ${near.map((b) => esc(categoryLabel(b.category))).join(', ')} ${near.length > 1 ? 'are' : 'is'} close to the monthly limit.</div>` : ''}
  <section class="grid-3" aria-label="Month summary">
    <div class="card stat"><div class="label">Balance</div><div class="value ${balance < 0 ? 'negative' : ''}">${formatMoney(balance)}</div><div class="sub">Cash on hand through ${esc(monthLabel(month))}</div></div>
    <div class="card stat"><div class="label">Money in</div><div class="value positive">${formatMoney(totals.income)}</div><div class="sub">Pay, freelance and other income</div></div>
    <div class="card stat"><div class="label">Money out</div><div class="value ${totals.spent > totals.income ? 'negative' : ''}">${formatMoney(totals.spent)}</div><div class="sub">Net ${totals.net >= 0 ? 'saved' : 'overspent'} this month: ${formatMoney(Math.abs(totals.net))}</div></div>
  </section>
  <section class="grid-2">
    <div class="card">
      <h2>Where the money went</h2>
      <div class="chart-wrap">
        ${donutChart(rows, totals.spent)}
        <ul class="legend">${legendList(rows, totals.spent)}</ul>
      </div>
      <p><a href="#/transactions">See every transaction →</a></p>
    </div>
    <div class="card">
      <h2>Latest entries</h2>
      ${recent.length ? `<ul class="mini-list">${recent.map((t) => `<li><span>${esc(t.note || categoryLabel(t.category))}<span class="note">${formatDate(t.date)} · ${esc(categoryLabel(t.category))}</span></span><span class="${t.type === 'income' ? 'amount-in' : 'amount-out'}">${t.type === 'income' ? '+' : '−'}${formatMoney(t.amount)}</span></li>`).join('')}</ul>` : '<p class="empty">No entries this month yet.</p>'}
      <p><a class="btn btn-primary" href="#/add">+ Add an entry</a></p>
    </div>
  </section>
  <section class="card">
    <h2>Budgets this month</h2>
    ${budgets.slice(0, 4).map((b) => `
      <div class="budget-row">
        <div class="budget-head"><strong>${esc(categoryLabel(b.category))}</strong><span>${formatMoney(b.used)} of ${formatMoney(b.limit)}</span></div>
        <div class="progress"><span class="${b.pct > 1 ? 'over' : b.pct >= 0.85 ? 'near' : ''}" style="width:${Math.min(100, Math.round(b.pct * 100))}%"></span></div>
        <div class="budget-meta"><span>${Math.round(b.pct * 100)}% used</span><span>${b.left >= 0 ? formatMoney(b.left) + ' left' : formatMoney(-b.left) + ' over'}</span></div>
      </div>`).join('')}
    <p><a href="#/budgets">Manage all budgets →</a></p>
  </section>`;
}

export function renderTransactions(state, month, query) {
  const all = monthTransactions(state, month);
  const q = (query.search || '').trim().toLowerCase();
  const filtered = all.filter((t) => {
    if (query.type && t.type !== query.type) return false;
    if (query.category && t.category !== query.category) return false;
    if (q && !(t.note || '').toLowerCase().includes(q) && !categoryLabel(t.category).toLowerCase().includes(q)) return false;
    return true;
  });
  const totals = monthTotals(state, month);
  const options = CATEGORIES.filter((c) => c.id !== 'income')
    .map((c) => `<option value="${c.id}" ${query.category === c.id ? 'selected' : ''}>${esc(c.label)}</option>`).join('');

  return `
  <h1>Transactions — ${esc(monthLabel(month))}</h1>
  <p class="lede">${all.length} entries this month: ${formatMoney(totals.income)} in, ${formatMoney(totals.spent)} out.</p>
  <form class="toolbar" id="tx-filter" method="get" action="#/transactions">
    <div class="field"><label for="f-type">Type</label>
      <select id="f-type" name="type">
        <option value="">All types</option>
        <option value="income" ${query.type === 'income' ? 'selected' : ''}>Income</option>
        <option value="expense" ${query.type === 'expense' ? 'selected' : ''}>Expense</option>
      </select></div>
    <div class="field"><label for="f-cat">Category</label>
      <select id="f-cat" name="category"><option value="">All categories</option>${options}</select></div>
    <div class="field"><label for="f-search">Search</label>
      <input type="search" id="f-search" name="search" placeholder="Search notes or categories" value="${esc(query.search || '')}"></div>
    <button type="submit" class="btn btn-primary">Filter</button>
    <a class="btn btn-ghost" href="#/transactions">Clear</a>
  </form>
  <section class="card">
    ${filtered.length ? `<table>
      <thead><tr><th>Date</th><th>Category</th><th>Note</th><th class="num">Amount</th><th class="num">Actions</th></tr></thead>
      <tbody>${filtered.map(txRow).join('')}</tbody>
    </table>` : `<p class="empty">No transactions match this filter. <a href="#/transactions">Show them all</a> or <a href="#/add">add one</a>.</p>`}
  </section>
  <p><a class="btn btn-primary" href="#/add">+ Add an entry</a></p>`;
}

export function renderEntryForm(state, month, editing) {
  const isEdit = Boolean(editing);
  const tx = editing ?? { type: 'expense', category: 'groceries', date: `${month}-25`, amount: '', note: '' };
  const catOptions = CATEGORIES.filter((c) => c.id !== 'income')
    .map((c) => `<option value="${c.id}" ${tx.category === c.id ? 'selected' : ''}>${esc(c.label)}</option>`).join('');
  return `
  <h1>${isEdit ? 'Edit entry' : 'Add an entry'}</h1>
  <p class="lede">${isEdit ? 'Change any detail below — the totals, charts and budgets update as soon as you save.' : 'Record money in or out. It saves in this browser right away, and the dashboard, budgets and report update with it.'}</p>
  <section class="card">
    <form id="entry-form" data-edit-id="${isEdit ? esc(tx.id) : ''}">
      <div class="field">
        <span class="label" id="type-label">Type</span>
        <div class="radio-row" role="radiogroup" aria-labelledby="type-label">
          <label><input type="radio" name="type" value="expense" ${tx.type === 'expense' ? 'checked' : ''}> Expense</label>
          <label><input type="radio" name="type" value="income" ${tx.type === 'income' ? 'checked' : ''}> Income</label>
        </div>
      </div>
      <div class="form-row">
        <div class="field"><label for="amount">Amount (USD)</label>
          <input type="number" id="amount" name="amount" min="0.01" step="0.01" required inputmode="decimal" placeholder="0.00" value="${tx.amount === '' ? '' : tx.amount}"></div>
        <div class="field"><label for="date">Date</label>
          <input type="date" id="date" name="date" required value="${esc(tx.date)}"></div>
      </div>
      <div class="field"><label for="category">Category</label>
        <select id="category" name="category">${catOptions}</select>
        <p class="hint">Income entries are filed under Income automatically.</p></div>
      <div class="field"><label for="note">Note</label>
        <input type="text" id="note" name="note" maxlength="120" placeholder="e.g. Weekly shop — GreenMart" value="${esc(tx.note || '')}"></div>
      <div class="btn-row">
        <button type="submit" class="btn btn-primary">${isEdit ? 'Save changes' : 'Add entry'}</button>
        <a class="btn btn-ghost" href="#/transactions">Cancel</a>
        ${isEdit ? `<button type="button" class="btn btn-danger" data-delete="${esc(tx.id)}">Delete this entry</button>` : ''}
      </div>
    </form>
  </section>`;
}

export function renderBudgets(state, month) {
  const rows = budgetRows(state, month);
  const totalLimit = rows.reduce((s, r) => s + r.limit, 0);
  const totalUsed = rows.reduce((s, r) => s + r.used, 0);
  return `
  <h1>Monthly budgets — ${esc(monthLabel(month))}</h1>
  <p class="lede">Set a spending cap for each category. HomeLedger warns you at 85% and flags it red once you pass the cap. Limits are per month and saved in this browser.</p>
  <section class="grid-3">
    <div class="card stat"><div class="label">Total budgeted</div><div class="value">${formatMoney(totalLimit)}</div><div class="sub">Across ${rows.length} categories</div></div>
    <div class="card stat"><div class="label">Spent so far</div><div class="value ${totalUsed > totalLimit ? 'negative' : ''}">${formatMoney(totalUsed)}</div><div class="sub">${Math.round(totalLimit ? (totalUsed / totalLimit) * 100 : 0)}% of the plan</div></div>
    <div class="card stat"><div class="label">Remaining</div><div class="value ${totalLimit - totalUsed < 0 ? 'negative' : 'positive'}">${formatMoney(Math.abs(totalLimit - totalUsed))}</div><div class="sub">${totalLimit - totalUsed < 0 ? 'over the plan' : 'left to spend'}</div></div>
  </section>
  <section class="card">
    ${rows.map((b) => `
    <div class="budget-row">
      <div class="budget-head"><strong>${esc(categoryLabel(b.category))}${b.pct > 1 ? '<span class="flag over">OVER BUDGET</span>' : b.pct >= 0.85 ? '<span class="flag">ALMOST THERE</span>' : ''}</strong>
        <span>${formatMoney(b.used)} of ${formatMoney(b.limit)}</span></div>
      <div class="progress"><span class="${b.pct > 1 ? 'over' : b.pct >= 0.85 ? 'near' : ''}" style="width:${Math.min(100, Math.round(b.pct * 100))}%"></span></div>
      <div class="budget-meta"><span>${Math.round(b.pct * 100)}% used</span>
        <span>${b.left >= 0 ? formatMoney(b.left) + ' left' : formatMoney(-b.left) + ' over — consider moving money from another category'}</span></div>
      <form class="add-form" data-budget="${b.category}">
        <label class="muted" for="limit-${b.category}">Monthly limit</label>
        <input type="number" id="limit-${b.category}" name="limit" min="0" step="1" value="${b.limit}" aria-label="Monthly limit for ${esc(categoryLabel(b.category))}">
        <button type="submit" class="btn btn-ghost btn-small">Save limit</button>
      </form>
    </div>`).join('')}
  </section>
  <p class="muted">Tip: a realistic first budget is last month's spending, rounded up a little. If a category keeps going over, raise its limit and lower another — the total is what matters.</p>`;
}

export function renderGoals(state) {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  return `
  <h1>Savings goals</h1>
  <p class="lede">Money set aside for what's coming. Add to a goal whenever you have a spare dollar — progress is saved in this browser.</p>
  <section class="grid-3">
    <div class="card stat"><div class="label">Saved in total</div><div class="value positive">${formatMoney(totalSaved)}</div><div class="sub">Across ${state.goals.length} goals</div></div>
    <div class="card stat"><div class="label">Combined target</div><div class="value">${formatMoney(totalTarget)}</div><div class="sub">${Math.round(totalTarget ? (totalSaved / totalTarget) * 100 : 0)}% of the way there</div></div>
    <div class="card stat"><div class="label">Still to save</div><div class="value">${formatMoney(totalTarget - totalSaved)}</div><div class="sub">At $200 a month: about ${Math.max(1, Math.ceil((totalTarget - totalSaved) / 200))} months</div></div>
  </section>
  <section class="grid-2-even">
    ${state.goals.map((g) => {
      const pct = g.target > 0 ? Math.min(100, Math.round((g.saved / g.target) * 100)) : 0;
      return `<div class="card goal-card">
        <div class="goal-head"><h2>${esc(g.name)}</h2><span class="flag" style="background:var(--green-soft);color:var(--green-dark)">${pct}%</span></div>
        <div class="goal-amount">${formatMoney(g.saved)} <small>of ${formatMoney(g.target)}</small></div>
        <div class="progress"><span style="width:${pct}%"></span></div>
        <p class="muted">${esc(g.note)}</p>
        <p class="muted">${formatMoney(Math.max(0, g.target - g.saved))} to go.</p>
        <form class="add-form" data-goal="${g.id}">
          <label class="muted" for="add-${g.id}">Add $</label>
          <input type="number" id="add-${g.id}" name="amount" min="1" step="1" placeholder="25" aria-label="Amount to add to ${esc(g.name)}">
          <button type="submit" class="btn btn-primary btn-small">Add to goal</button>
        </form>
      </div>`;
    }).join('')}
  </section>`;
}

export function renderReport(state, month) {
  const totals = monthTotals(state, month);
  const byCat = spendingByCategory(state, month);
  const rows = byCat.map((r, i) => ({ ...r, label: categoryLabel(r.category), color: CHART_COLORS[i % CHART_COLORS.length] }));
  const days = dailySpending(state, month);
  const biggestDay = days.length ? [...days].sort((a, b) => b[1] - a[1])[0] : null;
  const avgDay = days.length ? totals.spent / days.length : 0;
  const txs = monthTransactions(state, month);
  const biggest = txs.filter((t) => t.type === 'expense').sort((a, b) => b.amount - a.amount)[0];
  const incomeCount = txs.filter((t) => t.type === 'income').length;
  const savingsRate = totals.income > 0 ? Math.round((totals.net / totals.income) * 100) : 0;

  return `
  <h1>Monthly report — ${esc(monthLabel(month))}</h1>
  <p class="lede">A plain-language summary of ${esc(monthLabel(month))}: what came in, what went out, and what to change next month.</p>
  <section class="grid-3">
    <div class="card stat"><div class="label">Money in</div><div class="value positive">${formatMoney(totals.income)}</div><div class="sub">${incomeCount} paydays and income entries</div></div>
    <div class="card stat"><div class="label">Money out</div><div class="value">${formatMoney(totals.spent)}</div><div class="sub">${txs.filter((t) => t.type === 'expense').length} spending entries</div></div>
    <div class="card stat"><div class="label">Savings rate</div><div class="value ${savingsRate < 0 ? 'negative' : savingsRate >= 20 ? 'positive' : 'warn'}">${savingsRate}%</div><div class="sub">${totals.net >= 0 ? `Kept ${formatMoney(totals.net)} of income` : `Spent ${formatMoney(-totals.net)} more than came in`}</div></div>
  </section>
  <section class="grid-2">
    <div class="card">
      <h2>Spending by category</h2>
      <div class="chart-wrap">
        ${donutChart(rows, totals.spent)}
        <ul class="legend">${legendList(rows, totals.spent)}</ul>
      </div>
    </div>
    <div class="card">
      <h2>Biggest single expense</h2>
      ${biggest ? `<p style="font-size:22px;font-weight:800;margin:4px 0">${formatMoney(biggest.amount)}</p>
      <p>${esc(biggest.note || categoryLabel(biggest.category))} — ${esc(categoryLabel(biggest.category))}, ${formatDate(biggest.date)}.</p>
      <p class="muted">Housing is usually the largest line. After that, ${rows[1] ? esc(rows[1].label) + ' at ' + formatMoney(rows[1].amount) : 'no other category'} is the next biggest — the best place to look for savings.</p>` : '<p class="empty">No expenses this month.</p>'}
      <h2 style="margin-top:18px">Daily rhythm</h2>
      <p>Average spending day: <strong>${formatMoney(avgDay)}</strong>${biggestDay ? ` · busiest day: the ${biggestDay[0]}th at ${formatMoney(biggestDay[1])}` : ''}.</p>
    </div>
  </section>
  <section class="card">
    <h2>Spending day by day</h2>
    ${dailyBars(days)}
  </section>
  <section class="card">
    <h2>What to do next month</h2>
    <ul>
      <li>${totals.net >= 0 ? `You kept ${formatMoney(totals.net)}. Move it to your emergency fund on payday, before it gets spent.` : `Spending beat income by ${formatMoney(-totals.net)}. Pick one category to trim — ${rows[1] ? esc(rows[1].label) : 'dining out'} is the usual first cut.`}</li>
      <li>${rows[0] ? `${esc(rows[0].label)} took ${Math.round(totals.spent ? (rows[0].amount / totals.spent) * 100 : 0)}% of all spending (${formatMoney(rows[0].amount)}). Check its budget on the <a href="#/budgets">Budgets</a> page.` : 'Add your spending to see where it goes.'}</li>
      <li>Review each entry on the <a href="#/transactions">Transactions</a> page — a wrong category or a forgotten subscription shows up there first.</li>
    </ul>
  </section>`;
}
