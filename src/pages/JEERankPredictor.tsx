import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { predictJEERank, type JEERankPredictionResponse } from "@/api/jee";
import { Loader2, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/AuthStore";

export default function JEERankPredictor() {
  const [marks, setMarks] = useState<string>("");
  const [shiftLevel, setShiftLevel] = useState<string>("moderate");
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<JEERankPredictionResponse | null>(null);
  const { isAuthenticated, toggleLogin } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!marks) {
      toast.error("Please enter your JEE marks");
      return;
    }

    const marksValue = parseFloat(marks);
    if (isNaN(marksValue) || marksValue < 0) {
      toast.error("Please enter a valid marks value");
      return;
    }

    setIsLoading(true);
    setPrediction(null);

    try {
      // If user is not authenticated, use dummy data
      if (!isAuthenticated) {
        // Generate dummy prediction based on marks
        // Rough estimation: Higher marks = Higher percentile = Lower rank
        const basePercentile = Math.min(99.9, Math.max(50, 100 - (300 - marksValue) * 0.15));
        const percentileVariation = 2;
        const estimatedRank = Math.max(1, Math.floor(1000000 * (1 - basePercentile / 100)));
        const rankVariation = Math.floor(estimatedRank * 0.1);
        
        const dummyPrediction: JEERankPredictionResponse = {
          marks: marksValue,
          shift_level: shiftLevel,
          percentile_range: [
            Math.max(0, basePercentile - percentileVariation),
            Math.min(100, basePercentile + percentileVariation)
          ],
          estimated_rank: estimatedRank,
          rank_range: [
            Math.max(1, estimatedRank - rankVariation),
            estimatedRank + rankVariation
          ],
          confidence: "High"
        };
        setPrediction(dummyPrediction);
        toast.success("Prediction generated! Login to view detailed results.");
      } else {
        const response = await predictJEERank({
          marks: marksValue,
          shift_level: shiftLevel,
        });
        setPrediction(response);
        toast.success("Rank predicted successfully!");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to predict rank";
      toast.error(errorMessage);
      setPrediction(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRank = (rank: number | null) => {
    if (rank === null || rank === undefined) return "N/A";
    return rank.toLocaleString("en-IN");
  };

  const formatPercentile = (percentile: number | null) => {
    if (percentile === null || percentile === undefined) return "N/A";
    return percentile.toFixed(4);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-28 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            JEE Main Rank Predictor
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-3xl mx-auto">
            Get highly accurate rank estimates based on the latest NTA trends and historical data from over 10 lakh aspirants. Start your college journey with precision.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Marks Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your JEE Marks
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="e.g. 300"
                className="w-full h-12 px-4 bg-white border border-[#13097D66] rounded-xl text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#2F43F2] focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
            </div>

            {/* Shift Level Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shift Level
              </label>
              <Select value={shiftLevel} onValueChange={setShiftLevel}>
                <SelectTrigger className="w-full h-12 border border-[#13097D66] rounded-xl text-base text-gray-800 bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#2F43F2]">
                  <SelectValue placeholder="Select shift level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="difficult">Difficult</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="pt-4 mt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#2F43F2] hover:bg-[#2F43F2]/90 text-white text-base font-semibold rounded-xl transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  "Predict My Rank"
                )}
              </Button>
            </div>
          </form>

          {/* Prediction Result */}
          {prediction && (
            <div className="mt-8 relative">
              <div className={`p-6 bg-blue-50 rounded-lg border border-blue-200 ${!isAuthenticated ? 'blur-sm' : ''}`}>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Your Prediction Results
                </h3>
                <div className="space-y-4">
                  {/* Estimated Rank */}
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Estimated Rank</div>
                    <div className="text-3xl font-bold text-[#2F43F2]">
                      {formatRank(prediction.estimated_rank)}
                    </div>
                  </div>

                  {/* Rank Range */}
                  {prediction.rank_range && (prediction.rank_range[0] !== null || prediction.rank_range[1] !== null) && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Rank Range</div>
                      <div className="text-lg font-semibold text-gray-800">
                        {formatRank(prediction.rank_range[0])} - {formatRank(prediction.rank_range[1])}
                      </div>
                    </div>
                  )}

                  {/* Percentile Range */}
                  {prediction.percentile_range && (prediction.percentile_range[0] !== null || prediction.percentile_range[1] !== null) && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Percentile Range</div>
                      <div className="text-lg font-semibold text-gray-800">
                        {formatPercentile(prediction.percentile_range[0])} - {formatPercentile(prediction.percentile_range[1])}
                      </div>
                    </div>
                  )}

                  {/* Confidence */}
                  {prediction.confidence && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Confidence</div>
                      <div className="text-base font-medium text-gray-800 capitalize">
                        {prediction.confidence}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Login Overlay - Only show if not authenticated */}
              {!isAuthenticated && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-lg">
                  <Lock className="h-16 w-16 text-[#2F43F2] mb-4" />
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    Login to View Results
                  </h4>
                  <p className="text-sm text-gray-600 text-center mb-6 max-w-md px-4">
                    Please login to see your personalized rank prediction results and unlock all features.
                  </p>
                  <Button
                    onClick={() => toggleLogin()}
                    className="bg-[#2F43F2] hover:bg-[#2F43F2]/90 text-white px-8 py-2 rounded-xl font-semibold"
                  >
                    Login Now
                  </Button>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

