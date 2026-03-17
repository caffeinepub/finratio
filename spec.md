# FinRatio - Financial Ratios Learning & Calculator App

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Homepage with headline, intro, and category cards (Profitability, Liquidity, Solvency, Efficiency, Valuation)
- Financial Ratio Library: 14 ratios across 5 categories
- Per-ratio detail pages with definition, formula, components, interpretation, real-world example, industry benchmark
- Interactive calculators for each ratio with auto-calculation and result interpretation
- Learning Mode toggle ("Explain Like I'm 5") that switches content to simpler language
- Tooltips for financial terms
- Bar/gauge charts for ratio results
- Company Dashboard: input financials, auto-calculate all ratios, show strong/weak insights
- Comparison Tool: input two companies and compare their ratios side-by-side
- Search bar for filtering ratios
- Bookmark/save ratios (persisted in backend per user session)
- Dark mode toggle
- Role: anonymous access, bookmarks stored by principal

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: store bookmarked ratios per user (principal -> list of ratio IDs). Expose get/add/remove bookmark calls.
2. Frontend: React SPA with React Router for navigation between Home, Library, Ratio Detail, Dashboard, Comparison pages.
3. Ratio data defined as a static TypeScript data file (all 14 ratios with definitions, formulas, ELI5 explanations, benchmarks).
4. Calculator components with controlled inputs and live computed output.
5. Recharts for gauge/bar visualization of ratio results.
6. Dark mode via Tailwind dark class toggled by context.
7. Bookmarks wired to backend canister calls.
8. Comparison tool as a dedicated page with two sets of financial inputs.
