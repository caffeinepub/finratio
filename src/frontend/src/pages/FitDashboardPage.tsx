import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Clock, Dumbbell, Flame, Footprints, Zap } from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useFitness } from "../contexts/FitnessContext";
import type { DayEntry } from "../types/fitness";
import {
  calcHoursDiff,
  getLast7Days,
  getTotalCalories,
  getTotalMacros,
} from "../utils/fitnessStorage";

const PIE_COLORS = ["#6366f1", "#f59e0b", "#14b8a6"];

function SummaryCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  index,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Card className="shadow-card hover:shadow-card-hover transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className="text-2xl font-display font-bold text-foreground">
                {value}
              </p>
              {sub && (
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
              )}
            </div>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
            >
              <Icon className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function FitDashboardPage() {
  const { getEntry, goals, gymStreak, selectedDate, setSelectedDate, entries } =
    useFitness();
  const entry = getEntry(selectedDate);
  const totalCal = getTotalCalories(entry.food);
  const macros = getTotalMacros(entry.food);
  const workingHours = calcHoursDiff(
    entry.routine.officeStart,
    entry.routine.officeEnd,
  );
  const calPct = Math.min(
    100,
    Math.round((totalCal / goals.dailyCalories) * 100),
  );
  const stepPct = Math.min(
    100,
    Math.round((entry.fitness.steps / goals.dailySteps) * 100),
  );

  const last7 = getLast7Days();

  const chartData = last7.map((date) => {
    const e = (entries.find((x) => x.date === date) ?? {
      fitness: { steps: 0 },
      food: [],
    }) as Pick<DayEntry, "fitness" | "food">;
    const dayLabel = new Date(`${date}T12:00:00`).toLocaleDateString("en", {
      weekday: "short",
    });
    return {
      day: dayLabel,
      steps: e.fitness.steps,
      calories: getTotalCalories(e.food),
    };
  });

  const macroData = [
    { name: "Protein", value: macros.protein },
    { name: "Carbs", value: macros.carbs },
    { name: "Fats", value: macros.fats },
  ].filter((d) => d.value > 0);

  const today = new Date().toISOString().split("T")[0];
  const isToday = selectedDate === today;
  const dateLabel = isToday
    ? "Today's overview"
    : `Overview for ${new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">{dateLabel}</p>
        </div>
        <div className="flex items-center gap-3">
          {gymStreak > 0 && (
            <Badge
              variant="secondary"
              className="gap-1.5 px-3 py-1.5 text-sm bg-amber-50 text-amber-700 border-amber-200"
            >
              <Zap className="w-3.5 h-3.5" />
              {gymStreak}-day gym streak 🔥
            </Badge>
          )}
          <input
            type="date"
            data-ocid="dashboard.select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-2 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          index={0}
          icon={Flame}
          label="Calories"
          value={totalCal}
          sub={`Goal: ${goals.dailyCalories} kcal`}
          color="bg-orange-50 text-orange-500"
        />
        <SummaryCard
          index={1}
          icon={Footprints}
          label="Steps"
          value={entry.fitness.steps.toLocaleString()}
          sub={`Goal: ${goals.dailySteps.toLocaleString()}`}
          color="bg-indigo-50 text-indigo-500"
        />
        <SummaryCard
          index={2}
          icon={Clock}
          label="Working Hours"
          value={workingHours ? `${workingHours}h` : "—"}
          sub={
            entry.routine.officeStart
              ? `${entry.routine.officeStart} – ${entry.routine.officeEnd || "??"}`
              : undefined
          }
          color="bg-teal-50 text-teal-500"
        />
        <SummaryCard
          index={3}
          icon={Dumbbell}
          label="Gym Today"
          value={entry.fitness.gymAttended ? "Yes ✓" : "No"}
          sub={
            entry.fitness.workoutDuration
              ? `${entry.fitness.workoutDuration} min`
              : undefined
          }
          color={
            entry.fitness.gymAttended
              ? "bg-green-50 text-green-500"
              : "bg-muted text-muted-foreground"
          }
        />
        <SummaryCard
          index={4}
          icon={Brain}
          label="Focus Score"
          value={
            entry.productivity.focusScore
              ? `${entry.productivity.focusScore}/10`
              : "—"
          }
          color="bg-purple-50 text-purple-500"
        />
        <SummaryCard
          index={5}
          icon={Zap}
          label="Gym Streak"
          value={`${gymStreak} days`}
          sub="Consecutive"
          color="bg-amber-50 text-amber-500"
        />
      </div>

      {/* Progress bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">
                Calorie Goal
              </span>
              <span className="text-sm text-muted-foreground">
                {totalCal} / {goals.dailyCalories} kcal
              </span>
            </div>
            <Progress
              value={calPct}
              data-ocid="dashboard.calories.loading_state"
              className="h-3"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {calPct}% of daily goal
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">
                Step Goal
              </span>
              <span className="text-sm text-muted-foreground">
                {entry.fitness.steps.toLocaleString()} /{" "}
                {goals.dailySteps.toLocaleString()}
              </span>
            </div>
            <Progress
              value={stepPct}
              data-ocid="dashboard.steps.loading_state"
              className="h-3"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {stepPct}% of daily goal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly bar chart */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">
              7-Day Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  formatter={(value: number, name: string) =>
                    name === "steps"
                      ? [value.toLocaleString(), "Steps"]
                      : [value, "Calories"]
                  }
                />
                <Legend iconType="circle" iconSize={8} />
                <Bar
                  yAxisId="left"
                  dataKey="steps"
                  fill="#6366f1"
                  name="Steps"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="calories"
                  fill="#14b8a6"
                  name="Calories"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Macro pie chart */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">
              Macro Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {macroData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="45%"
                    outerRadius={75}
                    innerRadius={40}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}g`}
                    labelLine={false}
                  >
                    {macroData.map((item, i) => (
                      <Cell
                        key={item.name}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}g`]} />
                  <Legend iconType="circle" iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  No food logged for this day
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
