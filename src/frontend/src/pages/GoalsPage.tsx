import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame, Footprints, Target } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useFitness } from "../contexts/FitnessContext";

export default function GoalsPage() {
  const { goals, updateGoals } = useFitness();
  const [steps, setSteps] = useState(goals.dailySteps.toString());
  const [calories, setCalories] = useState(goals.dailyCalories.toString());

  const handleSave = () => {
    const parsedSteps = Number(steps);
    const parsedCal = Number(calories);
    if (!parsedSteps || parsedSteps <= 0 || !parsedCal || parsedCal <= 0) {
      toast.error("Please enter valid positive numbers.");
      return;
    }
    updateGoals({ dailySteps: parsedSteps, dailyCalories: parsedCal });
    toast.success("Goals updated!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Goals
        </h1>
        <p className="text-muted-foreground text-sm">
          Set your daily targets and track progress
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Footprints className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <CardTitle className="text-base">Daily Steps</CardTitle>
                  <CardDescription className="text-xs">
                    Current: {goals.dailySteps.toLocaleString()} steps
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="stepsGoal" className="text-sm font-medium">
                  Step Goal
                </Label>
                <Input
                  id="stepsGoal"
                  type="number"
                  min={1}
                  data-ocid="goals.steps.input"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  placeholder="e.g. 10000"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[5000, 8000, 10000, 12000, 15000, 20000].map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setSteps(v.toString())}
                    className={`text-xs py-1.5 px-2 rounded-lg border transition-colors ${
                      steps === v.toString()
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {v.toLocaleString()}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <CardTitle className="text-base">Daily Calories</CardTitle>
                  <CardDescription className="text-xs">
                    Current: {goals.dailyCalories.toLocaleString()} kcal
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="calGoal" className="text-sm font-medium">
                  Calorie Goal
                </Label>
                <Input
                  id="calGoal"
                  type="number"
                  min={1}
                  data-ocid="goals.calories.input"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="e.g. 2000"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1500, 1800, 2000, 2200, 2500, 3000].map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setCalories(v.toString())}
                    className={`text-xs py-1.5 px-2 rounded-lg border transition-colors ${
                      calories === v.toString()
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {v.toLocaleString()}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="shadow-card bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-5 flex items-center gap-4">
          <Target className="w-10 h-10 text-primary flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-foreground">
              Stay consistent and hit your goals every day
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Small daily wins build long-term results. Your current goals:{" "}
              {Number(steps).toLocaleString()} steps ·{" "}
              {Number(calories).toLocaleString()} kcal
            </p>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        size="lg"
        className="w-full"
        data-ocid="goals.save.submit_button"
      >
        Save Goals
      </Button>
    </div>
  );
}
