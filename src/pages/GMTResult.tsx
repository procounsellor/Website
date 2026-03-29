import { useState } from "react";
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

export default function GMTResultPage() {
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userResult, setUserResult] = useState<PcsatResultRow | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setError("Please enter a Phone Number");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setUserResult(null);

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

      const found = payload.data.find((row) => row.userId === searchInput.trim());

      if (found) {
        setUserResult(found);
        setError(null);
      } else {
        setUserResult(null);
        setError("Phone Number not found in results.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch results";
      setError(message);
      setUserResult(null);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="pt-14 md:pt-24 w-full mx-auto max-w-7xl min-h-screen flex flex-col items-center gap-4 px-3 pb-6">
      <div className="w-full max-w-[800px] lg:max-w-[1200px]">
        <div className="rounded-2xl bg-white border border-[#E4E8EC] overflow-hidden">
          <div className="px-4 md:px-6 py-5 border-b border-[#E4E8EC]">
            <h1 className="text-(--text-app-primary) font-semibold text-xl md:text-2xl">
              My Grand Mock Test Result
            </h1>
            <p className="text-(--text-muted) text-sm md:text-base mt-1">
              Enter your Phone Number to check your Grand Mock Test rank and marks.
            </p>
          </div>

          <div className="px-4 md:px-6 py-6">
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Phone Number (e.g., 9876543210)"
                className="flex-1 px-4 py-2 border border-[#E4E8EC] rounded-lg text-sm placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2 bg-[#00C55E] text-white font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {loading && (
            <div className="px-4 md:px-6 py-8 flex flex-col items-center justify-center gap-3">
              <Lottie animationData={liveChatbotAnimation} loop autoplay className="h-64 w-96" />
              <p className="text-(--text-muted) text-sm -mt-1">Fetching your result...</p>
            </div>
          )}

          {!loading && searched && error && (
            <div className="px-4 md:px-6 py-8">
              <p className="text-red-600 font-medium">Not Found</p>
              <p className="text-sm text-(--text-muted) mt-1">{error}</p>
            </div>
          )}

          {!loading && searched && userResult && (
            <div className="px-4 md:px-6 py-8">
              <div className="rounded-2xl border border-[#E4E8EC] p-6 bg-[#F8F9FA]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg border border-[#E4E8EC] p-4 text-center">
                    <p className="text-xs text-(--text-muted) uppercase">Rank</p>
                    <p className="text-3xl font-bold text-(--text-app-primary) mt-2">
                      #{userResult.rank}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg border border-[#E4E8EC] p-4 text-center">
                    <p className="text-xs text-(--text-muted) uppercase">Phone Number</p>
                    <p className="text-lg font-semibold text-(--text-app-primary) mt-2">
                      {userResult.userId}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg border border-[#E4E8EC] p-4 text-center">
                    <p className="text-xs text-(--text-muted) uppercase">Full Name</p>
                    <p className="text-base font-semibold text-(--text-app-primary) mt-2 wrap-break-word">
                      {userResult.fullName || "Unknown User"}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg border border-[#E4E8EC] p-4 text-center">
                    <p className="text-xs text-(--text-muted) uppercase">Marks</p>
                    <p className="text-3xl font-bold text-(--text-app-primary) mt-2">
                      {userResult.marks}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg border border-[#E4E8EC] p-4 text-center">
                    <p className="text-xs text-(--text-muted) uppercase">Correct</p>
                    <p className="text-3xl font-bold text-(--text-app-primary) mt-2">
                      {userResult.correctCount ?? 0}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg border border-[#E4E8EC] p-4 text-center">
                    <p className="text-xs text-(--text-muted) uppercase">Wrong</p>
                    <p className="text-3xl font-bold text-(--text-app-primary) mt-2">
                      {userResult.wrongCount ?? 0}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg border border-[#E4E8EC] p-4 text-center md:col-span-2 lg:col-span-4">
                    <p className="text-xs text-(--text-muted) uppercase">Time Taken</p>
                    <p className="text-base font-semibold text-(--text-app-primary) mt-2">
                      {userResult.actualDurationTakenToCompleteTest || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !searched && (
            <div className="px-4 md:px-6 py-12 text-center">
              <p className="text-(--text-muted) text-base">
                Enter your details above to view your result.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
