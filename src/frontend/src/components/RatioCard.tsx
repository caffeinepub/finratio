import { ArrowRight, Bookmark, BookmarkCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useBookmarks } from "../contexts/BookmarkContext";
import type { Ratio } from "../ratios";
import { CATEGORIES } from "../ratios";

export default function RatioCard({ ratio }: { ratio: Ratio }) {
  const { isBookmarked, toggle } = useBookmarks();
  const cat = CATEGORIES.find((c) => c.name === ratio.category);
  const bookmarked = isBookmarked(ratio.id);

  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 hover:shadow-lg hover:shadow-slate-900/50 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cat?.bgColor} ${cat?.color} border ${cat?.borderColor}`}
        >
          {ratio.category}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle(ratio.id);
          }}
          className={`p-1.5 rounded-lg transition-all ${
            bookmarked
              ? "text-teal-400 bg-teal-500/10"
              : "text-slate-600 hover:text-teal-400 hover:bg-teal-500/10"
          }`}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
        >
          {bookmarked ? (
            <BookmarkCheck className="w-4 h-4" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>
      </div>
      <h3 className="text-slate-100 font-semibold mb-1.5 group-hover:text-teal-400 transition-colors">
        {ratio.name}
      </h3>
      <p className="text-slate-500 text-sm mb-4 line-clamp-2">
        {ratio.shortDescription}
      </p>
      <Link
        to={`/ratio/${ratio.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 font-medium transition-colors"
      >
        Learn More <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
