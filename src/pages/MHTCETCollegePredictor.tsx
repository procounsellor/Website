import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  predictMHTCETColleges,
  type MHTCETCollegePredictionResponse,
} from "@/api/mhtcet";
import {
  Loader2,
  GraduationCap,
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/AuthStore";
import PageSEO from "@/components/SEO/PageSEO";

type PredictionMode = "marks" | "percentile" | "rank";

const BRANCH_OPTIONS = [
  "Computer Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Electronics and Telecommunication",
  "Information Technology",
  "Chemical Engineering",
  "Instrumentation Engineering",
  "Other",
];

export default function MHTCETCollegePredictor() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<PredictionMode>("marks");
  const [marks, setMarks] = useState<string>("");
  const [percentile, setPercentile] = useState<string>("");
  const [rank, setRank] = useState<string>("");
  const [category, setCategory] = useState<string>("Open");
  const [branch, setBranch] = useState<string>("Computer Engineering");
  const [topN, setTopN] = useState<number>(15);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] =
    useState<MHTCETCollegePredictionResponse | null>(null);
  const { isAuthenticated, toggleLogin } = useAuthStore();

  const [sortBy, setSortBy] = useState<string>("Ascending");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const collegesPerPage = 10;
  const [expandedBranches, setExpandedBranches] = useState<Set<number>>(
    new Set()
  );

  // High-traffic robustness: ignore stale responses + skip redundant refetches
  const requestIdRef = useRef(0);
  const lastSigRef = useRef<string | null>(null);

  const buildSignature = () =>
    JSON.stringify({ mode, marks, percentile, rank, category, branch, topN });

  const validateInput = (): { valid: boolean; message?: string } => {
    if (mode === "marks") {
      if (!marks) return { valid: false, message: "Please enter your MHT-CET marks" };
      const v = parseFloat(marks);
      if (isNaN(v) || v < 0)
        return { valid: false, message: "Please enter a valid marks value" };
    } else if (mode === "percentile") {
      if (!percentile)
        return { valid: false, message: "Please enter your MHT-CET percentile" };
      const v = parseFloat(percentile);
      if (isNaN(v) || v < 0 || v > 100)
        return { valid: false, message: "Please enter a valid percentile (0-100)" };
    } else {
      if (!rank) return { valid: false, message: "Please enter your rank" };
      const v = parseInt(rank, 10);
      if (isNaN(v) || v < 1)
        return { valid: false, message: "Please enter a valid rank" };
    }
    return { valid: true };
  };

  // Single source of truth for fetching. Used by both the submit button and the
  // in-place refetch when category/branch/topN change. `silent` = background
  // refetch (no success toast, skip if params are unchanged).
  const runPrediction = async ({ silent = false }: { silent?: boolean } = {}) => {
    const check = validateInput();
    if (!check.valid) {
      if (!silent && check.message) toast.error(check.message);
      return;
    }

    const signature = buildSignature();
    if (silent && signature === lastSigRef.current) return;

    const payload: Parameters<typeof predictMHTCETColleges>[0] = {
      category,
      branch,
      top_n: topN,
    };
    if (mode === "marks") payload.marks = parseFloat(marks);
    else if (mode === "percentile") payload.percentile = parseFloat(percentile);
    else payload.rank = parseInt(rank, 10);

    const reqId = ++requestIdRef.current;
    setIsLoading(true);
    try {
      const response = await predictMHTCETColleges(payload);
      if (reqId !== requestIdRef.current) return; // superseded by a newer request
      setPrediction(response);
      lastSigRef.current = signature;
      setCurrentPage(1);
      if (!silent) toast.success("Colleges predicted successfully!");
    } catch (error) {
      if (reqId !== requestIdRef.current) return;
      const msg =
        error instanceof Error ? error.message : "Failed to predict colleges";
      toast.error(msg);
      // Keep any existing results on screen instead of bouncing back to the form.
    } finally {
      if (reqId === requestIdRef.current) setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runPrediction();
  };

  const formatRank = (r: number | null | undefined) =>
    r == null ? "N/A" : r.toLocaleString("en-IN");
  const formatPercentile = (p: number | null | undefined) =>
    p == null ? "N/A" : p.toFixed(2);

  const getChanceText = (chance: string) => {
    const l = chance.toLowerCase();
    if (l.includes("high") || l.includes("very high")) return "HIGH CHANCE";
    if (l.includes("moderate") || l.includes("medium")) return "MEDIUM CHANCE";
    if (l.includes("low")) return "LOW CHANCE";
    return chance.toUpperCase();
  };

  const getChanceBadgeStyle = (chance: string) => {
    const l = chance.toLowerCase();
    if (l.includes("high") || l.includes("very high"))
      return "bg-green-100 text-green-700";
    if (l.includes("moderate") || l.includes("medium"))
      return "bg-amber-100 text-amber-700";
    if (l.includes("low")) return "bg-gray-100 text-gray-600";
    return "bg-gray-100 text-gray-600";
  };

  const toggleBranches = (index: number) => {
    setExpandedBranches((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const filteredAndSortedColleges = useMemo(() => {
    if (!prediction?.colleges) return [];
    const list = [...prediction.colleges];
    list.sort((a, b) =>
      sortBy === "Ascending"
        ? a.best_closing_rank - b.best_closing_rank
        : b.best_closing_rank - a.best_closing_rank
    );
    return list;
  }, [prediction?.colleges, sortBy]);

  const totalPages = Math.ceil(
    filteredAndSortedColleges.length / collegesPerPage
  );
  const startIndex = (currentPage - 1) * collegesPerPage;
  const paginatedColleges = filteredAndSortedColleges.slice(
    startIndex,
    startIndex + collegesPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  // Free preview: how many real colleges a logged-out visitor can see.
  const FREE_PREVIEW_COUNT = 2;
  const displayColleges = isAuthenticated
    ? paginatedColleges
    : filteredAndSortedColleges.slice(0, FREE_PREVIEW_COUNT);
  const displayOffset = isAuthenticated ? startIndex : 0;
  const lockedCount = isAuthenticated
    ? 0
    : Math.max(0, filteredAndSortedColleges.length - FREE_PREVIEW_COUNT);

  // When category / branch / top-N change while results are on screen, refetch
  // in place (debounced) instead of throwing the user back to the start form.
  useEffect(() => {
    if (!prediction) return;
    const t = setTimeout(() => {
      runPrediction({ silent: true });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, branch, topN]);

  const inputLabel =
    mode === "marks"
      ? "Enter Your MHT-CET Marks"
      : mode === "percentile"
        ? "Enter Your MHT-CET Percentile"
        : "Enter Your Rank";

  const inputValue = mode === "marks" ? marks : mode === "percentile" ? percentile : rank;
  const setInputValue =
    mode === "marks"
      ? setMarks
      : mode === "percentile"
        ? setPercentile
        : setRank;

  return (
    <>
      <PageSEO
        title="MHT-CET College Predictor 2025 – Maharashtra Engineering Colleges"
        description="Predict your MHT-CET college admission chances based on your rank, category, and preferences. Find engineering colleges in Maharashtra with ProCounsel's free predictor tool."
        canonical="/mhtcet-college-predictor"
        keywords="MHT-CET college predictor, Maharashtra engineering colleges, MHT CET rank predictor, CAP round Maharashtra, engineering admission Maharashtra"
      />
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="sm:hidden w-full bg-white border-b border-[#E3E8F4]">
        <div className="flex items-center gap-2 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-(--text-main) cursor-pointer text-[16px] font-semibold"
            aria-label="Go back"
          >
            {"<"}
          </button>
          <span className="text-[16px] font-semibold text-(--text-main) truncate">
            MHT-CET College Predictor
          </span>
        </div>
      </div>

      <div className="hidden sm:block w-full border-b border-[#E3E8F4] bg-white">
        <div className="max-w-[1440px] mx-auto px-5 md:px-[60px] pt-3 pb-3 text-[0.875rem] text-(--text-muted) font-medium">
          <Link to="/" className="hover:underline cursor-pointer">Home</Link>
          <span className="mx-1">{">"}</span>
          <span className="text-(--text-main)">MHT-CET College Predictor</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-[60px] py-6 sm:py-8">

        {prediction ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-xl border border-[#2F43F2]/10 shadow-lg p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <GraduationCap className="h-5 w-5 text-[#2F43F2]" />
                  <h2 className="text-lg font-bold text-gray-800">
                    Enter Details
                  </h2>
                </div>
                <div className="flex gap-4 mb-6 border-b border-gray-200">
                  {(
                    [
                      ["marks", "Marks Basis"],
                      ["percentile", "Percentile Basis"],
                      ["rank", "Rank Basis"],
                    ] as const
                  ).map(([m, label]) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMode(m);
                        setPercentile("");
                        setMarks("");
                        setRank("");
                        setPrediction(null);
                      }}
                      className={`pb-3 px-1 text-sm font-medium transition-colors cursor-pointer ${
                        mode === m
                          ? "text-[#2F43F2] border-b-2 border-[#2F43F2]"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {inputLabel}
                    </label>
                    <input
                      type="number"
                      step={mode === "rank" ? "1" : mode === "marks" ? "1" : "0.01"}
                      min={mode === "percentile" ? 0 : mode === "rank" ? 1 : 0}
                      max={mode === "percentile" ? 100 : undefined}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        mode === "marks"
                          ? "e.g. 150"
                          : mode === "percentile"
                            ? "e.g. 99.5"
                            : "e.g. 5000"
                      }
                      className="w-full h-12 px-4 bg-white border border-[#13097D66] rounded-xl text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#2F43F2] focus:ring-2 focus:ring-blue-100 transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-full h-12 border border-[#13097D66] rounded-xl text-base text-gray-800 bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#2F43F2] cursor-pointer">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="OBC">OBC</SelectItem>
                        <SelectItem value="SC">SC</SelectItem>
                        <SelectItem value="ST">ST</SelectItem>
                        <SelectItem value="EWS">EWS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch
                    </label>
                    <Select value={branch} onValueChange={setBranch}>
                      <SelectTrigger className="w-full h-12 border border-[#13097D66] rounded-xl text-base text-gray-800 bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#2F43F2] cursor-pointer">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {BRANCH_OPTIONS.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of colleges (top N)
                    </label>
                    <Select
                      value={String(topN)}
                      onValueChange={(v) => setTopN(Number(v))}
                    >
                      <SelectTrigger className="w-full h-12 border border-[#13097D66] rounded-xl text-base text-gray-800 bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#2F43F2] cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 15, 20, 25].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 mt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-[#2F43F2] hover:bg-[#2F43F2]/90 text-white text-base font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Predicting...
                        </>
                      ) : (
                        <>
                          Predict Colleges
                          <GraduationCap className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </aside>

            <section className="lg:col-span-8 space-y-6 relative">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">
                      Predicted Colleges
                    </h1>
                    <p className="text-sm text-gray-500">
                      Based on MHT-CET counseling data
                    </p>
                  </div>
                  {isLoading && prediction && (
                    <span className="inline-flex items-center gap-2 text-xs font-medium text-[#2F43F2]">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating results…
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg border border-[#2F43F2]/5">
                  <span className="text-xs font-medium text-gray-700">
                    Sort by Rank:
                  </span>
                  <Select
                    value={sortBy}
                    onValueChange={(v) => {
                      setSortBy(v);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="bg-transparent border-none text-xs font-bold text-[#2F43F2] cursor-pointer outline-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ascending">Ascending</SelectItem>
                      <SelectItem value="Descending">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {displayColleges.length === 0 && isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden p-5 flex flex-col md:flex-row gap-4 animate-pulse"
                      >
                        <div className="shrink-0 w-16 h-16 bg-gray-200 rounded-lg" />
                        <div className="grow space-y-3 flex-1">
                          <div className="h-6 bg-gray-200 rounded w-3/4" />
                          <div className="h-4 bg-gray-200 rounded w-1/2" />
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-full" />
                                <div className="h-4 bg-gray-200 rounded w-full" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : displayColleges.length > 0 ? (
                  <div
                    className={`space-y-4 ${isLoading ? "opacity-50 pointer-events-none transition-opacity" : ""}`}
                  >
                    {displayColleges.map((college, index) => {
                      const actualIndex = displayOffset + index;
                      const isExpanded = expandedBranches.has(actualIndex);
                      const hasMultipleBranches =
                        college.branches && college.branches.length > 1;

                      return (
                        <div
                          key={actualIndex}
                          className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="p-5 flex flex-col md:flex-row gap-4">
                            <div className="shrink-0">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Building2 className="h-8 w-8 text-gray-400" />
                              </div>
                            </div>
                            <div className="grow">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-lg font-bold text-gray-800">
                                  {college.college}
                                </h3>
                                <span
                                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${getChanceBadgeStyle(college.chance)}`}
                                >
                                  {getChanceText(college.chance)}
                                </span>
                              </div>

                              {college.branches && college.branches.length > 0 && (
                                <div className="mb-3">
                                  <p className="text-sm font-medium text-gray-600">
                                    {college.branches.length}{" "}
                                    {college.branches.length === 1
                                      ? "Branch"
                                      : "Branches"}
                                  </p>
                                  {hasMultipleBranches && (
                                    <button
                                      type="button"
                                      onClick={() => toggleBranches(actualIndex)}
                                      className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#2F43F2] hover:text-[#2F43F2]/80 transition-colors cursor-pointer"
                                    >
                                      {isExpanded ? (
                                        <>
                                          <ChevronUp className="h-3 w-3" />
                                          Hide Branches
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown className="h-3 w-3" />
                                          View All Branches
                                        </>
                                      )}
                                    </button>
                                  )}
                                  {isExpanded && hasMultipleBranches && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
                                      {college.branches.map((b, idx) => (
                                        <div
                                          key={idx}
                                          className="text-sm text-gray-700"
                                        >
                                          {b}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                <div>
                                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                                    Category
                                  </p>
                                  <p className="text-xs font-semibold text-gray-900">
                                    {category}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                                    Best Closing Rank
                                  </p>
                                  <p className="text-xs font-bold text-[#2F43F2]">
                                    {formatRank(college.best_closing_rank)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                                    Best Closing %
                                  </p>
                                  <p className="text-xs font-semibold text-gray-900">
                                    {formatPercentile(college.best_closing_percentile)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                                    Branch
                                  </p>
                                  <p className="text-xs font-semibold text-gray-900">
                                    {branch}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No colleges found matching your criteria.
                  </div>
                )}

                {isAuthenticated && totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={currentPage === 1}
                      className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 hover:bg-[#2F43F2]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) pageNum = i + 1;
                      else if (currentPage <= 3) pageNum = i + 1;
                      else if (currentPage >= totalPages - 2)
                        pageNum = totalPages - 4 + i;
                      else pageNum = currentPage - 2 + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center rounded text-sm font-medium transition-colors cursor-pointer ${
                            currentPage === pageNum
                              ? "bg-[#2F43F2] text-white"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-[#2F43F2]/5"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    {totalPages > 5 && (
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`w-10 h-10 flex items-center justify-center rounded text-sm font-medium transition-colors cursor-pointer ${
                          currentPage === totalPages
                            ? "bg-[#2F43F2] text-white"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-[#2F43F2]/5"
                        }`}
                      >
                        {totalPages}
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 hover:bg-[#2F43F2]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              {!isAuthenticated && prediction && displayColleges.length > 0 && (
                <div className="rounded-xl p-6 sm:p-8 text-center text-white shadow-lg bg-gradient-to-br from-[#2F43F2] to-[#4B5DF5]">
                  <Lock className="h-12 w-12 mx-auto mb-3 opacity-90" />
                  <h4 className="text-xl font-bold mb-2">
                    {lockedCount > 0
                      ? `Login to unlock ${lockedCount} more ${lockedCount === 1 ? "college" : "colleges"}`
                      : "Login to view your full personalized results"}
                  </h4>
                  <p className="text-sm text-white/85 mb-5 max-w-md mx-auto">
                    You're seeing a free preview. Login to see all matching
                    colleges, branch-wise cutoffs, and save your prediction.
                  </p>
                  <Button
                    onClick={() => toggleLogin()}
                    className="bg-white text-[#2F43F2] hover:bg-white/90 px-8 py-2 rounded-xl font-semibold cursor-pointer"
                  >
                    Login to See All Colleges
                  </Button>
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-10">
              <div className="bg-[#2F43F2] text-white rounded-lg p-4 mb-6 flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                <h2 className="font-semibold text-lg">Enter Details</h2>
              </div>

              <div className="flex gap-4 mb-6 border-b border-gray-200">
                {(
                  [
                    ["marks", "Marks Basis"],
                    ["percentile", "Percentile Basis"],
                    ["rank", "Rank Basis"],
                  ] as const
                ).map(([m, label]) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMode(m);
                      setPercentile("");
                      setMarks("");
                      setRank("");
                    }}
                    className={`pb-3 px-1 text-base sm:text-lg font-medium transition-colors cursor-pointer ${
                      mode === m
                        ? "text-[#2F43F2] border-b-2 border-[#2F43F2]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {inputLabel}
                  </label>
                  <input
                    type="number"
                    step={mode === "rank" ? "1" : mode === "marks" ? "1" : "0.01"}
                    min={mode === "percentile" ? 0 : mode === "rank" ? 1 : 0}
                    max={mode === "percentile" ? 100 : undefined}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      mode === "marks"
                        ? "e.g. 150"
                        : mode === "percentile"
                          ? "e.g. 99.5"
                          : "e.g. 5000"
                    }
                    className="w-full h-12 px-4 bg-white border border-[#13097D66] rounded-xl text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#2F43F2] focus:ring-2 focus:ring-blue-100 transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full h-12 border border-[#13097D66] rounded-xl text-base text-gray-800 bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#2F43F2] cursor-pointer">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="OBC">OBC</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                      <SelectItem value="ST">ST</SelectItem>
                      <SelectItem value="EWS">EWS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch
                  </label>
                  <Select value={branch} onValueChange={setBranch}>
                    <SelectTrigger className="w-full h-12 border border-[#13097D66] rounded-xl text-base text-gray-800 bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#2F43F2] cursor-pointer">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANCH_OPTIONS.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of colleges (top N)
                  </label>
                  <Select
                    value={String(topN)}
                    onValueChange={(v) => setTopN(Number(v))}
                  >
                    <SelectTrigger className="w-full h-12 border border-[#13097D66] rounded-xl text-base text-gray-800 bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#2F43F2] cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 15, 20, 25].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 mt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-[#2F43F2] hover:bg-[#2F43F2]/90 text-white text-base font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Predicting...
                      </>
                    ) : (
                      <>
                        Predict Colleges
                        <GraduationCap className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <section className="mt-16 bg-white p-8 rounded-2xl border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            About MHT-CET College Predictor
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-600 leading-relaxed">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">
                How does it work?
              </h3>
              <p>
                Our MHT-CET College Predictor uses your marks, percentile, or
                rank along with your category and branch preference to suggest
                colleges you can get into. Predictions are based on historical
                MHT-CET counseling data for engineering admissions in
                Maharashtra.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Disclaimer</h3>
              <p>
                Predictions are based on previous year trends and are for
                informational purposes only. Actual seat allocation depends on
                cutoffs, seat availability, and choices of other candidates in
                the current counseling round.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
