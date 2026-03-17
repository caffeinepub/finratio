import {
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { useBookmarks } from "../contexts/BookmarkContext";
import { CATEGORIES, RATIOS } from "../ratios";

function getStatus(
  value: number,
  interp: {
    thresholdLow: number;
    thresholdHigh: number;
    higherIsBetter: boolean;
  },
) {
  if (interp.higherIsBetter) {
    if (value >= interp.thresholdHigh) return "good";
    if (value >= interp.thresholdLow) return "ok";
    return "bad";
  }
  if (value <= interp.thresholdLow) return "good";
  if (value <= interp.thresholdHigh) return "ok";
  return "bad";
}

function formatValue(value: number, format: string) {
  if (format === "percent") return `${value.toFixed(2)}%`;
  if (format === "ratio" || format === "times") return `${value.toFixed(2)}x`;
  return value.toFixed(2);
}

function GaugeChart({
  value,
  max,
  color,
}: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const data = [{ value: pct, fill: color }];
  return (
    <ResponsiveContainer width="100%" height={160}>
      <RadialBarChart
        cx="50%"
        cy="80%"
        innerRadius="60%"
        outerRadius="90%"
        startAngle={180}
        endAngle={0}
        data={data}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background={{ fill: "#1e293b" }}
          dataKey="value"
          cornerRadius={8}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

export default function RatioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const ratio = RATIOS.find((r) => r.id === id);
  const { isBookmarked, toggle } = useBookmarks();
  const [eli5, setEli5] = useState(false);
  const [calcValues, setCalcValues] = useState<Record<string, string>>({});

  if (!ratio) return <Navigate to="/library" />;

  const cat = CATEGORIES.find((c) => c.name === ratio.category);
  const bookmarked = isBookmarked(ratio.id);

  const allFilled = ratio.inputs.every(
    (inp) => calcValues[inp.key] && !Number.isNaN(Number(calcValues[inp.key])),
  );
  const numVals = Object.fromEntries(
    Object.entries(calcValues).map(([k, v]) => [k, Number(v)]),
  );
  const result = allFilled ? ratio.calculate(numVals) : null;
  const status =
    result !== null ? getStatus(result, ratio.interpretation) : null;
  const statusColors: Record<string, string> = {
    good: "#10b981",
    ok: "#f59e0b",
    bad: "#ef4444",
  };
  const gaugeMax = ratio.interpretation.thresholdHigh * 2;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-teal-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/library" className="hover:text-teal-400 transition-colors">
          Library
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-300">{ratio.name}</span>
      </nav>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cat?.bgColor} ${cat?.color} border ${cat?.borderColor}`}
            >
              {ratio.category}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">{ratio.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEli5(!eli5)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              eli5
                ? "bg-teal-500/20 border-teal-500/30 text-teal-400"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-100"
            }`}
          >
            {eli5 ? (
              <ToggleRight className="w-4 h-4" />
            ) : (
              <ToggleLeft className="w-4 h-4" />
            )}
            ELI5 Mode
          </button>
          <button
            type="button"
            onClick={() => toggle(ratio.id)}
            className={`p-2 rounded-xl border transition-all ${
              bookmarked
                ? "bg-teal-500/20 border-teal-500/30 text-teal-400"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-teal-400"
            }`}
          >
            {bookmarked ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-3">Definition</h2>
            {eli5 ? (
              <p className="text-slate-300 leading-relaxed">
                <span className="inline-flex items-center gap-1.5 text-teal-400 text-xs font-semibold bg-teal-500/10 px-2 py-0.5 rounded mr-2">
                  🐣 ELI5
                </span>
                {ratio.eli5}
              </p>
            ) : (
              <p className="text-slate-300 leading-relaxed">
                {ratio.definition}
              </p>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-3">Formula</h2>
            <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 text-center mb-4">
              <code className="text-teal-400 text-lg font-mono">
                {ratio.formula}
              </code>
            </div>
            <div className="space-y-2">
              {ratio.formulaVars.map((v) => (
                <div key={v.symbol} className="flex gap-3">
                  <code className="text-teal-400 text-sm font-mono shrink-0 bg-teal-500/10 px-2 py-0.5 rounded">
                    {v.symbol}
                  </code>
                  <span className="text-slate-400 text-sm">
                    {v.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Interpretation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <span className="text-red-400 text-xs font-semibold">
                  {ratio.interpretation.badLabel}
                </span>
                <p className="text-slate-300 text-sm mt-1">
                  {ratio.interpretation.bad}
                </p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <span className="text-yellow-400 text-xs font-semibold">
                  {ratio.interpretation.okLabel}
                </span>
                <p className="text-slate-300 text-sm mt-1">
                  {ratio.interpretation.ok}
                </p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <span className="text-green-400 text-xs font-semibold">
                  {ratio.interpretation.goodLabel}
                </span>
                <p className="text-slate-300 text-sm mt-1">
                  {ratio.interpretation.good}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">
              Industry Benchmarks
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-slate-400 font-medium pb-3 pr-4">
                      Industry
                    </th>
                    <th className="text-left text-slate-400 font-medium pb-3 pr-4">
                      Typical Range
                    </th>
                    <th className="text-left text-slate-400 font-medium pb-3">
                      Good Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ratio.benchmarks.map((b) => (
                    <tr
                      key={b.industry}
                      className="border-b border-slate-800/50"
                    >
                      <td className="py-3 pr-4 text-slate-300">{b.industry}</td>
                      <td className="py-3 pr-4 text-slate-400">{b.typical}</td>
                      <td className="py-3 text-green-400 font-medium">
                        {b.good}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-3">
              Real-World Example
            </h2>
            <p className="text-slate-300 text-sm mb-4">
              {ratio.example.scenario}
            </p>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl px-4 py-2">
                <span className="text-teal-400 text-xl font-bold">
                  {ratio.example.resultLabel}
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                {ratio.example.interpretation}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sticky top-24">
            <h2 className="text-white font-semibold mb-4">
              Interactive Calculator
            </h2>
            <div className="space-y-3 mb-4">
              {ratio.inputs.map((inp) => (
                <div key={inp.key}>
                  <label
                    htmlFor={`calc-${inp.key}`}
                    className="block text-xs text-slate-400 mb-1"
                  >
                    {inp.label}
                  </label>
                  <input
                    id={`calc-${inp.key}`}
                    type="number"
                    placeholder={inp.placeholder}
                    value={calcValues[inp.key] || ""}
                    onChange={(e) =>
                      setCalcValues((prev) => ({
                        ...prev,
                        [inp.key]: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 text-sm transition-colors"
                  />
                </div>
              ))}
            </div>

            {result !== null ? (
              <div>
                <GaugeChart
                  value={result}
                  max={gaugeMax}
                  color={statusColors[status!]}
                />
                <div className="text-center -mt-4">
                  <div className="text-3xl font-bold text-white mb-1">
                    {formatValue(result, ratio.format)}
                  </div>
                  <div
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                      status === "good"
                        ? "bg-green-500/20 text-green-400"
                        : status === "ok"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {status === "good"
                      ? ratio.interpretation.goodLabel
                      : status === "ok"
                        ? ratio.interpretation.okLabel
                        : ratio.interpretation.badLabel}
                  </div>
                  <p className="text-slate-400 text-xs mt-3">
                    {status === "good"
                      ? ratio.interpretation.good
                      : status === "ok"
                        ? ratio.interpretation.ok
                        : ratio.interpretation.bad}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-600">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-sm">Enter values above to calculate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
