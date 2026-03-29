import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import liveChatbotAnimation from "@/assets/animations/live-chatbot.json";

interface PcsatResultRow {
  rank: number;
  userId: string;
  fullName: string;
  marks: number;
  actualDurationTakenToCompleteTest: string;
  correctCount: number;
  wrongCount: number;
}

interface PcsatResultResponse {
  data: PcsatResultRow[];
  status: boolean;
}

const PCSATS_RESULTS_URL =
  "https://procounsellor-backend-1000407154647.asia-south1.run.app/api/shared/getTestSeriesResults?testSeriesId=DGf0cRpuUQw4ljtemUPC&testGroupId=de8eedeb-3db0-4280-b872-9563b7f88d7f";

const maskUserId = (value: string) => {
  const cleaned = value.trim();
  if (cleaned.length <= 6) return cleaned;
  return `${cleaned.slice(0, 3)}${"*".repeat(cleaned.length - 6)}${cleaned.slice(-3)}`;
};

export default function AllResultPage() {
  const [results, setResults] = useState<PcsatResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(PCSATS_RESULTS_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const payload: PcsatResultResponse = await response.json();
        if (!payload.status || !Array.isArray(payload.data)) {
          throw new Error("Invalid result payload");
        }

        const sorted = [...payload.data].sort((a, b) => a.rank - b.rank);
        setResults(sorted);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load results";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  const topThree = useMemo(() => results.slice(0, 3), [results]);
  const displayedResults = useMemo(() => results.slice(0, visibleCount), [results, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div className="pt-14 md:pt-24 w-full mx-auto max-w-7xl h-full min-h-screen flex flex-col items-center gap-4 px-3 pb-6">
      <div className="w-full max-w-[800px] lg:max-w-[1200px]">
        <div className="rounded-2xl bg-white border border-[#E4E8EC] overflow-hidden">
          <div className="px-4 md:px-6 py-5 border-b border-[#E4E8EC]">
            <h1 className="text-(--text-app-primary) font-semibold text-xl md:text-2xl">
              Grand Mock Test Results
            </h1>
            <p className="text-(--text-muted) text-sm md:text-base mt-1">
              Rank-wise results for Grand Mock Test.
            </p>
            <p className="text-sm md:text-base text-(--text-app-primary) font-semibold mt-2">
              Total Participants: {loading ? "..." : results.length}
            </p>
            <Link
              to="/gmt-result"
              className="inline-flex mt-3 px-4 py-2 rounded-lg bg-[#00C55E] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Check My Result
            </Link>
          </div>

          {!loading && !error && topThree.length > 0 && (
            <div className="px-4 md:px-6 py-4 border-b border-[#E4E8EC] bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {topThree.map((player, index) => (
                  <div
                    key={`${player.rank}-${player.userId}`}
                    className={`rounded-xl border p-3 ${
                      index === 0
                        ? "border-yellow-300 bg-yellow-50"
                        : index === 1
                        ? "border-slate-300 bg-slate-50"
                        : "border-orange-300 bg-orange-50"
                    }`}
                  >
                    <p className="text-xs font-semibold text-(--text-muted)">
                      {index === 0 ? "Winner" : index === 1 ? "Runner Up" : "Second Runner Up"}
                    </p>
                    <p className="text-base font-semibold text-(--text-app-primary) mt-1">{player.fullName || "Unknown User"}</p>
                    <p className="text-sm text-(--text-muted)">{maskUserId(player.userId)}</p>
                    <p className="text-sm text-(--text-muted)">Rank #{player.rank}</p>
                    <p className="text-xs text-(--text-muted)">Correct: {player.correctCount ?? 0} | Wrong: {player.wrongCount ?? 0}</p>
                    <p className="text-sm font-semibold text-(--text-app-primary)">{player.marks} marks</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="px-4 md:px-6 py-14 flex flex-col items-center justify-center">
              <Lottie animationData={liveChatbotAnimation} loop autoplay className="h-72 w-96" />
              <p className="text-(--text-muted) text-sm -mt-1">Loading Grand Mock Test results...</p>
            </div>
          )}

          {!loading && error && (
            <div className="px-4 md:px-6 py-5">
              <p className="text-red-600 font-medium">Could not load results.</p>
              <p className="text-sm text-(--text-muted) mt-1">{error}</p>
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <p className="px-4 md:px-6 py-5 text-(--text-muted)">No results available yet.</p>
          )}

          {!loading && !error && results.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px]">
                  <thead className="bg-[#F8F9FA] border-y border-[#E4E8EC]">
                    <tr>
                      <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-(--text-muted)">Rank</th>
                      <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-(--text-muted)">User ID</th>
                      <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-(--text-muted)">Name</th>
                      <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-(--text-muted)">Duration</th>
                      <th className="text-right px-4 md:px-6 py-3 text-xs font-medium text-(--text-muted)">Correct</th>
                      <th className="text-right px-4 md:px-6 py-3 text-xs font-medium text-(--text-muted)">Wrong</th>
                      <th className="text-right px-4 md:px-6 py-3 text-xs font-medium text-(--text-muted)">Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedResults.map((row) => (
                      <tr
                        key={`${row.rank}-${row.userId}`}
                        className="border-b border-[#E4E8EC] hover:bg-[#F8F9FA] transition-colors"
                      >
                        <td className="px-4 md:px-6 py-3 text-sm font-semibold text-(--text-app-primary)">
                          #{row.rank}
                        </td>
                        <td className="px-4 md:px-6 py-3 text-sm text-(--text-app-primary)">{maskUserId(row.userId)}</td>
                        <td className="px-4 md:px-6 py-3 text-sm text-(--text-app-primary)">{row.fullName || "Unknown User"}</td>
                        <td className="px-4 md:px-6 py-3 text-sm text-(--text-muted)">{row.actualDurationTakenToCompleteTest || "-"}</td>
                        <td className="px-4 md:px-6 py-3 text-sm text-right text-(--text-app-primary)">{row.correctCount ?? 0}</td>
                        <td className="px-4 md:px-6 py-3 text-sm text-right text-(--text-app-primary)">{row.wrongCount ?? 0}</td>
                        <td className="px-4 md:px-6 py-3 text-sm text-right font-semibold text-(--text-app-primary)">{row.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 md:px-6 py-2 border-t border-[#E4E8EC] flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={visibleCount >= results.length}
                  className="text-(--text-app-primary) text-sm hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {visibleCount >= results.length ? "All Results Loaded" : "Load More"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
