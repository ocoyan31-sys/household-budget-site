# household-budget-site

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/ocoyan31-sys/household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/ocoyan31-sys/household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

HomeLedger is a working household budget site that runs entirely offline from
static files: a dashboard with balances, monthly income and spending and a
category chart; add, edit and delete income and expense entries (saved in the
browser with localStorage); a transactions list with type, category and text
filters; monthly budgets per category with progress bars and over-budget
warnings; savings goals with progress and contributions; and a monthly report
with daily spending bars and plain-language next steps. It ships seeded with
a realistic example household (October and November 2026) so every page opens
with real figures, and a visitor can reset it to the example data at any time.

No build step, no dependencies, no network requests: `app/` is plain HTML,
CSS and ES modules, served by any static server. Charts are hand-drawn inline
SVG. The layout is responsive down to a phone.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a browser. The entry program is `main.ts`
(Node 22, standard library only): it copies `app/` and `screenshots/` to
`/output` and writes `/output/dossier.json` with the vendored make.fun
library (`vendor/makefun-frontend.ts`).

---

<sub>Entered on [make.fun](https://make.fun/?ref=5h2hvham&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
