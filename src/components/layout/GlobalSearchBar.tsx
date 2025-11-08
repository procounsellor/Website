import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useSearchStore } from "@/store/SearchStore";
import { SearchResults } from "./SearchResults";

type GlobalSearchBarProps = {
  placeholder?: string;
  className?: string;
  debounceTime?: number;
  showBackdrop?: boolean;
  autoFocus?: boolean;
  onClose?: () => void;
};

export function GlobalSearchBar({
  placeholder = "Search Courses, Colleges, Counsellor...",
  className = "",
  debounceTime = 500,
  showBackdrop = false,
  autoFocus = false,
  onClose,
}: GlobalSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { query, setQuery, performSearch, clearResults, setSearchOpen } = useSearchStore();

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        clearResults();
      }
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [query, performSearch, clearResults, debounceTime]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setShowResults(false);
        setSearchOpen(false);
      }
    };

    if (isFocused || showResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFocused, showResults, setSearchOpen]);

  const handleFocus = () => {
    setIsFocused(true);
    setShowResults(true);
    setSearchOpen(true);
  };

  const handleClose = () => {
    setIsFocused(false);
    setShowResults(false);
    setSearchOpen(false);
    setQuery("");
    inputRef.current?.blur();
    onClose?.();
  };

  const handleClearInput = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const handleResultClick = () => {
    setShowResults(false);
    setIsFocused(false);
    setSearchOpen(false);
  };

  return (
    <>
      {isFocused && showBackdrop && (
        <div 
          className="fixed inset-0 bg-gray-400/20 backdrop-blur-sm z-40"
          onClick={handleClose}
        />
      )}
      
      <div ref={containerRef} className="relative">
        <div
          className={`relative z-40 flex items-center w-full bg-white rounded-lg shadow-md border-[1.5px] border-[#DDDDD] px-4 gap-3 transition-all duration-300 ease-out ${
            isFocused 
              ? 'py-4 scale-105 shadow-2xl border-[#FF660F]/50' 
              : 'py-3 scale-100'
          } ${className}`}
        >
          <Search className="w-2.5 h-2.5 lg:h-6 lg:w-6 text-[#FF660F] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            placeholder={placeholder}
            className="flex-1 text-[#232323] text-md placeholder:text-black focus:outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={handleClearInput}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        
        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
            <SearchResults onResultClick={handleResultClick} />
          </div>
        )}
      </div>
    </>
  );
}
