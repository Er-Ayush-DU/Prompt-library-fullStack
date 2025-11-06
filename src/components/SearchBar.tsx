// components/SearchBar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Prompt {
  _id: string;
  title: string;
  description: string;
  previewUrl: string;
  category: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced Search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
        const res = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.prompts || []);
        setShowResults(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);                          

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-xl mx-6">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Search prompts..."
          className="w-full rounded-l-full px-5 py-2.5 bg-[#2a2940] text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setShowResults(false);
            }}
            className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-0 top-0 h-full bg-gradient-to-r from-pink-500 to-orange-400 rounded-r-full px-5 flex items-center justify-center hover:from-pink-600 hover:to-orange-500 transition"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search size={18} />
          )}
        </button>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1d1c2b] rounded-xl shadow-2xl border border-gray-700 z-50 overflow-hidden">
          {results.length === 0 ? (
            <p className="p-4 text-gray-400 text-center">No results found</p>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {results.map((prompt) => (
                <Link
                  key={prompt._id}
                  href={`/prompt/${prompt._id}`}
                  onClick={() => {
                    setShowResults(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-[#2a2940] transition"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={prompt.previewUrl}
                      alt={prompt.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{prompt.title}</h3>
                    <p className="text-xs text-gray-400 truncate">{prompt.description}</p>
                  </div>
                  <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded-full">
                    {prompt.category}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 