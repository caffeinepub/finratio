export type FoodEntry = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export type DayEntry = {
  date: string; // YYYY-MM-DD
  routine: {
    wakeUp: string;
    sleep: string;
    gymStart: string;
    gymEnd: string;
    officeStart: string;
    officeEnd: string;
    lunch: string;
    returnHome: string;
  };
  fitness: {
    steps: number;
    gymAttended: boolean;
    workoutDuration: number; // minutes
    alcoholConsumed: boolean;
  };
  food: FoodEntry[];
  productivity: {
    focusScore: number; // 1-10
    notes: string;
  };
};

export type Goals = {
  dailySteps: number;
  dailyCalories: number;
};

export type FoodDBItem = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};
