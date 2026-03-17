import {
  BarChart2,
  Save,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { RATIOS } from "../ratios";

interface CompanyData {
  companyName: string;
  revenue: string;
  netIncome: string;
  grossProfit: string;
  totalAssets: string;
  totalEquity: string;
  currentAssets: string;
  currentLiabilities: string;
  inventory: string;
  cogs: string;
  ebit: string;
  interestExpense: string;
  marketCap: string;
  bookValuePerShare: string;
  eps: string;
  sharePrice: string;
  enterpriseValue: string;
  ebitda: string;
  priorRevenue: string;
  totalDebt: string;
}

const emptyData: CompanyData = {
  companyName: "",
  revenue: "",
  netIncome: "",
  grossProfit: "",
  totalAssets: "",
  totalEquity: "",
  currentAssets: "",
  currentLiabilities: "",
  inventory: "",
  cogs: "",
  ebit: "",
  interestExpense: "",
  marketCap: "",
  bookValuePerShare: "",
  eps: "",
  sharePrice: "",
  enterpriseValue: "",
  ebitda: "",
  priorRevenue: "",
  totalDebt: "",
};

const fields: { key: keyof CompanyData; label: string; placeholder: string }[] =
  [
    {
      key: "companyName",
      label: "Company Name",
      placeholder: "e.g. Apple Inc.",
    },
    { key: "revenue", label: "Revenue ($)", placeholder: "e.g. 394000000000" },
    {
      key: "netIncome",
      label: "Net Income ($)",
      placeholder: "e.g. 99800000000",
    },
    {
      key: "grossProfit",
      label: "Gross Profit ($)",
      placeholder: "e.g. 170800000000",
    },
    {
      key: "cogs",
      label: "Cost of Goods Sold ($)",
      placeholder: "e.g. 223000000000",
    },
    {
      key: "totalAssets",
      label: "Total Assets ($)",
      placeholder: "e.g. 352000000000",
    },
    {
      key: "totalEquity",
      label: "Total Equity ($)",
      placeholder: "e.g. 62000000000",
    },
    {
      key: "totalDebt",
      label: "Total Debt ($)",
      placeholder: "e.g. 120000000000",
    },
    {
      key: "currentAssets",
      label: "Current Assets ($)",
      placeholder: "e.g. 135000000000",
    },
    {
      key: "currentLiabilities",
      label: "Current Liabilities ($)",
      placeholder: "e.g. 145000000000",
    },
    {
      key: "inventory",
      label: "Inventory ($)",
      placeholder: "e.g. 6300000000",
    },
    { key: "ebit", label: "EBIT ($)", placeholder: "e.g. 119400000000" },
    {
      key: "interestExpense",
      label: "Interest Expense ($)",
      placeholder: "e.g. 3900000000",
    },
    { key: "sharePrice", label: "Share Price ($)", placeholder: "e.g. 189" },
    { key: "eps", label: "Earnings Per Share ($)", placeholder: "e.g. 6.16" },
    {
      key: "marketCap",
      label: "Market Cap ($)",
      placeholder: "e.g. 2900000000000",
    },
    {
      key: "bookValuePerShare",
      label: "Book Value Per Share ($)",
      placeholder: "e.g. 4.25",
    },
    {
      key: "enterpriseValue",
      label: "Enterprise Value ($)",
      placeholder: "e.g. 2980000000000",
    },
    { key: "ebitda", label: "EBITDA ($)", placeholder: "e.g. 130000000000" },
    {
      key: "priorRevenue",
      label: "Prior Year Revenue ($)",
      placeholder: "e.g. 365800000000",
    },
  ];

function getStatus(
  value: number,
  interp: {
    thresholdLow: number;
    thresholdHigh: number;
    higherIsBetter: boolean;
  },
) {
  if (!Number.isFinite(value)) return "n/a";
  if (interp.higherIsBetter) {
    if (value >= interp.thresholdHigh) return "strong";
    if (value >= interp.thresholdLow) return "moderate";
    return "weak";
  }
  if (value <= interp.thresholdLow) return "strong";
  if (value <= interp.thresholdHigh) return "moderate";
  return "weak";
}

function formatValue(value: number, format: string) {
  if (!Number.isFinite(value)) return "N/A";
  if (format === "percent") return `${value.toFixed(2)}%`;
  return `${value.toFixed(2)}x`;
}

interface Snapshot {
  id: string;
  name: string;
  data: CompanyData;
  timestamp: number;
}

function loadSnapshots(): Snapshot[] {
  try {
    return JSON.parse(localStorage.getItem("finratio-snapshots") || "[]");
  } catch {
    return [];
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<CompanyData>(emptyData);
  const [results, setResults] = useState<
    { id: string; value: number; status: string }[] | null
  >(null);
  const [snapshots, setSnapshots] = useState<Snapshot[]>(loadSnapshots);

  const numData = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, Number(v) || 0]),
  );

  const calculate = () => {
    const inputMap: Record<string, number> = {
      netIncome: numData.netIncome,
      equity: numData.totalEquity,
      totalAssets: numData.totalAssets,
      revenue: numData.revenue,
      cogs: numData.cogs,
      currentAssets: numData.currentAssets,
      currentLiabilities: numData.currentLiabilities,
      inventory: numData.inventory,
      totalDebt: numData.totalDebt,
      ebit: numData.ebit,
      interestExpense: numData.interestExpense,
      sharePrice: numData.sharePrice,
      eps: numData.eps,
      bookValuePerShare: numData.bookValuePerShare,
      enterpriseValue: numData.enterpriseValue,
      ebitda: numData.ebitda,
      priorRevenue: numData.priorRevenue,
    };
    const res = RATIOS.map((r) => {
      try {
        const v = r.calculate(inputMap);
        return { id: r.id, value: v, status: getStatus(v, r.interpretation) };
      } catch {
        return { id: r.id, value: Number.NaN, status: "n/a" };
      }
    });
    setResults(res);
  };

  const saveSnapshot = () => {
    const snap: Snapshot = {
      id: Date.now().toString(),
      name: data.companyName || "Unnamed",
      data,
      timestamp: Date.now(),
    };
    const updated = [snap, ...snapshots];
    setSnapshots(updated);
    localStorage.setItem("finratio-snapshots", JSON.stringify(updated));
  };

  const deleteSnapshot = (id: string) => {
    const updated = snapshots.filter((s) => s.id !== id);
    setSnapshots(updated);
    localStorage.setItem("finratio-snapshots", JSON.stringify(updated));
  };

  const loadSnapshot = (snap: Snapshot) => {
    setData(snap.data);
    setResults(null);
  };

  const strong = results?.filter((r) => r.status === "strong") || [];
  const weak = results?.filter((r) => r.status === "weak") || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Company Dashboard
        </h1>
        <p className="text-slate-400">
          Enter company financials to automatically calculate all key ratios.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input form */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">
              Company Financials
            </h2>
            <div className="space-y-3">
              {fields.map((f) => (
                <div key={f.key}>
                  <label
                    htmlFor={`dash-${f.key}`}
                    className="block text-xs text-slate-400 mb-1"
                  >
                    {f.label}
                  </label>
                  <input
                    id={`dash-${f.key}`}
                    type={f.key === "companyName" ? "text" : "number"}
                    placeholder={f.placeholder}
                    value={data[f.key]}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, [f.key]: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 text-sm transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={calculate}
                className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <BarChart2 className="w-4 h-4" /> Calculate
              </button>
              {results && (
                <button
                  type="button"
                  onClick={saveSnapshot}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all"
                  title="Save snapshot"
                >
                  <Save className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Saved Snapshots */}
          {snapshots.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-4">
              <h2 className="text-white font-semibold mb-3">Saved Snapshots</h2>
              <div className="space-y-2">
                {snapshots.map((snap) => (
                  <div
                    key={snap.id}
                    className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800"
                  >
                    <button
                      type="button"
                      onClick={() => loadSnapshot(snap)}
                      className="text-left"
                    >
                      <p className="text-slate-200 text-sm font-medium">
                        {snap.name}
                      </p>
                      <p className="text-slate-600 text-xs">
                        {new Date(snap.timestamp).toLocaleDateString()}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSnapshot(snap.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {results ? (
            <div className="space-y-6">
              {/* Insights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <h3 className="text-green-400 font-semibold text-sm">
                      Strongest Areas
                    </h3>
                  </div>
                  {strong.slice(0, 3).length > 0 ? (
                    strong.slice(0, 3).map((r) => {
                      const ratio = RATIOS.find((rt) => rt.id === r.id)!;
                      return (
                        <div
                          key={r.id}
                          className="flex items-center justify-between mb-1"
                        >
                          <span className="text-slate-300 text-sm">
                            {ratio.name}
                          </span>
                          <span className="text-green-400 text-sm font-medium">
                            {formatValue(r.value, ratio.format)}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-slate-500 text-sm">None identified</p>
                  )}
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    <h3 className="text-red-400 font-semibold text-sm">
                      Areas to Watch
                    </h3>
                  </div>
                  {weak.slice(0, 3).length > 0 ? (
                    weak.slice(0, 3).map((r) => {
                      const ratio = RATIOS.find((rt) => rt.id === r.id)!;
                      return (
                        <div
                          key={r.id}
                          className="flex items-center justify-between mb-1"
                        >
                          <span className="text-slate-300 text-sm">
                            {ratio.name}
                          </span>
                          <span className="text-red-400 text-sm font-medium">
                            {formatValue(r.value, ratio.format)}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-slate-500 text-sm">None identified</p>
                  )}
                </div>
              </div>

              {/* All ratios grid */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800">
                  <h3 className="text-white font-semibold">All Ratios</h3>
                </div>
                <div className="divide-y divide-slate-800">
                  {results.map((r) => {
                    const ratio = RATIOS.find((rt) => rt.id === r.id)!;
                    const pct = Number.isFinite(r.value)
                      ? Math.min(
                          100,
                          Math.max(
                            0,
                            (r.value /
                              (ratio.interpretation.thresholdHigh * 2)) *
                              100,
                          ),
                        )
                      : 0;
                    return (
                      <div
                        key={r.id}
                        className="px-6 py-4 flex items-center gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-slate-200 text-sm font-medium truncate">
                              {ratio.name}
                            </span>
                            <span
                              className={`text-sm font-bold ml-2 ${
                                r.status === "strong"
                                  ? "text-green-400"
                                  : r.status === "moderate"
                                    ? "text-yellow-400"
                                    : r.status === "weak"
                                      ? "text-red-400"
                                      : "text-slate-600"
                              }`}
                            >
                              {formatValue(r.value, ratio.format)}
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                r.status === "strong"
                                  ? "bg-green-500"
                                  : r.status === "moderate"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                        <span
                          className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded ${
                            r.status === "strong"
                              ? "bg-green-500/20 text-green-400"
                              : r.status === "moderate"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : r.status === "weak"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-slate-800 text-slate-500"
                          }`}
                        >
                          {r.status === "n/a"
                            ? "N/A"
                            : r.status.charAt(0).toUpperCase() +
                              r.status.slice(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center h-64">
              <div className="text-center">
                <BarChart2 className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500">
                  Enter company data and click Calculate
                </p>
                <p className="text-slate-600 text-sm mt-1">
                  to see all ratios analyzed
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
