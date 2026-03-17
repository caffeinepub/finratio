import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <span className="text-lg font-bold text-white">
                Fin<span className="text-teal-400">Ratio</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm">
              Making financial analysis simple, visual, and beginner-friendly.
            </p>
          </div>
          <div>
            <h3 className="text-slate-300 font-semibold mb-3">Learn</h3>
            <div className="space-y-2">
              <Link
                to="/library"
                className="block text-slate-500 hover:text-teal-400 text-sm transition-colors"
              >
                Ratio Library
              </Link>
              <Link
                to="/dashboard"
                className="block text-slate-500 hover:text-teal-400 text-sm transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/compare"
                className="block text-slate-500 hover:text-teal-400 text-sm transition-colors"
              >
                Compare Companies
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-slate-300 font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              {[
                "Profitability",
                "Liquidity",
                "Solvency",
                "Efficiency",
                "Valuation",
              ].map((cat) => (
                <Link
                  key={cat}
                  to={`/library?category=${cat}`}
                  className="block text-slate-500 hover:text-teal-400 text-sm transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-6 text-center">
          <p className="text-slate-600 text-sm">
            &copy; {new Date().getFullYear()} FinRatio. For educational purposes
            only. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
