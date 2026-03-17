import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Brain, Dumbbell, Flame, Footprints } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useFitness } from "../contexts/FitnessContext";
import {
  calcHoursDiff,
  formatDate,
  getLast7Days,
  getTotalCalories,
} from "../utils/fitnessStorage";

export default function JournalPage() {
  const { getEntry, upsertEntry, selectedDate, setSelectedDate, entries } =
    useFitness();
  const entry = getEntry(selectedDate);
  const [notes, setNotes] = useState(entry.productivity.notes);
  const today = formatDate(new Date());
  const last7 = getLast7Days();

  const handleSave = () => {
    const updated = {
      ...entry,
      productivity: { ...entry.productivity, notes },
    };
    upsertEntry(updated);
    toast.success("Journal saved!");
  };

  const totalCal = getTotalCalories(entry.food);
  const workHrs = calcHoursDiff(
    entry.routine.officeStart,
    entry.routine.officeEnd,
  );

  const selectedDateLabel = new Date(
    `${selectedDate}T12:00:00`,
  ).toLocaleDateString("en", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Journal
        </h1>
        <p className="text-muted-foreground text-sm">
          Daily reflections and notes
        </p>
      </div>

      {/* Date strip */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {last7.map((date) => {
          const dayEntry = entries.find((e) => e.date === date);
          const hasNote =
            dayEntry?.productivity.notes &&
            dayEntry.productivity.notes.trim().length > 0;
          const isSelected = date === selectedDate;
          const dayLabel = new Date(`${date}T12:00:00`).toLocaleDateString(
            "en",
            {
              weekday: "short",
            },
          );
          const dateNum = new Date(`${date}T12:00:00`).getDate();
          return (
            <button
              type="button"
              key={date}
              data-ocid="journal.date.button"
              onClick={() => {
                setSelectedDate(date);
                const e = entries.find((x) => x.date === date);
                setNotes(e?.productivity.notes ?? "");
              }}
              className={`flex flex-col items-center min-w-[52px] py-3 px-2 rounded-xl border transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:bg-secondary"
              }`}
            >
              <span className="text-[10px] font-medium uppercase tracking-wide">
                {dayLabel}
              </span>
              <span className="text-lg font-bold font-display leading-tight">
                {dateNum}
              </span>
              {hasNote && (
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1 ${
                    isSelected ? "bg-primary-foreground/70" : "bg-primary"
                  }`}
                />
              )}
            </button>
          );
        })}
        <div className="flex items-center pl-2">
          <input
            type="date"
            data-ocid="journal.date.select"
            value={selectedDate}
            max={today}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              const found = entries.find((x) => x.date === e.target.value);
              setNotes(found?.productivity.notes ?? "");
            }}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journal entry */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base font-display">
                    {selectedDateLabel}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  data-ocid="journal.notes.textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={`How was your day on ${selectedDateLabel}? Any reflections, wins, or things to improve?`}
                  rows={8}
                  className="resize-none"
                />
                <Button
                  onClick={handleSave}
                  className="w-full"
                  data-ocid="journal.save.submit_button"
                >
                  Save Journal Entry
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Day summary */}
        <div className="space-y-3">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display text-muted-foreground">
                Day Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Footprints className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Steps</p>
                  <p className="text-sm font-semibold text-foreground">
                    {entry.fitness.steps
                      ? entry.fitness.steps.toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Calories</p>
                  <p className="text-sm font-semibold text-foreground">
                    {totalCal > 0 ? `${totalCal} kcal` : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gym</p>
                  <p
                    className={`text-sm font-semibold ${
                      entry.fitness.gymAttended
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {entry.fitness.gymAttended ? "Attended ✓" : "Rest day"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Focus Score</p>
                  <p className="text-sm font-semibold text-foreground">
                    {entry.productivity.focusScore > 0
                      ? `${entry.productivity.focusScore}/10`
                      : "—"}
                  </p>
                </div>
              </div>
              {workHrs > 0 && (
                <div className="pt-2 border-t border-border">
                  <Badge variant="secondary" className="text-xs">
                    ⏱ {workHrs}h working time
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {entry.routine.wakeUp && (
            <Card className="shadow-card">
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground mb-3">
                  ROUTINE
                </p>
                <div className="space-y-2 text-xs">
                  {entry.routine.wakeUp && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wake up</span>
                      <span className="font-medium">
                        {entry.routine.wakeUp}
                      </span>
                    </div>
                  )}
                  {entry.routine.gymStart && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gym</span>
                      <span className="font-medium">
                        {entry.routine.gymStart} – {entry.routine.gymEnd}
                      </span>
                    </div>
                  )}
                  {entry.routine.officeStart && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Office</span>
                      <span className="font-medium">
                        {entry.routine.officeStart} –{" "}
                        {entry.routine.officeEnd || "??"}
                      </span>
                    </div>
                  )}
                  {entry.routine.sleep && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sleep</span>
                      <span className="font-medium">{entry.routine.sleep}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
