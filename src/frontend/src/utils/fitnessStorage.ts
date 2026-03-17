import type { DayEntry, Goals } from "../types/fitness";

const DATA_KEY = "fitness-tracker-data";
const GOALS_KEY = "fitness-tracker-goals";
const INITIALIZED_KEY = "fitness-tracker-initialized";

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function subDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
}

export function parseTimeToMinutes(time: string): number {
  if (!time) return 0;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function calcHoursDiff(start: string, end: string): number {
  if (!start || !end) return 0;
  const diff = parseTimeToMinutes(end) - parseTimeToMinutes(start);
  return diff > 0 ? Math.round((diff / 60) * 10) / 10 : 0;
}

export function calcMinutesDiff(start: string, end: string): number {
  if (!start || !end) return 0;
  const diff = parseTimeToMinutes(end) - parseTimeToMinutes(start);
  return diff > 0 ? diff : 0;
}

export function getTotalCalories(food: DayEntry["food"]): number {
  return Math.round(food.reduce((s, f) => s + f.calories, 0));
}

export function getTotalMacros(food: DayEntry["food"]) {
  return {
    protein: Math.round(food.reduce((s, f) => s + f.protein, 0) * 10) / 10,
    carbs: Math.round(food.reduce((s, f) => s + f.carbs, 0) * 10) / 10,
    fats: Math.round(food.reduce((s, f) => s + f.fats, 0) * 10) / 10,
  };
}

export function loadEntries(): DayEntry[] {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DayEntry[];
    // Migrate old entries missing alcoholConsumed
    return parsed.map((e) => ({
      ...e,
      fitness: {
        ...e.fitness,
        alcoholConsumed:
          (e.fitness as { alcoholConsumed?: boolean }).alcoholConsumed ?? false,
      },
    }));
  } catch {
    return [];
  }
}

export function saveEntries(entries: DayEntry[]): void {
  localStorage.setItem(DATA_KEY, JSON.stringify(entries));
}

export function loadGoals(): Goals {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    return raw ? JSON.parse(raw) : { dailySteps: 10000, dailyCalories: 2000 };
  } catch {
    return { dailySteps: 10000, dailyCalories: 2000 };
  }
}

export function saveGoals(goals: Goals): void {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export function calcGymStreak(entries: DayEntry[]): number {
  const today = new Date();
  let streak = 0;
  let checkDate = today;

  // If today has no gym entry, start from yesterday
  const todayStr = formatDate(today);
  const todayEntry = entries.find((e) => e.date === todayStr);
  if (!todayEntry || !todayEntry.fitness.gymAttended) {
    checkDate = subDays(today, 1);
  }

  for (let i = 0; i < 365; i++) {
    const dateStr = formatDate(checkDate);
    const entry = entries.find((e) => e.date === dateStr);
    if (!entry || !entry.fitness.gymAttended) break;
    streak++;
    checkDate = subDays(checkDate, 1);
  }
  return streak;
}

export function getLast7Days(): string[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => formatDate(subDays(today, 6 - i)));
}

export function getEmptyEntry(date: string): DayEntry {
  return {
    date,
    routine: {
      wakeUp: "",
      sleep: "",
      gymStart: "",
      gymEnd: "",
      officeStart: "",
      officeEnd: "",
      lunch: "",
      returnHome: "",
    },
    fitness: {
      steps: 0,
      gymAttended: false,
      workoutDuration: 0,
      alcoholConsumed: false,
    },
    food: [],
    productivity: { focusScore: 5, notes: "" },
  };
}

const SAMPLE_ENTRIES: DayEntry[] = [
  {
    date: "2026-03-11",
    routine: {
      wakeUp: "06:15",
      sleep: "22:30",
      gymStart: "07:00",
      gymEnd: "08:15",
      officeStart: "09:30",
      officeEnd: "18:30",
      lunch: "13:00",
      returnHome: "19:15",
    },
    fitness: {
      steps: 8200,
      gymAttended: true,
      workoutDuration: 75,
      alcoholConsumed: false,
    },
    food: [
      {
        id: "1",
        name: "Oats, cooked (1 cup)",
        calories: 166,
        protein: 6,
        carbs: 28,
        fats: 4,
      },
      {
        id: "2",
        name: "Banana (1 medium)",
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fats: 0.4,
      },
      {
        id: "3",
        name: "Chicken breast (100g)",
        calories: 165,
        protein: 31,
        carbs: 0,
        fats: 3.6,
      },
      {
        id: "4",
        name: "White rice (1 cup)",
        calories: 242,
        protein: 4.4,
        carbs: 53,
        fats: 0.4,
      },
      {
        id: "5",
        name: "Broccoli (1 cup)",
        calories: 55,
        protein: 4,
        carbs: 11,
        fats: 0.6,
      },
      {
        id: "6",
        name: "Whey protein (1 scoop)",
        calories: 120,
        protein: 24,
        carbs: 3,
        fats: 1.5,
      },
    ],
    productivity: {
      focusScore: 8,
      notes:
        "Great day! Hit all workout goals and stayed focused during the afternoon review.",
    },
  },
  {
    date: "2026-03-12",
    routine: {
      wakeUp: "07:00",
      sleep: "23:00",
      gymStart: "",
      gymEnd: "",
      officeStart: "09:15",
      officeEnd: "18:00",
      lunch: "13:30",
      returnHome: "18:45",
    },
    fitness: {
      steps: 4800,
      gymAttended: false,
      workoutDuration: 0,
      alcoholConsumed: true,
    },
    food: [
      {
        id: "1",
        name: "Egg (1 large)",
        calories: 78,
        protein: 6,
        carbs: 0.6,
        fats: 5,
      },
      {
        id: "2",
        name: "Bread, white (1 slice)",
        calories: 79,
        protein: 3,
        carbs: 15,
        fats: 1,
      },
      {
        id: "3",
        name: "Tea with milk (1 cup)",
        calories: 35,
        protein: 1,
        carbs: 4,
        fats: 1,
      },
      {
        id: "4",
        name: "Dal (1 cup)",
        calories: 230,
        protein: 18,
        carbs: 40,
        fats: 1,
      },
      {
        id: "5",
        name: "Roti (1 piece)",
        calories: 71,
        protein: 3,
        carbs: 15,
        fats: 0.4,
      },
      {
        id: "6",
        name: "Roti (1 piece)",
        calories: 71,
        protein: 3,
        carbs: 15,
        fats: 0.4,
      },
    ],
    productivity: {
      focusScore: 6,
      notes:
        "Rest day. Felt a bit slow in the morning but got better after lunch.",
    },
  },
  {
    date: "2026-03-13",
    routine: {
      wakeUp: "05:45",
      sleep: "22:00",
      gymStart: "06:30",
      gymEnd: "07:45",
      officeStart: "09:00",
      officeEnd: "18:30",
      lunch: "12:45",
      returnHome: "19:00",
    },
    fitness: {
      steps: 11500,
      gymAttended: true,
      workoutDuration: 75,
      alcoholConsumed: false,
    },
    food: [
      {
        id: "1",
        name: "Whey protein (1 scoop)",
        calories: 120,
        protein: 24,
        carbs: 3,
        fats: 1.5,
      },
      {
        id: "2",
        name: "Banana (1 medium)",
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fats: 0.4,
      },
      {
        id: "3",
        name: "Chicken breast (100g)",
        calories: 165,
        protein: 31,
        carbs: 0,
        fats: 3.6,
      },
      {
        id: "4",
        name: "Brown rice (1 cup)",
        calories: 216,
        protein: 5,
        carbs: 45,
        fats: 1.8,
      },
      {
        id: "5",
        name: "Spinach (1 cup)",
        calories: 7,
        protein: 0.9,
        carbs: 1.1,
        fats: 0.1,
      },
      {
        id: "6",
        name: "Salmon (100g)",
        calories: 208,
        protein: 20,
        carbs: 0,
        fats: 13,
      },
      {
        id: "7",
        name: "Sweet potato (1 medium)",
        calories: 103,
        protein: 2,
        carbs: 24,
        fats: 0.1,
      },
    ],
    productivity: {
      focusScore: 9,
      notes:
        "Crushed it today. Best workout of the week. Completed sprint review on time.",
    },
  },
  {
    date: "2026-03-14",
    routine: {
      wakeUp: "06:30",
      sleep: "22:45",
      gymStart: "07:15",
      gymEnd: "08:30",
      officeStart: "09:30",
      officeEnd: "18:00",
      lunch: "13:00",
      returnHome: "18:45",
    },
    fitness: {
      steps: 9500,
      gymAttended: true,
      workoutDuration: 75,
      alcoholConsumed: false,
    },
    food: [
      {
        id: "1",
        name: "Oats, cooked (1 cup)",
        calories: 166,
        protein: 6,
        carbs: 28,
        fats: 4,
      },
      {
        id: "2",
        name: "Greek Yogurt (100g)",
        calories: 59,
        protein: 10,
        carbs: 3.6,
        fats: 0.4,
      },
      {
        id: "3",
        name: "Almonds (1 oz)",
        calories: 164,
        protein: 6,
        carbs: 6,
        fats: 14,
      },
      {
        id: "4",
        name: "Pasta, cooked (1 cup)",
        calories: 220,
        protein: 8,
        carbs: 43,
        fats: 1.3,
      },
      {
        id: "5",
        name: "Tuna (100g)",
        calories: 116,
        protein: 26,
        carbs: 0,
        fats: 1,
      },
    ],
    productivity: {
      focusScore: 7,
      notes:
        "Productive day. Had a long stand-up but good collaboration session.",
    },
  },
  {
    date: "2026-03-15",
    routine: {
      wakeUp: "07:30",
      sleep: "23:30",
      gymStart: "",
      gymEnd: "",
      officeStart: "10:00",
      officeEnd: "17:30",
      lunch: "14:00",
      returnHome: "18:15",
    },
    fitness: {
      steps: 5200,
      gymAttended: false,
      workoutDuration: 0,
      alcoholConsumed: false,
    },
    food: [
      {
        id: "1",
        name: "Egg (1 large)",
        calories: 78,
        protein: 6,
        carbs: 0.6,
        fats: 5,
      },
      {
        id: "2",
        name: "Egg (1 large)",
        calories: 78,
        protein: 6,
        carbs: 0.6,
        fats: 5,
      },
      {
        id: "3",
        name: "Tea with milk (1 cup)",
        calories: 35,
        protein: 1,
        carbs: 4,
        fats: 1,
      },
      {
        id: "4",
        name: "Dosa (1 piece)",
        calories: 168,
        protein: 4,
        carbs: 25,
        fats: 6,
      },
      {
        id: "5",
        name: "Sambar (1 cup)",
        calories: 102,
        protein: 6,
        carbs: 17,
        fats: 1.5,
      },
      {
        id: "6",
        name: "Curd / Yogurt (1 cup)",
        calories: 98,
        protein: 11,
        carbs: 8,
        fats: 3,
      },
    ],
    productivity: {
      focusScore: 5,
      notes: "Weekend mode. Rested and caught up on reading. Needed the break.",
    },
  },
  {
    date: "2026-03-16",
    routine: {
      wakeUp: "06:00",
      sleep: "22:00",
      gymStart: "06:45",
      gymEnd: "08:00",
      officeStart: "09:15",
      officeEnd: "18:15",
      lunch: "13:00",
      returnHome: "19:00",
    },
    fitness: {
      steps: 10800,
      gymAttended: true,
      workoutDuration: 75,
      alcoholConsumed: false,
    },
    food: [
      {
        id: "1",
        name: "Whey protein (1 scoop)",
        calories: 120,
        protein: 24,
        carbs: 3,
        fats: 1.5,
      },
      {
        id: "2",
        name: "Oats, cooked (1 cup)",
        calories: 166,
        protein: 6,
        carbs: 28,
        fats: 4,
      },
      {
        id: "3",
        name: "Chicken breast (100g)",
        calories: 165,
        protein: 31,
        carbs: 0,
        fats: 3.6,
      },
      {
        id: "4",
        name: "Brown rice (1 cup)",
        calories: 216,
        protein: 5,
        carbs: 45,
        fats: 1.8,
      },
      {
        id: "5",
        name: "Broccoli (1 cup)",
        calories: 55,
        protein: 4,
        carbs: 11,
        fats: 0.6,
      },
      {
        id: "6",
        name: "Peanut butter (2 tbsp)",
        calories: 188,
        protein: 8,
        carbs: 6,
        fats: 16,
      },
      {
        id: "7",
        name: "Apple (1 medium)",
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fats: 0.3,
      },
    ],
    productivity: {
      focusScore: 8,
      notes:
        "Excellent focus. Finished two major features before noon. Gym was 🔥.",
    },
  },
  {
    date: "2026-03-17",
    routine: {
      wakeUp: "06:20",
      sleep: "",
      gymStart: "07:10",
      gymEnd: "08:10",
      officeStart: "09:30",
      officeEnd: "",
      lunch: "13:00",
      returnHome: "",
    },
    fitness: {
      steps: 7100,
      gymAttended: true,
      workoutDuration: 60,
      alcoholConsumed: false,
    },
    food: [
      {
        id: "1",
        name: "Oats, cooked (1 cup)",
        calories: 166,
        protein: 6,
        carbs: 28,
        fats: 4,
      },
      {
        id: "2",
        name: "Banana (1 medium)",
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fats: 0.4,
      },
      {
        id: "3",
        name: "Whey protein (1 scoop)",
        calories: 120,
        protein: 24,
        carbs: 3,
        fats: 1.5,
      },
      {
        id: "4",
        name: "Chicken breast (100g)",
        calories: 165,
        protein: 31,
        carbs: 0,
        fats: 3.6,
      },
      {
        id: "5",
        name: "White rice (1 cup)",
        calories: 242,
        protein: 4.4,
        carbs: 53,
        fats: 0.4,
      },
    ],
    productivity: {
      focusScore: 7,
      notes:
        "Morning gym session went well. Still tracking calories for the day.",
    },
  },
];

export function initializeSampleData(): void {
  if (localStorage.getItem(INITIALIZED_KEY)) return;
  const existing = loadEntries();
  if (existing.length === 0) {
    saveEntries(SAMPLE_ENTRIES);
  }
  localStorage.setItem(INITIALIZED_KEY, "true");
}
