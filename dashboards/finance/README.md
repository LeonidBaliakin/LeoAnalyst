# LeoAnalyst / Finance OS — finance demo

## What this is
A standalone, static, interactive finance analytics demo designed for GitHub Pages.
Contains only synthetic data. Nothing is transmitted to a server.

## Folder structure
- `index.html` — HTML entry point
- `style.css` — visual styles / responsive layout
- `data.js` — deterministic demo ledger (all values are in RUB)
- `app.js` — interface, filters, charts, calculations, modals, CSV export

## Publishing
Upload the whole `finance/` folder to `dashboards/finance/` in `LeoAnalyst`.
Open `https://leonidbaliakin.github.io/LeoAnalyst/dashboards/finance/`.
The main page can open this URL in a full-screen iframe modal. The main LeoAnalyst page is NOT modified here.

## Functional features
- 8 sections: Overview, Cash flow, P&L, Expenses, Budgets, Transactions, Forecast, Insights
- global period / end-date / business-unit filters
- RU and EN, RUB/USD fixed demo conversion at 92 RUB per USD
- independent light/dark theme (changes only on button click)
- interactive charts with hover details, expense donut drilldown, clickable transactions
- editable monthly budgets and creation/removal of custom transactions (stored locally)
- transaction search/filter/sort and UTF-8 CSV export
- scenario planning with growth and expense sliders, optimistic/base/conservative, 3/6/12 months
- responsive desktop/tablet/mobile UI

## Data assumptions
- Source data: deterministic synthetic ledger through 2026-10-22.
- Revenue = sum(income); expenses = sum(expense); net profit = revenue - expenses.
- Monthly budgets are plans; actuals only through selected date within that month.
- Cash balance = demo opening cash + cumulative transactions.
- Forecast uses prior 90-day averages and illustrative scenario assumptions.
- Does not model accrual accounting, VAT, depreciation, receivables or live exchange rates.

## Local test
Open `index.html` in Chrome or run a tiny local HTTP server from this folder:
`python -m http.server 8000`
Then visit `http://localhost:8000/`.
