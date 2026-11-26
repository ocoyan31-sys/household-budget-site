// HomeLedger charts: small inline-SVG charts drawn from numbers, no library.
// A donut for spending by category and a horizontal bar list used on the
// dashboard and the monthly report.

export const CHART_COLORS = [
  '#2e7d4f', '#b7791f', '#2f5f8f', '#7a3a72', '#b3372e',
  '#5b7a6a', '#8a6d3b', '#4a4a63', '#23657c', '#6b7a70',
];

function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function donutSlice(cx, cy, rOuter, rInner, startAngle, endAngle) {
  const large = endAngle - startAngle > 180 ? 1 : 0;
  const [x1, y1] = polar(cx, cy, rOuter, startAngle);
  const [x2, y2] = polar(cx, cy, rOuter, endAngle);
  const [x3, y3] = polar(cx, cy, rInner, endAngle);
  const [x4, y4] = polar(cx, cy, rInner, startAngle);
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${rOuter} ${rOuter} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} A ${rInner} ${rInner} 0 ${large} 0 ${x4.toFixed(2)} ${y4.toFixed(2)} Z`;
}

export function donutChart(rows, total, size = 220) {
  if (!rows.length || total <= 0) {
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="No spending this month">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 14}" fill="none" stroke="#e2ddd0" stroke-width="34"/>
      <text x="50%" y="50%" text-anchor="middle" font-size="15" fill="#6b7a70">No spending yet</text>
    </svg>`;
  }
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size / 2 - 6;
  const rInner = rOuter - 34;
  let angle = 0;
  const paths = rows.map((row, i) => {
    const share = row.amount / total;
    const start = angle;
    angle += share * 360;
    const end = angle - (rows.length > 1 ? 1.5 : 0);
    const color = CHART_COLORS[i % CHART_COLORS.length];
    return `<path d="${donutSlice(cx, cy, rOuter, rInner, start, Math.max(end, start + 0.5))}" fill="${color}">
      <title>${row.label}: ${row.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} (${Math.round(share * 100)}%)</title>
    </path>`;
  }).join('');
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending by category chart">
    ${paths}
    <text x="50%" y="48%" text-anchor="middle" font-size="13" fill="#6b7a70">Total spent</text>
    <text x="50%" y="58%" text-anchor="middle" font-size="19" font-weight="800" fill="#1e2b22">${total.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</text>
  </svg>`;
}

export function legendList(rows, total) {
  return rows.map((row, i) => {
    const color = CHART_COLORS[i % CHART_COLORS.length];
    const pct = total > 0 ? Math.round((row.amount / total) * 100) : 0;
    return `<li><span><span class="swatch" style="background:${color}"></span>${row.label}</span>
      <span><strong>${row.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</strong> · ${pct}%</span></li>`;
  }).join('');
}

// Daily spending bars for one month: one column per day that had spending.
export function dailyBars(days, maxDays = 31) {
  if (!days.length) return '<p class="empty">No spending recorded this month yet.</p>';
  const max = Math.max(...days.map(([, amount]) => amount));
  const cols = days.map(([day, amount]) => {
    const height = Math.max(4, Math.round((amount / max) * 120));
    return `<div class="bar-col">
      <span class="bar-value">${amount >= 100 ? '$' + Math.round(amount) : '$' + amount.toFixed(0)}</span>
      <div class="bar" style="height:${height}px" title="Day ${day}: $${amount.toFixed(2)}"></div>
      <span class="bar-label">${day}</span>
    </div>`;
  }).join('');
  return `<div class="bar-chart" role="img" aria-label="Daily spending bars">${cols}</div>
    <p class="muted">Each bar is one day of the month, tallest = biggest spending day.</p>`;
}
