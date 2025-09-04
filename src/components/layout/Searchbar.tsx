import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

type SearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  debounceTime?: number;
  showBackdrop?: boolean;
  autoFocus?: boolean;
};

export function SearchBar({
  onSearch,
  placeholder = "Search Courses, Colleges, Counsellor...",
  className = "",
  debounceTime = 500,
  showBackdrop = false,
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [query, onSearch, debounceTime]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <>
      {isFocused && showBackdrop && (
        <div 
          className="fixed inset-0 bg-gray-400/20 backdrop-blur-sm z-40"
          onClick={() => {
            setIsFocused(false);
            inputRef.current?.blur();
          }}
        />
      )}
      
      <div
        className={`relative z-50 flex items-center w-full bg-white rounded-lg shadow-md border-[1.5px] border-[#DDDDD] px-4 gap-3 transition-all duration-300 ease-out ${
          isFocused 
            ? 'py-4 scale-105 shadow-2xl border-[#FF660F]/50' 
            : 'py-3 scale-100'
        } ${className}`}
      >
        <Search className="w-6 h-6 text-[#FF660F] flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 text-[#232323] text-md placeholder:text-muted-foreground focus:outline-none bg-transparent"
        />
      </div>
    </>
  );
}
