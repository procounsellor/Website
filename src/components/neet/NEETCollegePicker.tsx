import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import { getNEETColleges, type NEETCollege } from "@/api/neetCounselling";

/**
 * Searchable college selector for the "dream college" check.
 *
 * Backed by `GET /colleges?q=`, so the options are the same records the check
 * endpoint resolves against — picking from this list means `college_name` is
 * always an exact match and the student never gets "no imported college matched
 * this name" from a typo.
 *
 * Hand-rolled rather than pulled from a combobox library: the project has no
 * popover/command primitive, and this needs one input, one listbox and a
 * debounce. It implements the combobox keyboard contract (arrows, Enter, Escape)
 * so it is usable without a mouse.
 */

interface NEETCollegePickerProps {
  value: NEETCollege | null;
  onChange: (college: NEETCollege | null) => void;
  /** Narrows the options; usually the domicile the student picked. */
  state?: string | null;
  placeholder?: string;
  className?: string;
}

export default function NEETCollegePicker({
  value,
  onChange,
  state,
  placeholder = "Search a college…",
  className = "",
}: NEETCollegePickerProps) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(term.trim()), 300);
    return () => clearTimeout(t);
  }, [term]);

  // Close on any click outside — the listbox is absolutely positioned, so it
  // would otherwise stay open behind the rest of the form.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const { data, isFetching } = useQuery({
    queryKey: ["neet", "college-search", state ?? "all", debounced],
    queryFn: () =>
      getNEETColleges({
        state: state && state !== "All India" ? state : undefined,
        q: debounced || undefined,
        limit: 40,
      }),
    enabled: open,
    staleTime: 5 * 60 * 1000,
  });

  const options = useMemo(() => data?.items ?? [], [data]);

  useEffect(() => setActive(0), [debounced, state]);

  const choose = (college: NEETCollege) => {
    onChange(college);
    setOpen(false);
    setTerm("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (options[active]) choose(options[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {value ? (
        <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50/60 px-3">
          <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-slate-800">
            {value.name}
          </span>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Clear target college"
            className="shrink-0 cursor-pointer rounded-full p-1 text-slate-500 hover:bg-white hover:text-slate-800"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            value={term}
            placeholder={placeholder}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setTerm(e.target.value);
              setOpen(true);
            }}
            onKeyDown={onKeyDown}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-[14px] outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
        </div>
      )}

      {open && !value && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {isFetching && options.length === 0 ? (
            <li className="flex items-center gap-2 px-3 py-3 text-[13px] text-slate-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Searching…
            </li>
          ) : options.length === 0 ? (
            <li className="px-3 py-3 text-[13px] text-slate-500">
              No college matches “{debounced}”.
            </li>
          ) : (
            options.map((c, i) => (
              <li key={`${c.name}-${i}`} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(c)}
                  className={`flex w-full cursor-pointer items-start gap-2 px-3 py-2 text-left ${
                    i === active ? "bg-emerald-50" : ""
                  }`}
                >
                  <Check
                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                      value && (value as NEETCollege).name === c.name
                        ? "text-emerald-600"
                        : "invisible"
                    }`}
                    aria-hidden
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px] font-medium text-slate-800">
                      {c.name}
                    </span>
                    <span className="block truncate text-[11.5px] text-slate-500">
                      {[c.city, c.state, c.type].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
