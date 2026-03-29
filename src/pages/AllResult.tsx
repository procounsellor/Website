import { useEffect, useMemo, useState } from "react";

interface PcsatResultRow {
  rank: number;
  userId: string;
  marks: number;
}

interface PcsatResultResponse {
  data: PcsatResultRow[];
  status: boolean;
}

const PCSATS_RESULTS_URL =
  "https://procounsellor-backend-1000407154647.asia-south1.run.app/api/shared/getTestSeriesResults?testSeriesId=DGf0cRpuUQw4ljtemUPC&testGroupId=de8eedeb-3db0-4280-b872-9563b7f88d7f";

export default function AllResultPage() {
  const [results, setResults] = useState<PcsatResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const topScorer = useMemo(() => {
    if (!results.length) return null;
    return results.reduce((best, current) => (current.marks > best.marks ? current : best), results[0]);
  }, [results]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6 mb-5">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">PCSAT Results</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">
          Live rank-wise scoreboard for the selected PCSAT test series.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
            <p className="text-xs text-gray-500">Total Participants</p>
            <p className="text-xl font-semibold text-gray-900">{results.length}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
            <p className="text-xs text-gray-500">Top Score</p>
            <p className="text-xl font-semibold text-gray-900">{topScorer ? topScorer.marks : "-"}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
            <p className="text-xs text-gray-500">Top Rank User</p>
            <p className="text-xl font-semibold text-gray-900">{results[0]?.userId || "-"}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
            <p className="text-xs text-gray-500">Updated</p>
            <p className="text-sm md:text-base font-semibold text-gray-900">{new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading && <p className="p-5 text-gray-600">Loading results...</p>}

        {!loading && error && (
          <div className="p-5">
            <p className="text-red-600 font-medium">Could not load results.</p>
            <p className="text-sm text-gray-600 mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && results.length === 0 && (
          <p className="p-5 text-gray-600">No results available yet.</p>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold tracking-wide text-gray-600">Rank</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold tracking-wide text-gray-600">User ID</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold tracking-wide text-gray-600">Marks</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row) => (
                  <tr key={`${row.rank}-${row.userId}`} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70">
                    <td className="px-4 py-3 font-semibold text-gray-900">#{row.rank}</td>
                    <td className="px-4 py-3 text-gray-700">{row.userId}</td>
                    <td className="px-4 py-3 text-right text-gray-900 font-semibold">{row.marks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
