import { useState, useEffect } from "react";
import { Search } from "lucide-react";

type SearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  debounceTime?: number;
};

export function SearchBar({
  onSearch,
  placeholder = "Search Courses, Colleges, Counsellor...",
  className = "",
  debounceTime = 500,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [query, onSearch, debounceTime]);

  return (
    <div
      className={`flex items-center w-full   bg-white rounded-lg shadow-md border-[1.5px] border-[#DDDDD] px-4 py-3 gap-3${className}`}
    >
      <Search className="w-6 h-6 text-[#FF660F]" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 w-48 text-[#232323] text-md placeholder:text-muted-foreground items-center focus:outline-none bg-transparent"
      />
    </div>
  );
}
