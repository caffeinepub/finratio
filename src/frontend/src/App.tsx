import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { BookmarkProvider } from "./contexts/BookmarkContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import ComparePage from "./pages/ComparePage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import RatioDetailPage from "./pages/RatioDetailPage";

export default function App() {
  return (
    <DarkModeProvider>
      <BookmarkProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/ratio/:id" element={<RatioDetailPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/compare" element={<ComparePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </BookmarkProvider>
    </DarkModeProvider>
  );
}
