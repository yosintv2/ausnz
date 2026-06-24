import { useState, useCallback, useRef, useEffect } from "react";
import { Search, MapPin, X } from "lucide-react";
import type { SearchItem } from "../lib/data";

interface Props {
  placeholder?: string;
  size?: "sm" | "lg";
}

export default function SearchBox({ placeholder = "Search postcode or suburb…", size = "lg" }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const fuseRef = useRef<any>(null);
  const indexRef = useRef<SearchItem[]>([]);

  useEffect(() => {
    import("../lib/data").then(({ getSearchIndex }) => {
      indexRef.current = getSearchIndex();
    });
    import("fuse.js").then(({ default: Fuse }) => {
      if (indexRef.current.length > 0) {
        fuseRef.current = new Fuse(indexRef.current, {
          keys: ["postcode", "locality", "state"],
          threshold: 0.3,
        });
      }
    });
  }, []);

  const doSearch = useCallback((q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    if (!fuseRef.current && indexRef.current.length > 0) {
      import("fuse.js").then(({ default: Fuse }) => {
        fuseRef.current = new Fuse(indexRef.current, {
          keys: ["postcode", "locality", "state"],
          threshold: 0.3,
        });
        const r = fuseRef.current.search(q).slice(0, 8).map((x: any) => x.item);
        setResults(r);
        setLoading(false);
      });
    } else if (fuseRef.current) {
      const r = fuseRef.current.search(q).slice(0, 8).map((x: any) => x.item);
      setResults(r);
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
      setFocused(false);
    }
  };

  const selectResult = (item: SearchItem) => {
    if (item.country === "au") {
      window.location.href = `/au/suburb/${item.slug}`;
    } else {
      window.location.href = `/nz/locality/${item.slug}`;
    }
    setQuery("");
    setResults([]);
    setFocused(false);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className={`relative flex items-center bg-white rounded-xl shadow-lg border border-[#E2E6ED] focus-within:border-[#E8472A] focus-within:ring-2 focus-within:ring-[#E8472A]/20 transition-all ${size === "lg" ? "h-14 sm:h-16" : "h-10"}`}>
          <Search className={`flex-shrink-0 text-[#6B7280] ${size === "lg" ? "w-5 h-5 ml-4 sm:ml-5" : "w-4 h-4 ml-3"}`} />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); doSearch(e.target.value); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder={placeholder}
            className={`flex-1 bg-transparent border-none outline-none text-[#1A1A2E] placeholder:text-[#6B7280] ${size === "lg" ? "px-3 text-base sm:text-lg" : "px-2 text-sm"}`}
            autoComplete="off"
            aria-label="Search postcodes and suburbs"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); setResults([]); }}
              className="p-2 text-[#6B7280] hover:text-[#1A1A2E]" aria-label="Clear search">
              <X className="w-4 h-4" />
            </button>
          )}
          <button type="submit"
            className={`flex-shrink-0 bg-[#E8472A] hover:bg-[#d43d22] text-white font-semibold rounded-lg transition-colors ${size === "lg" ? "px-5 sm:px-7 py-2.5 sm:py-3 mr-1.5 text-sm sm:text-base" : "px-4 py-1.5 mr-1 text-sm"}`}>
            Search
          </button>
        </div>
      </form>

      {focused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-[#E2E6ED] z-50 overflow-hidden">
          {results.map((item, i) => (
            <button key={i} onMouseDown={() => selectResult(item)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F4F6F9] text-left transition-colors border-b border-[#E2E6ED] last:border-0">
              <MapPin className="w-4 h-4 text-[#E8472A] flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-medium text-[#1A1A2E] text-sm">{item.locality}</span>
                <span className="text-[#6B7280] text-xs ml-2">{item.postcode} · {item.state} · {item.country === "au" ? "🇦🇺 AU" : "🇳🇿 NZ"}</span>
              </div>
            </button>
          ))}
          <button onMouseDown={() => { window.location.href = `/search?q=${encodeURIComponent(query)}`; }}
            className="w-full flex items-center gap-2 px-4 py-3 text-[#E8472A] text-sm font-medium hover:bg-[#F4F6F9] transition-colors">
            <Search className="w-4 h-4" />
            See all results for &ldquo;{query}&rdquo;
          </button>
        </div>
      )}
    </div>
  );
}
