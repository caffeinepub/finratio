import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import { useFitness } from "../contexts/FitnessContext";
import {
  calcHoursDiff,
  getLast7Days,
  getTotalCalories,
} from "../utils/fitnessStorage";

type Score = "green" | "yellow" | "red";

function scoreSteps(steps: number, goal: number): Score {
  if (steps >= goal) return "green";
  if (steps >= goal * 0.6) return "yellow";
  return "red";
}

function scoreCalories(cals: number, goal: number): Score {
  const diff = Math.abs(cals - goal);
  if (diff <= 200) return "green";
  if (diff <= 400) return "yellow";
  return "red";
}

function scoreWorkingHours(h: number): Score {
  if (h >= 7) return "green";
  if (h >= 5) return "yellow";
  return "red";
}

function scoreGym(days: number): Score {
  if (days >= 4) return "green";
  if (days >= 2) return "yellow";
  return "red";
}

const scoreBadge: Record<Score, string> = {
  green: "bg-green-100 text-green-700 border-green-200",
  yellow: "bg-amber-100 text-amber-700 border-amber-200",
  red: "bg-red-100 text-red-600 border-red-200",
};

const scoreDot: Record<Score, string> = {
  green: "bg-green-500",
  yellow: "bg-amber-500",
  red: "bg-red-500",
};

function ScoreBadge({ score, label }: { score: Score; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${scoreBadge[score]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${scoreDot[score]}`} />
      {label}
    </span>
  );
}

export default function WeeklyAnalysisPage() {
  const { entries, goals } = useFitness();
  const last7 = getLast7Days();

  const days = last7.map((date) => {
    const entry = entries.find((e) => e.date === date);
    const dayLabel = new Date(`${date}T12:00:00`).toLocaleDateString("en", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    if (!entry) {
      return {
        date,
        dayLabel,
        wakeUp: "—",
        steps: 0,
        gymAttended: false,
        workingHours: 0,
        calories: 0,
        focusScore: 0,
        hasData: false,
      };
    }
    return {
      date,
      dayLabel,
      wakeUp: entry.routine.wakeUp || "—",
      steps: entry.fitness.steps,
      gymAttended: entry.fitness.gymAttended,
      workingHours: calcHoursDiff(
        entry.routine.officeStart,
        entry.routine.officeEnd,
      ),
      calories: getTotalCalories(entry.food),
      focusScore: entry.productivity.focusScore,
      hasData: true,
    };
  });

  const withData = days.filter((d) => d.hasData);
  const gymDays = withData.filter((d) => d.gymAttended).length;
  const avgSteps = withData.length
    ? Math.round(withData.reduce((s, d) => s + d.steps, 0) / withData.length)
    : 0;
  const avgCal = withData.length
    ? Math.round(withData.reduce((s, d) => s + d.calories, 0) / withData.length)
    : 0;
  const avgWork = withData.length
    ? Math.round(
        (withData.reduce((s, d) => s + d.workingHours, 0) / withData.length) *
          10,
      ) / 10
    : 0;
  const avgFocus = withData.length
    ? Math.round(
        (withData.reduce((s, d) => s + d.focusScore, 0) / withData.length) * 10,
      ) / 10
    : 0;

  const overallScores: Score[] = [
    scoreSteps(avgSteps, goals.dailySteps),
    scoreGym(gymDays),
    scoreCalories(avgCal, goals.dailyCalories),
    scoreWorkingHours(avgWork),
  ];
  const greenCount = overallScores.filter((s) => s === "green").length;

  let insightMessage: string;
  let insightColor: string;
  let insightEmoji: string;
  if (greenCount >= 3) {
    insightMessage = "You're doing great! Keep up the excellent work.";
    insightColor = "bg-green-50 border-green-200 text-green-800";
    insightEmoji = "🌟";
  } else if (greenCount === 2) {
    insightMessage =
      "Good progress, keep it up! A little more consistency and you'll be there.";
    insightColor = "bg-amber-50 border-amber-200 text-amber-800";
    insightEmoji = "💪";
  } else {
    insightMessage =
      "Needs improvement. Let's focus on building better daily habits.";
    insightColor = "bg-red-50 border-red-200 text-red-800";
    insightEmoji = "⚡";
  }

  const summaryItems = [
    {
      label: "Avg Steps",
      value: avgSteps.toLocaleString(),
      score: scoreSteps(avgSteps, goals.dailySteps),
      goal: `Goal: ${goals.dailySteps.toLocaleString()}`,
    },
    {
      label: "Gym Days",
      value: `${gymDays}/7`,
      score: scoreGym(gymDays),
      goal: "Goal: 4+/week",
    },
    {
      label: "Avg Calories",
      value: `${avgCal} kcal`,
      score: scoreCalories(avgCal, goals.dailyCalories),
      goal: `Goal: ${goals.dailyCalories}`,
    },
    {
      label: "Avg Work Hrs",
      value: `${avgWork}h`,
      score: scoreWorkingHours(avgWork),
      goal: "Goal: 7h+",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Weekly Analysis
        </h1>
        <p className="text-muted-foreground text-sm">
          Last 7 days performance overview
        </p>
      </div>

      {/* Insight banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-4 rounded-xl border ${insightColor} flex items-center gap-3`}
        data-ocid="weekly.insight.card"
      >
        <span className="text-2xl">{insightEmoji}</span>
        <p className="font-medium">{insightMessage}</p>
      </motion.div>

      {/* Averages cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="shadow-card">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">
                  {item.label}
                </p>
                <p className="text-xl font-display font-bold text-foreground">
                  {item.value}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {item.goal}
                </p>
                <ScoreBadge
                  score={item.score}
                  label={
                    item.score === "green"
                      ? "On track"
                      : item.score === "yellow"
                        ? "Moderate"
                        : "Low"
                  }
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Avg focus */}
      <Card className="shadow-card">
        <CardContent className="p-4 flex items-center gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Avg Focus Score</p>
            <p className="text-3xl font-display font-bold text-foreground">
              {avgFocus}
              <span className="text-base text-muted-foreground">/10</span>
            </p>
          </div>
          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-400 rounded-full transition-all"
              style={{ width: `${(avgFocus / 10) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Day-by-day table */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">
            Day-by-Day Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="weekly.table">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Day
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Wake Up
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Steps
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Gym
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Work Hrs
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Calories
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Focus
                  </th>
                </tr>
              </thead>
              <tbody>
                {days.map((day, i) => (
                  <tr
                    key={day.date}
                    data-ocid={`weekly.row.${i + 1}`}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {day.dayLabel}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {day.wakeUp}
                    </td>
                    <td className="px-4 py-3">
                      {day.hasData ? (
                        <ScoreBadge
                          score={scoreSteps(day.steps, goals.dailySteps)}
                          label={day.steps.toLocaleString()}
                        />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {day.hasData ? (
                        <span
                          className={`text-xs font-medium ${
                            day.gymAttended ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {day.gymAttended ? "✓ Yes" : "✗ No"}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {day.hasData ? (
                        <ScoreBadge
                          score={scoreWorkingHours(day.workingHours)}
                          label={`${day.workingHours}h`}
                        />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {day.hasData ? (
                        <ScoreBadge
                          score={scoreCalories(
                            day.calories,
                            goals.dailyCalories,
                          )}
                          label={String(day.calories)}
                        />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {day.focusScore > 0 ? (
                        <span className="font-medium text-foreground">
                          {day.focusScore}/10
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          On track / Great
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Moderate / Improving
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Needs improvement
        </div>
      </div>
    </div>
  );
}
