import { useEffect, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { searchColleges, type CollegeSearchResult } from '@/api/user';

interface CollegeSearchFieldProps {
  value: string;
  onSelect: (collegeName: string) => void;
}

export default function CollegeSearchField({ value, onSelect }: CollegeSearchFieldProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<CollegeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setQuery(value), [value]);

  useEffect(() => {
    if (query.trim().length < 3 || query === value) {
      setResults([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const matches = await searchColleges(query);
        if (!controller.signal.aborted) setResults(matches);
      } catch {
        if (!controller.signal.aborted) setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 500);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, value]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C8CA1]" />
        <input
          aria-label="College"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            onSelect('');
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          placeholder="Search your college"
          className="h-12 w-full rounded-xl border border-[#EFEFEF] bg-white pl-10 pr-10 text-base text-[#718EBF] outline-none focus:border-[#2F43F2]"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#2F43F2]" />}
      </div>
      {open && (
        <div className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setQuery('Not admitted yet'); onSelect('Not admitted yet'); setOpen(false); }} className="w-full border-b border-[#F3F4F6] px-4 py-3 text-left text-sm font-semibold text-[#2F43F2] hover:bg-[#F8FAFF]">
            Not admitted yet
          </button>
          {query.trim().length < 3 ? (
            <p className="px-4 py-3 text-sm text-[#8C8CA1]">Type at least 3 characters to search.</p>
          ) : !loading && results.length === 0 ? (
            <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { onSelect(query.trim()); setOpen(false); }} className="w-full px-4 py-3 text-left text-sm text-[#2F43F2] hover:bg-[#F8FAFF]">
              Others — use “{query.trim()}” as the college name
            </button>
          ) : results.map((college) => (
            <button
              key={college.id}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setQuery(college.college_name);
                onSelect(college.college_name);
                setOpen(false);
              }}
              className="w-full border-b border-[#F3F4F6] px-4 py-3 text-left last:border-0 hover:bg-[#F8FAFF]"
            >
              <span className="block text-sm font-semibold text-[#0E1629]">{college.college_name}</span>
              <span className="block text-xs text-[#6B7280]">{[college.district, college.state].filter(Boolean).join(', ') || 'Location not available'}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
