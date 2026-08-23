import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Lock, Search, Sparkles, Stethoscope } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageSEO from "@/components/SEO/PageSEO";
import IndiaStateMap from "@/components/neet/IndiaStateMap";
import NEETCollegeCard from "@/components/neet/NEETCollegeCard";
import NEETCollegePicker from "@/components/neet/NEETCollegePicker";
import OtherPredictors from "@/components/predictors/OtherPredictors";
import CounsellingCTA from "@/components/predictors/CounsellingCTA";
import { useAuthStore } from "@/store/AuthStore";
import { persistPredictorSearch } from "@/lib/predictorIntent";
import {
  getNEETColleges,
  getNEETStates,
  predictNEETColleges,
  checkTargetCollege,
  chanceToneClasses,
  formatRank,
  NEET_CATEGORIES,
  NEET_COLLEGE_TYPES,
  NEET_COUNSELLING_TYPES,
  NEET_GENDERS,
  NEET_TARGET_TYPES,
  type NEETCollege,
  type NEETCounsellingType,
  type NEETGender,
  type NEETTargetType,
} from "@/api/neetCounselling";

/**
 * NEET predictor — /neet-college-predictor
 *
 * Two tabs, gated differently:
 *
 *   1. "Colleges by state" is PUBLIC. Someone who just got their result should
 *      be able to browse a state's medical colleges without an account.
 *   2. The prediction RUNS for everyone, but the results render behind a lock
 *      for signed-out visitors. Refusing to compute until login loses people at
 *      the worst moment; computing first and locking the result means the
 *      answer is already sitting there when they sign in. The search is
 *      persisted before the gate (predictorIntent.ts), so the lead created at
 *      login carries what they were looking for, and nothing re-runs after —
 *      the mutation's data survives the auth change.
 *
 * All three endpoints go through React Query, so the state list and each
 * state's directory are cached and deduped instead of refetched per tab switch.
 *
 * Built on the v1 counselling API (src/api/neetCounselling.ts), replacing the
 * older rank/college/probability endpoints. The URL is unchanged on purpose —
 * it is indexed and has inbound links, so the page was rebuilt in place.
 */

const ACCENT = "#059669";
const RESULTS_PAGE_SIZE = 8;
const DEFAULT_STATE = "Maharashtra";
const SITE = "https://procounsel.co.in";
const SHELL_MAX = "max-w-[1400px]";
const SHELL = `mx-auto w-full ${SHELL_MAX} px-4 md:px-8`;

export default function NEETPredictor() {
  const { isAuthenticated, toggleLogin } = useAuthStore();
  const [tab, setTab] = useState<"colleges" | "predict">("colleges");

  /* ---------------- state directory (public) ---------------- */

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("All types");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data: states = [], isError: statesFailed } = useQuery({
    queryKey: ["neet", "states"],
    queryFn: getNEETStates,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (selectedState || !states.length) return;
    setSelectedState(states.includes(DEFAULT_STATE) ? DEFAULT_STATE : states[0]);
  }, [states, selectedState]);

  // Debounced so typing does not fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  const {
    data: directory,
    isFetching: directoryLoading,
    isError: directoryFailed,
  } = useQuery({
    queryKey: ["neet", "colleges", selectedState, typeFilter, debouncedQuery],
    queryFn: () =>
      getNEETColleges({
        state: selectedState ?? undefined,
        college_type: typeFilter === "All types" ? undefined : typeFilter,
        q: debouncedQuery || undefined,
        limit: 200,
      }),
    enabled: Boolean(selectedState),
    staleTime: 5 * 60 * 1000,
  });

  const colleges = directory?.items ?? [];

  const handleSelectState = useCallback((state: string) => {
    setSelectedState(state);
    setQuery("");
  }, []);

  // Only the selected state's count is known — the directory endpoint is
  // per-state, so counting all 34 up front would be 34 requests for a caption.
  const stateCounts = useMemo(
    () => (selectedState && directory ? { [selectedState]: directory.total } : {}),
    [selectedState, directory],
  );

  /* ---------------- prediction ---------------- */

  const [air, setAir] = useState("");
  const [score, setScore] = useState("");
  const [domicile, setDomicile] = useState("All India");
  const [category, setCategory] = useState<string>("General");
  const [gender, setGender] = useState<NEETGender>("Female");
  const [counselling, setCounselling] = useState<NEETCounsellingType>("State quota");
  const [targetType, setTargetType] = useState<NEETTargetType>("All types");
  const [budget, setBudget] = useState("");
  const [shownResults, setShownResults] = useState(RESULTS_PAGE_SIZE);

  const [target, setTarget] = useState<NEETCollege | null>(null);

  const predict = useMutation({ mutationFn: predictNEETColleges });
  const prediction = predict.data ?? null;

  // The dream-college check. Separate from the main prediction because it
  // answers a different question ("can I get into THIS one?") and a student
  // often wants only that.
  const targetCheck = useMutation({ mutationFn: checkTargetCollege });
  const targetResult = targetCheck.data ?? null;

  const domicileOptions = useMemo(() => ["All India", ...states], [states]);

  const runPrediction = () => {
    const airValue = air.trim() ? Number(air) : null;
    const scoreValue = score.trim() ? Number(score) : null;

    if (airValue === null && scoreValue === null) {
      toast.error("Enter your NEET AIR, or your score if you do not have the rank yet.");
      return;
    }
    if (airValue !== null && (!Number.isFinite(airValue) || airValue < 1)) {
      toast.error("Enter a valid All India Rank.");
      return;
    }
    if (
      scoreValue !== null &&
      (!Number.isFinite(scoreValue) || scoreValue < 1 || scoreValue > 720)
    ) {
      toast.error("NEET score must be between 1 and 720.");
      return;
    }

    // Persisted before anything else, so the lead created at login carries the
    // search whether they sign in now or after seeing the locked result.
    persistPredictorSearch({
      exam: "NEET",
      tool: "College Predictor",
      summary: [
        airValue !== null ? `AIR ${airValue}` : `${scoreValue}/720 marks`,
        category,
        domicile,
        counselling,
        targetType !== "All types" ? targetType : null,
        budget.trim() ? `budget ${budget.trim()}` : null,
      ]
        .filter(Boolean)
        .join(" · "),
    });

    setShownResults(RESULTS_PAGE_SIZE);

    if (target) {
      targetCheck.mutate({
        college_name: target.name,
        target_state: target.state || null,
        neet_air: airValue,
        neet_score: airValue === null ? scoreValue : null,
        domicile,
        category,
        gender,
        budget: budget.trim() || null,
        counselling,
        target_type: targetType,
      });
    } else {
      targetCheck.reset();
    }

    predict.mutate(
      {
        neet_air: airValue,
        neet_score: airValue === null ? scoreValue : null,
        domicile,
        category,
        gender,
        budget: budget.trim() || null,
        counselling,
        target_type: targetType,
        limit: 40,
      },
      {
        onSuccess: (res) => {
          if (!res.items.length) {
            toast("No colleges matched. Try a wider counselling type or target.", {
              icon: "🔍",
            });
          }
        },
      },
    );
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "ProCounsel NEET College Predictor",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: `${SITE}/neet-college-predictor`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Predictors", item: `${SITE}/predictors` },
        {
          "@type": "ListItem",
          position: 3,
          name: "NEET College Predictor",
          item: `${SITE}/neet-college-predictor`,
        },
      ],
    },
  ];

  return (
    <>
      <PageSEO
        title="NEET College Predictor 2026 — Medical Colleges by Rank & State | ProCounsel"
        description="Predict the MBBS colleges you can get with your NEET rank or score, and browse every medical college state by state with cutoffs, seats and fees."
        canonical="/neet-college-predictor"
        keywords="neet college predictor, neet rank predictor, mbbs college predictor, neet counselling, medical colleges by state, neet cutoff"
        jsonLd={jsonLd}
      />

      <main className="min-h-screen bg-[#F6F8FE] pb-16">
        {/* Hero */}
        <section className={`${SHELL} pt-8 md:pt-12`}>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
            <Stethoscope className="h-3.5 w-3.5" aria-hidden />
            NEET 2026
          </span>
          <h1 className="mt-4 max-w-3xl font-[Poppins] text-[26px] font-semibold leading-tight text-[#0E1629] md:text-[38px]">
            NEET College Predictor and Medical College Directory
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600 md:text-base">
            Browse medical colleges state by state for free, then use your NEET rank or score to
            see which of them you can realistically target — with round-wise closing ranks, seat
            counts and fees on every card.
          </p>
        </section>

        {/* Tabs — both tools named up front so neither sits below the fold. */}
        <div className={`${SHELL} mt-8`}>
          <div
            role="tablist"
            aria-label="NEET tools"
            className="inline-flex w-full gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-200 sm:w-auto"
          >
            {(
              [
                { id: "colleges", label: "Colleges by state" },
                { id: "predict", label: "Predict my colleges" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 cursor-pointer whitespace-nowrap rounded-xl px-4 py-2.5 text-[14px] font-semibold transition-colors sm:flex-none sm:px-6 ${
                  tab === t.id ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ---------------- Colleges by state (public) ---------------- */}
        {tab === "colleges" && (
          <section className={`${SHELL} mt-6`}>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
              <div>
                <h2 className="font-[Poppins] text-[20px] font-semibold text-[#0E1629] md:text-[26px]">
                  Explore colleges by state
                </h2>
                <p className="mt-1.5 max-w-2xl text-[14px] text-slate-600">
                  Click any state to open its medical college directory. No login needed.
                </p>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)] lg:items-stretch">
                <IndiaStateMap
                  availableStates={states}
                  selected={selectedState}
                  onSelect={handleSelectState}
                  counts={stateCounts}
                />

                <div className="min-w-0">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <Search
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        aria-hidden
                      />
                      <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={
                          selectedState ? `Search colleges in ${selectedState}` : "Search colleges"
                        }
                        aria-label="Search colleges in the selected state"
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className={`${selectClass} sm:w-[150px]`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {NEET_COLLEGE_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-5">
                    {directoryLoading ? (
                      <CollegeListSkeleton />
                    ) : statesFailed || directoryFailed ? (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-[14px] text-amber-900">
                        Could not load colleges right now. Please retry shortly.
                      </div>
                    ) : colleges.length === 0 ? (
                      <div className="flex min-h-[320px] items-center justify-center rounded-2xl bg-slate-50 p-8 text-center">
                        <div>
                          <p className="text-[14px] font-medium text-slate-700">
                            No colleges match this filter
                          </p>
                          <p className="mt-1 text-[13px] text-slate-500">
                            Try clearing the search or switching the college type back to all.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="max-h-[calc(100vh-320px)] min-h-[320px] overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/60 p-3 [scrollbar-width:thin]">
                        <div className="flex flex-col gap-3">
                          {colleges.map((c, i) => (
                            <NEETCollegeCard key={`${c.name}-${i}`} college={c} />
                          ))}
                        </div>
                        {colleges.length > 6 && (
                          <p className="pt-3 text-center text-[12px] text-slate-400">
                            {colleges.length} colleges · scroll for more
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ---------------- Predict: form card, then a separate results card ---- */}
        {tab === "predict" && (
          <>
            <section className={`${SHELL} mt-6`}>
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
                <h2 className="font-[Poppins] text-[20px] font-semibold text-[#0E1629] md:text-[26px]">
                  Predict your colleges
                </h2>
                <p className="mt-1.5 max-w-2xl text-[14px] text-slate-600">
                  Enter your rank if you have it — it is far more accurate than a score. Fields
                  marked <span aria-hidden>*</span> are required.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <Field label="NEET AIR *" hint="More accurate when available">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      value={air}
                      onChange={(e) => setAir(e.target.value)}
                      placeholder="e.g. 52339"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="NEET score" hint="Used only when AIR is blank">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={720}
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      placeholder="out of 720"
                      disabled={air.trim() !== ""}
                      className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
                    />
                  </Field>

                  <Field label="Domicile">
                    <Select value={domicile} onValueChange={setDomicile}>
                      <SelectTrigger className={selectClass}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {domicileOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Category">
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className={selectClass}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {NEET_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Gender" hint="Some seats are reserved by gender">
                    <Select value={gender} onValueChange={(v) => setGender(v as NEETGender)}>
                      <SelectTrigger className={selectClass}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {NEET_GENDERS.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Counselling">
                    <Select
                      value={counselling}
                      onValueChange={(v) => setCounselling(v as NEETCounsellingType)}
                    >
                      <SelectTrigger className={selectClass}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {NEET_COUNSELLING_TYPES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="College type">
                    <Select
                      value={targetType}
                      onValueChange={(v) => setTargetType(v as NEETTargetType)}
                    >
                      <SelectTrigger className={selectClass}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {NEET_TARGET_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Budget" hint="Total, e.g. 60L or 1 Cr">
                    <input
                      type="text"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="Optional"
                      className={inputClass}
                    />
                  </Field>

                  {/* Two columns wide — college names are long and a picker
                      squeezed into one column truncates every option. */}
                  <div className="sm:col-span-2">
                    <span className="mb-1.5 block text-[13px] font-medium text-slate-700">
                      Target college
                    </span>
                    <NEETCollegePicker
                      value={target}
                      onChange={setTarget}
                      state={domicile}
                      placeholder="Optional — pick a dream college to check reach"
                    />
                    <span className="mt-1 block text-[11.5px] text-slate-400">
                      Checked against your rank alongside the full list
                    </span>
                  </div>

                  {/* Sits in the grid right after Budget, aligned with the
                      inputs rather than the labels. */}
                  <div className="flex items-end">
                    <Button
                      onClick={runPrediction}
                      disabled={predict.isPending}
                      className="h-11 w-full cursor-pointer rounded-xl text-[15px] font-semibold text-white hover:opacity-95"
                      style={{ backgroundColor: ACCENT }}
                    >
                      {predict.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> Predicting…
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" aria-hidden /> Predict colleges
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section className={`${SHELL} mt-5`}>
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
                <h2 className="font-[Poppins] text-[18px] font-semibold text-[#0E1629] md:text-[22px]">
                  Matched colleges
                </h2>

                {/* Dream-college verdict. Shown above the list because it is
                    usually the question the student actually came with. */}
                {targetCheck.isPending ? (
                  <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-[13px] text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Checking {target?.name}…
                  </div>
                ) : targetResult ? (
                  targetResult.matched ? (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="block text-[11px] uppercase tracking-wide text-slate-400">
                            Target college
                          </span>
                          <span className="block text-[15px] font-semibold text-slate-900">
                            {targetResult.name}
                          </span>
                          <span className="block text-[12px] text-slate-500">
                            {[targetResult.city, targetResult.state, targetResult.type]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold ring-1 ${chanceToneClasses(
                            targetResult.tone ?? "",
                          )}`}
                        >
                          {targetResult.verdict}
                        </span>
                      </div>
                      <p className="mt-2 text-[13px] text-slate-700">{targetResult.message}</p>
                      {targetResult.closing_rank !== null && (
                        <p className="mt-1 text-[12px] text-slate-500">
                          Imported closing rank{" "}
                          <span className="font-semibold tabular-nums">
                            {formatRank(targetResult.closing_rank)}
                          </span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-900">
                      {targetResult.message}
                    </div>
                  )
                ) : null}

                {predict.isPending ? (
                  <div className="mt-5">
                    <CollegeListSkeleton rows={4} bare />
                  </div>
                ) : predict.isError ? (
                  <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-[14px] text-amber-900">
                    The predictor is not responding right now. Please try again in a moment.
                  </div>
                ) : !prediction && !targetResult && !targetCheck.isPending ? (
                  <p className="mt-3 flex items-center gap-2 text-[13px] text-slate-500">
                    <Stethoscope className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
                    Your matched colleges appear here once you enter a rank or score.
                  </p>
                ) : prediction ? (
                  <>
                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl bg-slate-50 px-4 py-3">
                      <Stat label={prediction.rank_label} value={formatRank(prediction.rank_used)} />
                      <Stat label="Matches" value={String(prediction.items.length)} />
                      <Stat label="Ranked pool" value={String(prediction.ranked_pool)} />
                      {prediction.excluded_by_budget > 0 && (
                        <Stat label="Over budget" value={String(prediction.excluded_by_budget)} />
                      )}
                    </div>

                    {prediction.category_warning && (
                      <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-[13px] text-amber-900 ring-1 ring-amber-100">
                        {prediction.category_warning}
                      </p>
                    )}

                    {prediction.items.length === 0 ? (
                      <div className="mt-5 rounded-2xl bg-slate-50 p-8 text-center">
                        <p className="text-[14px] font-medium text-slate-700">
                          No recommendation to show yet
                        </p>
                        <p className="mt-1 text-[13px] text-slate-500">
                          Try “All types” counselling, a different college type, or raise the
                          budget.
                        </p>
                      </div>
                    ) : (
                      <div className="relative mt-5">
                        {/* The result is already computed. Signed-out visitors
                            see its shape through the blur, which converts far
                            better than refusing to run it at all. */}
                        <div
                          className={
                            isAuthenticated ? "" : "pointer-events-none select-none blur-[6px]"
                          }
                          aria-hidden={!isAuthenticated}
                        >
                          <div className="grid gap-3 lg:grid-cols-2">
                            {prediction.items.slice(0, shownResults).map((c, i) => (
                              <NEETCollegeCard key={`${c.name}-${i}`} college={c} />
                            ))}
                          </div>

                          {shownResults < prediction.items.length && (
                            <div className="mt-4 text-center">
                              <button
                                type="button"
                                onClick={() => setShownResults((n) => n + RESULTS_PAGE_SIZE)}
                                className="cursor-pointer text-[13px] font-semibold text-emerald-700 underline underline-offset-4 hover:text-emerald-800"
                              >
                                See more ({prediction.items.length - shownResults} left)
                              </button>
                            </div>
                          )}
                        </div>

                        {!isAuthenticated && (
                          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-white/70 px-6 text-center backdrop-blur-[1px]">
                            <Lock className="h-10 w-10" style={{ color: ACCENT }} aria-hidden />
                            <p className="mt-3 text-[16px] font-semibold text-slate-800">
                              {prediction.items.length} colleges matched your rank
                            </p>
                            <p className="mt-1 max-w-sm text-[13px] text-slate-600">
                              Log in to see the list. Your result is ready — signing in reveals it
                              straight away, nothing is re-run.
                            </p>
                            <Button
                              onClick={() => toggleLogin()}
                              className="mt-4 cursor-pointer rounded-xl px-8 py-2.5 font-semibold text-white hover:opacity-95"
                              style={{ backgroundColor: ACCENT }}
                            >
                              Log in to view
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    <p className="mt-5 text-[12px] leading-relaxed text-slate-500">
                      Predictions are based on previous-year closing ranks compiled from public
                      sources and are indicative only. Actual allotment depends on the counselling
                      authority, seat matrix and the current year's candidate pool. Verify every
                      figure against the official source linked on each card before acting on it.
                    </p>
                  </>
                ) : null}
              </div>
            </section>
          </>
        )}

        {/* These bring their own container, so they are not wrapped in SHELL —
            they just need the same width cap as the cards above. */}
        <div className="mt-6">
          <CounsellingCTA accent={ACCENT} exam="NEET" containerClass={SHELL_MAX} />
        </div>
        <OtherPredictors
          currentPath="/neet-college-predictor"
          accent={ACCENT}
          containerClass={SHELL_MAX}
        />
      </main>
    </>
  );
}

/* ------------------------------------------------------------------ */

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-[14px] outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100";

const selectClass = "h-11 w-full cursor-pointer rounded-xl border-slate-200 text-[14px]";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11.5px] text-slate-400">{hint}</span>}
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-[11px] uppercase tracking-wide text-slate-400">{label}</span>
      <span className="block text-[16px] font-semibold tabular-nums text-slate-800">{value}</span>
    </div>
  );
}

/**
 * Placeholder rows in exactly the container the real list uses, so switching
 * state does not collapse the panel and snap it back open.
 */
function CollegeListSkeleton({ rows = 5, bare = false }: { rows?: number; bare?: boolean }) {
  return (
    <div
      className={
        bare
          ? ""
          : "max-h-[calc(100vh-320px)] min-h-[320px] overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/60 p-3"
      }
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading colleges…</span>
      <div className={bare ? "grid gap-3 lg:grid-cols-2" : "flex flex-col gap-3"}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-3"
            aria-hidden
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <Skeleton className="h-[15px] w-[70%] rounded" />
                <Skeleton className="mt-2 h-[11px] w-[35%] rounded" />
              </div>
              <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
            <Skeleton className="mt-3 h-[11px] w-[45%] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
