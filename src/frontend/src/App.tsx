import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import FitnessNavigation from "./components/FitnessNavigation";
import { FitnessProvider } from "./contexts/FitnessContext";
import DailyLogPage from "./pages/DailyLogPage";
import FitDashboardPage from "./pages/FitDashboardPage";
import GoalsPage from "./pages/GoalsPage";
import JournalPage from "./pages/JournalPage";
import WeeklyAnalysisPage from "./pages/WeeklyAnalysisPage";

export type Page = "dashboard" | "daily-log" | "weekly" | "goals" | "journal";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("dashboard");

  return (
    <FitnessProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
        <FitnessNavigation
          activePage={activePage}
          setActivePage={setActivePage}
        />
        <main className="md:pl-64 pb-24 md:pb-8">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            {activePage === "dashboard" && <FitDashboardPage />}
            {activePage === "daily-log" && <DailyLogPage />}
            {activePage === "weekly" && <WeeklyAnalysisPage />}
            {activePage === "goals" && <GoalsPage />}
            {activePage === "journal" && <JournalPage />}
          </div>
        </main>
      </div>
      <Toaster />
    </FitnessProvider>
  );
}
