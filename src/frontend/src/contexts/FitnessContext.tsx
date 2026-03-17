import { createContext, useContext, useEffect, useState } from "react";
import type { DayEntry, Goals } from "../types/fitness";
import {
  calcGymStreak,
  formatDate,
  getEmptyEntry,
  initializeSampleData,
  loadEntries,
  loadGoals,
  saveEntries,
  saveGoals,
} from "../utils/fitnessStorage";

type FitnessContextType = {
  entries: DayEntry[];
  goals: Goals;
  gymStreak: number;
  upsertEntry: (entry: DayEntry) => void;
  updateGoals: (g: Goals) => void;
  getEntry: (date: string) => DayEntry;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
};

const FitnessContext = createContext<FitnessContextType | null>(null);

export function FitnessProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [goals, setGoals] = useState<Goals>({
    dailySteps: 10000,
    dailyCalories: 2000,
  });
  const [selectedDate, setSelectedDate] = useState<string>(
    formatDate(new Date()),
  );

  useEffect(() => {
    initializeSampleData();
    setEntries(loadEntries());
    setGoals(loadGoals());
  }, []);

  const upsertEntry = (entry: DayEntry) => {
    setEntries((prev) => {
      const next = prev
        .filter((e) => e.date !== entry.date)
        .concat(entry)
        .sort((a, b) => a.date.localeCompare(b.date));
      saveEntries(next);
      return next;
    });
  };

  const updateGoals = (g: Goals) => {
    setGoals(g);
    saveGoals(g);
  };

  const getEntry = (date: string): DayEntry => {
    return entries.find((e) => e.date === date) ?? getEmptyEntry(date);
  };

  const gymStreak = calcGymStreak(entries);

  return (
    <FitnessContext.Provider
      value={{
        entries,
        goals,
        gymStreak,
        upsertEntry,
        updateGoals,
        getEntry,
        selectedDate,
        setSelectedDate,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
}

export function useFitness() {
  const ctx = useContext(FitnessContext);
  if (!ctx) throw new Error("useFitness must be used inside FitnessProvider");
  return ctx;
}
