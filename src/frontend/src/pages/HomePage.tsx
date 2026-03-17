import {
  ArrowRight,
  BarChart2,
  BookOpen,
  Calculator,
  DollarSign,
  Droplets,
  Search,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import RatioCard from "../components/RatioCard";
import { CATEGORIES, RATIOS } from "../ratios";

const categoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  TrendingUp,
  Droplets,
  Shield,
  Zap,
  DollarSign,
};

const steps = [
  {
    icon: Search,
    title: "Find a Ratio",
    description:
      "Browse our library of 13 key financial ratios organized by category.",
  },
  {
    icon: BookOpen,
    title: "Understand It",
    description:
      "Read clear explanations, formulas, and real-world examples. Toggle ELI5 mode!",
  },
  {
    icon: Calculator,
    title: "Calculate & Analyze",
    description:
      "Enter your numbers and instantly see results with visual charts and insights.",
  },
];

export default function HomePage() {
  const featured = RATIOS.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(20,184,166,0.08),_transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-6">
            <TrendingUp className="w-3.5 h-3.5" />
            13 Financial Ratios Explained
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Master Financial Ratios
            <span className="block text-teal-400">Easily</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Understand, calculate, and master the key financial ratios used by
            investors, analysts, and finance professionals — explained in plain
            English.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/library"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-xl transition-all"
            >
              Explore Ratios <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl border border-slate-700 transition-all"
            >
              <BarChart2 className="w-4 h-4" />
              Try Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Browse by Category
          </h2>
          <p className="text-slate-400">
            Every ratio organized by what it measures
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = categoryIcons[cat.icon];
            const count = RATIOS.filter((r) => r.category === cat.name).length;
            return (
              <Link
                key={cat.name}
                to={`/library?category=${cat.name}`}
                className={`group p-5 rounded-xl border ${cat.borderColor} ${cat.bgColor} hover:scale-105 transition-all duration-200`}
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-slate-900 border ${cat.borderColor} flex items-center justify-center mb-3`}
                >
                  {Icon && <Icon className={`w-5 h-5 ${cat.color}`} />}
                </div>
                <h3 className={`font-semibold ${cat.color} mb-1`}>
                  {cat.name}
                </h3>
                <p className="text-slate-500 text-xs">
                  {count} ratio{count !== 1 ? "s" : ""}
                </p>
                <p className="text-slate-500 text-xs mt-1">{cat.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-900/50 border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              How It Works
            </h2>
            <p className="text-slate-400">Three steps to financial literacy</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="relative inline-flex">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-teal-400" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-teal-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ratios */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Popular Ratios
            </h2>
            <p className="text-slate-400 text-sm">
              Start with the most commonly used ratios
            </p>
          </div>
          <Link
            to="/library"
            className="text-teal-400 hover:text-teal-300 text-sm font-medium flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((ratio) => (
            <RatioCard key={ratio.id} ratio={ratio} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative overflow-hidden bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-2xl p-8 md:p-12 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(20,184,166,0.05),_transparent_70%)]" />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Analyze Any Company
            </h2>
            <p className="text-slate-400 mb-6">
              Enter company financials and get a full ratio analysis with
              strengths & weaknesses highlighted.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-xl transition-all"
            >
              Open Dashboard <BarChart2 className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
