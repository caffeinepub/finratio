import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useFitness } from "../contexts/FitnessContext";
import { FOOD_DATABASE } from "../data/foodDatabase";
import type { DayEntry, FoodEntry } from "../types/fitness";
import {
  calcHoursDiff,
  calcMinutesDiff,
  formatDate,
  getTotalCalories,
  getTotalMacros,
} from "../utils/fitnessStorage";

function TimeInput({
  label,
  value,
  onChange,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm"
        data-ocid={`daily.${id}.input`}
      />
    </div>
  );
}

export default function DailyLogPage() {
  const { getEntry, upsertEntry, selectedDate, setSelectedDate } = useFitness();
  const stableGetEntry = useCallback(getEntry, []);
  const [entry, setEntry] = useState<DayEntry>(() =>
    stableGetEntry(selectedDate),
  );
  const [foodSearch, setFoodSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEntry(getEntry(selectedDate));
    // biome-ignore lint/correctness/useExhaustiveDependencies: getEntry is stable
  }, [selectedDate, getEntry]);

  // Auto-calc workout duration when gym times change
  useEffect(() => {
    const dur = calcMinutesDiff(entry.routine.gymStart, entry.routine.gymEnd);
    setEntry((prev) => {
      if (dur === prev.fitness.workoutDuration) return prev;
      return { ...prev, fitness: { ...prev.fitness, workoutDuration: dur } };
    });
  }, [entry.routine.gymStart, entry.routine.gymEnd]); // intentionally omitting workoutDuration to avoid loop

  const filteredFoods =
    foodSearch.length >= 1
      ? FOOD_DATABASE.filter((f) =>
          f.name.toLowerCase().includes(foodSearch.toLowerCase()),
        ).slice(0, 8)
      : [];

  const addFood = (item: (typeof FOOD_DATABASE)[0]) => {
    const food: FoodEntry = { id: Date.now().toString(), ...item };
    setEntry((prev) => ({ ...prev, food: [...prev.food, food] }));
    setFoodSearch("");
    setShowDropdown(false);
  };

  const removeFood = (id: string) => {
    setEntry((prev) => ({
      ...prev,
      food: prev.food.filter((f) => f.id !== id),
    }));
  };

  const handleSave = () => {
    upsertEntry(entry);
    toast.success("Daily log saved!");
  };

  const workingHours = calcHoursDiff(
    entry.routine.officeStart,
    entry.routine.officeEnd,
  );
  const totalCal = getTotalCalories(entry.food);
  const macros = getTotalMacros(entry.food);
  const today = formatDate(new Date());

  const updateRoutine = (key: keyof DayEntry["routine"], val: string) => {
    setEntry((prev) => ({ ...prev, routine: { ...prev.routine, [key]: val } }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Daily Log
          </h1>
          <p className="text-muted-foreground text-sm">
            Track your day in detail
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            data-ocid="daily.date.select"
            value={selectedDate}
            max={today}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-2 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <Button onClick={handleSave} data-ocid="daily.save.submit_button">
            Save Log
          </Button>
        </div>
      </div>

      {/* Daily Routine */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">
            🕐 Daily Routine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <TimeInput
              id="wakeUp"
              label="Wake Up"
              value={entry.routine.wakeUp}
              onChange={(v) => updateRoutine("wakeUp", v)}
            />
            <TimeInput
              id="sleep"
              label="Bedtime"
              value={entry.routine.sleep}
              onChange={(v) => updateRoutine("sleep", v)}
            />
            <TimeInput
              id="gymStart"
              label="Gym Start"
              value={entry.routine.gymStart}
              onChange={(v) => updateRoutine("gymStart", v)}
            />
            <TimeInput
              id="gymEnd"
              label="Gym End"
              value={entry.routine.gymEnd}
              onChange={(v) => updateRoutine("gymEnd", v)}
            />
            <TimeInput
              id="officeStart"
              label="Office Start"
              value={entry.routine.officeStart}
              onChange={(v) => updateRoutine("officeStart", v)}
            />
            <TimeInput
              id="officeEnd"
              label="Office End"
              value={entry.routine.officeEnd}
              onChange={(v) => updateRoutine("officeEnd", v)}
            />
            <TimeInput
              id="lunch"
              label="Lunch"
              value={entry.routine.lunch}
              onChange={(v) => updateRoutine("lunch", v)}
            />
            <TimeInput
              id="returnHome"
              label="Return Home"
              value={entry.routine.returnHome}
              onChange={(v) => updateRoutine("returnHome", v)}
            />
          </div>
          {workingHours > 0 && (
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
              <p className="text-sm text-indigo-700 font-medium">
                ⏱ Working hours today: <strong>{workingHours}h</strong>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fitness */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">💪 Fitness</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="steps"
                className="text-xs font-medium text-muted-foreground"
              >
                Steps Today
              </Label>
              <Input
                id="steps"
                type="number"
                min={0}
                data-ocid="daily.steps.input"
                value={entry.fitness.steps || ""}
                onChange={(e) =>
                  setEntry((prev) => ({
                    ...prev,
                    fitness: { ...prev.fitness, steps: Number(e.target.value) },
                  }))
                }
                placeholder="e.g. 8000"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="workoutDur"
                className="text-xs font-medium text-muted-foreground"
              >
                Workout Duration (min)
              </Label>
              <Input
                id="workoutDur"
                type="number"
                min={0}
                data-ocid="daily.workout.input"
                value={entry.fitness.workoutDuration || ""}
                onChange={(e) =>
                  setEntry((prev) => ({
                    ...prev,
                    fitness: {
                      ...prev.fitness,
                      workoutDuration: Number(e.target.value),
                    },
                  }))
                }
                placeholder="e.g. 60"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Gym Today
              </Label>
              <div className="flex items-center gap-3 pt-2">
                <Switch
                  data-ocid="daily.gym.toggle"
                  checked={entry.fitness.gymAttended}
                  onCheckedChange={(v) =>
                    setEntry((prev) => ({
                      ...prev,
                      fitness: { ...prev.fitness, gymAttended: v },
                    }))
                  }
                />
                <span
                  className={`text-sm font-medium ${
                    entry.fitness.gymAttended
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {entry.fitness.gymAttended ? "Yes ✓" : "No"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Food Tracking */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">
            🍽️ Food & Nutrition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                data-ocid="daily.food.search_input"
                value={foodSearch}
                onChange={(e) => {
                  setFoodSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                placeholder="Search food (e.g. chicken, rice, banana...)"
                className="pl-9"
              />
            </div>
            {showDropdown && filteredFoods.length > 0 && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                {filteredFoods.map((food) => (
                  <button
                    type="button"
                    key={food.name}
                    data-ocid="daily.food.button"
                    onMouseDown={() => addFood(food)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                  >
                    <span className="font-medium text-foreground">
                      {food.name}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2 shrink-0">
                      {food.calories} kcal · P:{food.protein}g C:{food.carbs}g
                      F:{food.fats}g
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Food log */}
          {entry.food.length > 0 ? (
            <div className="space-y-2">
              {entry.food.map((item, i) => (
                <div
                  key={item.id}
                  data-ocid={`daily.food.row.${i + 1}`}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.calories} kcal · P:{item.protein}g · C:{item.carbs}g
                      · F:{item.fats}g
                    </p>
                  </div>
                  <button
                    type="button"
                    data-ocid={`daily.food.delete_button.${i + 1}`}
                    onClick={() => removeFood(item.id)}
                    className="ml-3 p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Separator className="my-3" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-orange-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-orange-600">
                    {totalCal}
                  </p>
                  <p className="text-xs text-orange-500 mt-0.5">Total kcal</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-indigo-600">
                    {macros.protein}g
                  </p>
                  <p className="text-xs text-indigo-500 mt-0.5">Protein</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-amber-600">
                    {macros.carbs}g
                  </p>
                  <p className="text-xs text-amber-500 mt-0.5">Carbs</p>
                </div>
                <div className="bg-teal-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-teal-600">
                    {macros.fats}g
                  </p>
                  <p className="text-xs text-teal-500 mt-0.5">Fats</p>
                </div>
              </div>
            </div>
          ) : (
            <div
              data-ocid="daily.food.empty_state"
              className="py-8 text-center"
            >
              <PlusCircle className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Search and add food items above
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Productivity */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">
            🧠 Productivity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Focus Score</Label>
              <Badge variant="secondary" className="font-mono">
                {entry.productivity.focusScore}/10
              </Badge>
            </div>
            <Slider
              data-ocid="daily.focus.input"
              min={1}
              max={10}
              step={1}
              value={[entry.productivity.focusScore]}
              onValueChange={([v]) =>
                setEntry((prev) => ({
                  ...prev,
                  productivity: { ...prev.productivity, focusScore: v },
                }))
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 – Distracted</span>
              <span>10 – Peak focus</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes
            </Label>
            <Textarea
              id="notes"
              data-ocid="daily.notes.textarea"
              value={entry.productivity.notes}
              onChange={(e) =>
                setEntry((prev) => ({
                  ...prev,
                  productivity: { ...prev.productivity, notes: e.target.value },
                }))
              }
              placeholder="How did your day go? Any reflections..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        className="w-full"
        size="lg"
        data-ocid="daily.save_bottom.submit_button"
      >
        Save Daily Log
      </Button>
    </div>
  );
}
