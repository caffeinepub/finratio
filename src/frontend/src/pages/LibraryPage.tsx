import { Bookmark, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import RatioCard from "../components/RatioCard";
import { useBookmarks } from "../contexts/BookmarkContext";
import { CATEGORIES, RATIOS, type RatioCategory } from "../ratios";

type Filter = "All" | RatioCategory | "Bookmarked";

export default function LibraryPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const { bookmarks } = useBookmarks();

  useEffect(() => {
    const cat = searchParams.get("category") as RatioCategory | null;
    if (cat && CATEGORIES.find((c) => c.name === cat)) setFilter(cat);
  }, [searchParams]);

  const filtered = RATIOS.filter((r) => {
    const matchesSearch =
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      (filter === "Bookmarked"
        ? bookmarks.includes(r.id)
        : r.category === filter);
    return matchesSearch && matchesFilter;
  });

  const tabs: Filter[] = [
    "All",
    ...CATEGORIES.map((c) => c.name as Filter),
    "Bookmarked",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Financial Ratio Library
        </h1>
        <p className="text-slate-400">
          Explore {RATIOS.length} essential ratios with formulas, examples, and
          calculators.
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search ratios by name, category, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === tab
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-100 hover:border-slate-700"
            }`}
          >
            {tab === "Bookmarked" && <Bookmark className="w-3.5 h-3.5" />}
            {tab}
            {tab !== "Bookmarked" && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${
                  filter === tab
                    ? "bg-teal-500/20 text-teal-400"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {tab === "All"
                  ? RATIOS.length
                  : RATIOS.filter((r) => r.category === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg">No ratios found.</p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setFilter("All");
            }}
            className="mt-3 text-teal-400 hover:text-teal-300 text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-slate-500 text-sm mb-4">
            {filtered.length} ratio{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((ratio) => (
              <RatioCard key={ratio.id} ratio={ratio} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
