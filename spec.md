# Daily Life & Fitness Tracker

## Current State
Existing workspace contains the FinRatio financial ratios app. This is a new application replacing it.

## Requested Changes (Diff)

### Add
- Daily routine tracking: wake-up, sleep, gym start/end, office start/end, lunch, return home
- Fitness tracking: steps (manual), gym attendance toggle, workout duration, auto gym days/week count
- Food & calorie tracking: food item input with built-in calorie database, macro breakdown (protein, carbs, fats), daily totals
- Productivity tracking: auto-calculated working hours from office times, focus score (1-10)
- Weekly analysis dashboard: averages for all metrics, green/yellow/red scoring, insights
- Charts: bar chart for weekly habits, pie chart for calorie/macro breakdown
- Streak tracker for gym attendance
- Goal setting: daily step goal, calorie goal
- Notes/journal section per day
- Daily summary cards on dashboard
- All data persisted via backend (Motoko stable storage)

### Modify
- Project renamed from FinRatio to Daily Life & Fitness Tracker

### Remove
- All FinRatio financial ratio content

## Implementation Plan
1. Backend: stable storage for daily entries (routine, fitness, food log, productivity, notes); CRUD operations per date; weekly data query; goal storage
2. Built-in food database in frontend (100+ common foods with calories/macros)
3. Frontend pages: Dashboard (today summary + weekly charts), Daily Log (input form), Weekly Analysis, Goals, Journal
4. Charts using recharts for weekly bar chart and macro pie chart
5. Streak calculation logic based on consecutive gym days
6. Color-coded scoring: green (on track), yellow (moderate), red (needs improvement)
