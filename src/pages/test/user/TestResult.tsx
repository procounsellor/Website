import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Trophy, CheckCircle2, XCircle, Circle } from "lucide-react";

interface ResultData {
  attemptId: string;
  score: number;
  totalQuestions: number;
  correct: number;
  wrong: number;
  unattempted: number;
  maxMarks: number;
  actualDurationTakenToCompleteTest: string;
}

export function TestResult() {
  const { testId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [resultData, setResultData] = useState<ResultData | null>(null);

  useEffect(() => {
    const data = location.state?.resultData;
    if (data) {
      setResultData(data);
    } else {
      // If no data in state, redirect back to test listing
      navigate("/t");
    }
  }, [location, navigate]);

  if (!resultData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading results...</p>
      </div>
    );
  }

  const percentage = ((resultData.score / resultData.maxMarks) * 100).toFixed(2);
  const isPass = parseFloat(percentage) >= 40; // Assuming 40% is passing

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/t")}
          className="flex items-center gap-2 text-(--text-app-primary) font-medium mb-6 hover:opacity-70"
        >
          <ArrowLeft size={20} />
          Back to Tests
        </button>

        {/* Result Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Top Section - Score Banner */}
          <div className={`${isPass ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-orange-500 to-red-500'} p-8 text-white text-center`}>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Trophy size={40} />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {isPass ? "Congratulations!" : "Test Completed"}
            </h1>
            <p className="text-lg opacity-90">
              {isPass ? "You have passed the test!" : "Keep practicing to improve!"}
            </p>
          </div>

          {/* Score Details */}
          <div className="p-8">
            {/* Main Score */}
            <div className="text-center mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="text-5xl font-bold text-(--text-app-primary)">
                  {resultData.score}
                </span>
                <span className="text-3xl text-(--text-muted)">/</span>
                <span className="text-3xl text-(--text-muted)">
                  {resultData.maxMarks}
                </span>
              </div>
              <p className="text-lg text-(--text-muted) mb-4">Your Score</p>
              <div className={`inline-block px-6 py-2 rounded-full ${isPass ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'} font-semibold text-lg`}>
                {percentage}%
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-green-50 rounded-xl p-6 text-center border border-green-200">
                <div className="flex justify-center mb-3">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <p className="text-3xl font-bold text-green-700 mb-1">
                  {resultData.correct}
                </p>
                <p className="text-sm text-green-600 font-medium">Correct</p>
              </div>

              <div className="bg-red-50 rounded-xl p-6 text-center border border-red-200">
                <div className="flex justify-center mb-3">
                  <XCircle size={32} className="text-red-600" />
                </div>
                <p className="text-3xl font-bold text-red-700 mb-1">
                  {resultData.wrong}
                </p>
                <p className="text-sm text-red-600 font-medium">Wrong</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                <div className="flex justify-center mb-3">
                  <Circle size={32} className="text-gray-600" />
                </div>
                <p className="text-3xl font-bold text-gray-700 mb-1">
                  {resultData.unattempted}
                </p>
                <p className="text-sm text-gray-600 font-medium">Unattempted</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-200">
                <div className="flex justify-center mb-3">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-blue-600">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="text-3xl font-bold text-blue-700 mb-1">
                  {resultData.totalQuestions}
                </p>
                <p className="text-sm text-blue-600 font-medium">Total Questions</p>
              </div>
            </div>

            {/* Time Taken */}
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-purple-600">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                      <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Time Taken</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {resultData.actualDurationTakenToCompleteTest}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/t")}
                className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-300 text-(--text-app-primary) font-medium hover:bg-gray-50 transition-colors"
              >
                Back to Tests
              </button>
              <button
                onClick={() => navigate(`/t/${testId}`)}
                className="flex-1 py-3 px-6 rounded-xl bg-(--btn-primary) text-white font-medium hover:opacity-90 transition-opacity"
              >
                Retake Test
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-(--text-muted)">
          <p>Attempt ID: {resultData.attemptId}</p>
        </div>
      </div>
    </div>
  );
}
