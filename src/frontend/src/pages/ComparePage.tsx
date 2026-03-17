import { ChevronDown, ChevronUp, GitCompare, Minus } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RATIOS } from "../ratios";

interface CompanyData {
  companyName: string;
  revenue: string;
  netIncome: string;
  totalAssets: string;
  totalEquity: string;
  currentAssets: string;
  currentLiabilities: string;
  inventory: string;
  cogs: string;
  ebit: string;
  interestExpense: string;
  sharePrice: string;
  eps: string;
  bookValuePerShare: string;
  enterpriseValue: string;
  ebitda: string;
  totalDebt: string;
}

const emptyData: CompanyData = {
  companyName: "",
  revenue: "",
  netIncome: "",
  totalAssets: "",
  totalEquity: "",
  currentAssets: "",
  currentLiabilities: "",
  inventory: "",
  cogs: "",
  ebit: "",
  interestExpense: "",
  sharePrice: "",
  eps: "",
  bookValuePerShare: "",
  enterpriseValue: "",
  ebitda: "",
  totalDebt: "",
};

const fields: { key: keyof CompanyData; label: string }[] = [
  { key: "companyName", label: "Company Name" },
  { key: "revenue", label: "Revenue ($)" },
  { key: "netIncome", label: "Net Income ($)" },
  { key: "totalAssets", label: "Total Assets ($)" },
  { key: "totalEquity", label: "Total Equity ($)" },
  { key: "totalDebt", label: "Total Debt ($)" },
  { key: "currentAssets", label: "Current Assets ($)" },
  { key: "currentLiabilities", label: "Current Liabilities ($)" },
  { key: "inventory", label: "Inventory ($)" },
  { key: "cogs", label: "COGS ($)" },
  { key: "ebit", label: "EBIT ($)" },
  { key: "interestExpense", label: "Interest Expense ($)" },
  { key: "sharePrice", label: "Share Price ($)" },
  { key: "eps", label: "EPS ($)" },
  { key: "bookValuePerShare", label: "Book Value/Share ($)" },
  { key: "enterpriseValue", label: "Enterprise Value ($)" },
  { key: "ebitda", label: "EBITDA ($)" },
];

function toNum(v: string) {
  return Number(v) || 0;
}

function calcAll(d: CompanyData) {
  const n = {
    netIncome: toNum(d.netIncome),
    equity: toNum(d.totalEquity),
    totalAssets: toNum(d.totalAssets),
    revenue: toNum(d.revenue),
    cogs: toNum(d.cogs),
    currentAssets: toNum(d.currentAssets),
    currentLiabilities: toNum(d.currentLiabilities),
    inventory: toNum(d.inventory),
    totalDebt: toNum(d.totalDebt),
    ebit: toNum(d.ebit),
    interestExpense: toNum(d.interestExpense),
    sharePrice: toNum(d.sharePrice),
    eps: toNum(d.eps),
    bookValuePerShare: toNum(d.bookValuePerShare),
    enterpriseValue: toNum(d.enterpriseValue),
    ebitda: toNum(d.ebitda),
  };
  return RATIOS.map((r) => {
    try {
      return {
        id: r.id,
        name: r.name,
        value: r.calculate(n),
        format: r.format,
        higherIsBetter: r.interpretation.higherIsBetter,
      };
    } catch {
      return {
        id: r.id,
        name: r.name,
        value: Number.NaN,
        format: r.format,
        higherIsBetter: r.interpretation.higherIsBetter,
      };
    }
  });
}

function fmt(v: number, format: string) {
  if (!Number.isFinite(v)) return "N/A";
  if (format === "percent") return `${v.toFixed(2)}%`;
  return `${v.toFixed(2)}x`;
}

const CHART_RATIOS = [
  "roe",
  "roa",
  "netProfitMargin",
  "currentRatio",
  "debtToEquity",
  "peRatio",
];

export default function ComparePage() {
  const [a, setA] = useState<CompanyData>(emptyData);
  const [b, setB] = useState<CompanyData>(emptyData);
  const [compared, setCompared] = useState(false);

  const resultsA = compared ? calcAll(a) : [];
  const resultsB = compared ? calcAll(b) : [];

  const chartData = compared
    ? CHART_RATIOS.map((id) => {
        const ra = resultsA.find((r) => r.id === id);
        const rb = resultsB.find((r) => r.id === id);
        const ratio = RATIOS.find((r) => r.id === id);
        return {
          name:
            ratio?.name
              .replace("Return on ", "RO")
              .replace(" Ratio", "")
              .replace("Price-to-", "P/")
              .replace("Earnings", "E")
              .replace("Book", "B")
              .replace("Debt-to-Equity", "D/E")
              .replace("Net Profit Margin", "Net Margin") || id,
          [a.companyName || "Company A"]: Number.isFinite(
            ra?.value || Number.NaN,
          )
            ? Number((ra?.value || 0).toFixed(2))
            : 0,
          [b.companyName || "Company B"]: Number.isFinite(
            rb?.value || Number.NaN,
          )
            ? Number((rb?.value || 0).toFixed(2))
            : 0,
        };
      })
    : [];

  const isABetter = (idxA: number, idxB: number, higherIsBetter: boolean) => {
    const va = resultsA[idxA]?.value;
    const vb = resultsB[idxB]?.value;
    if (!Number.isFinite(va) || !Number.isFinite(vb)) return null;
    if (higherIsBetter) return va > vb ? "a" : va < vb ? "b" : "tie";
    return va < vb ? "a" : va > vb ? "b" : "tie";
  };

  function CompanyForm({
    data,
    setData,
    label,
  }: { data: CompanyData; setData: (d: CompanyData) => void; label: string }) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">{label}</h3>
        <div className="space-y-2">
          {fields.map((f) => (
            <div key={f.key}>
              <label
                htmlFor={`compare-${f.key}`}
                className="block text-xs text-slate-400 mb-0.5"
              >
                {f.label}
              </label>
              <input
                id={`compare-${f.key}`}
                type={f.key === "companyName" ? "text" : "number"}
                placeholder={f.key === "companyName" ? "Company name..." : "0"}
                value={data[f.key]}
                onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Compare Companies
        </h1>
        <p className="text-slate-400">
          Enter financials for two companies to see a side-by-side ratio
          comparison.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <CompanyForm data={a} setData={setA} label="Company A" />
        <CompanyForm data={b} setData={setB} label="Company B" />
      </div>

      <button
        type="button"
        onClick={() => setCompared(true)}
        className="flex items-center gap-2 px-8 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-xl transition-all mb-8"
      >
        <GitCompare className="w-4 h-4" /> Compare Now
      </button>

      {compared && (
        <div className="space-y-6">
          {/* Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">
              Key Ratios Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
                <Legend wrapperStyle={{ color: "#94a3b8" }} />
                <Bar
                  dataKey={a.companyName || "Company A"}
                  fill="#14b8a6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey={b.companyName || "Company B"}
                  fill="#818cf8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 gap-4 px-6 py-3 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <div>Ratio</div>
              <div className="text-center text-teal-400">
                {a.companyName || "Company A"}
              </div>
              <div className="text-center text-indigo-400">
                {b.companyName || "Company B"}
              </div>
              <div className="text-center">Winner</div>
            </div>
            {resultsA.map((ra, i) => {
              const rb = resultsB[i];
              const winner = isABetter(i, i, ra.higherIsBetter);
              return (
                <div
                  key={ra.id}
                  className="grid grid-cols-4 gap-4 px-6 py-3 border-b border-slate-800/50 items-center"
                >
                  <div className="text-slate-300 text-sm">{ra.name}</div>
                  <div
                    className={`text-center text-sm font-medium ${
                      winner === "a"
                        ? "text-green-400"
                        : winner === "tie"
                          ? "text-slate-400"
                          : "text-slate-400"
                    }`}
                  >
                    {fmt(ra.value, ra.format)}
                    {winner === "a" && (
                      <ChevronUp className="inline w-3.5 h-3.5 ml-1 text-green-400" />
                    )}
                  </div>
                  <div
                    className={`text-center text-sm font-medium ${
                      winner === "b"
                        ? "text-green-400"
                        : winner === "tie"
                          ? "text-slate-400"
                          : "text-slate-400"
                    }`}
                  >
                    {fmt(rb.value, rb.format)}
                    {winner === "b" && (
                      <ChevronUp className="inline w-3.5 h-3.5 ml-1 text-green-400" />
                    )}
                  </div>
                  <div className="text-center">
                    {winner === "tie" ? (
                      <Minus className="w-4 h-4 text-slate-600 mx-auto" />
                    ) : winner === "a" ? (
                      <span className="text-xs bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded font-semibold">
                        {a.companyName || "A"}
                      </span>
                    ) : (
                      <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-semibold">
                        {b.companyName || "B"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
