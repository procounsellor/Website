import { X } from "lucide-react";

interface SubmitTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  testName: string;
  attemptedCount: number;
  unansweredCount: number;
  notVisitedCount: number;
  timeTaken: string;
  completionRate: number;
  sections: Array<{
    sectionName: string;
    attempted: number;
    total: number;
    unanswered: number;
  }>;
  timeRemaining: string;
}

export function SubmitTestModal({
  isOpen,
  onClose,
  onConfirm,
  testName,
  attemptedCount,
  unansweredCount,
  notVisitedCount,
  timeTaken,
  completionRate,
  sections,
  timeRemaining,
}: SubmitTestModalProps) {
  if (!isOpen) return null;

  const hasUnanswered = unansweredCount + notVisitedCount > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-(--text-app-primary)">
              Submit Test?
            </h2>
            <p className="text-sm text-(--text-muted) mt-1">
              Please review your test summary before submitting
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Test Name */}
          <h3 className="text-xl font-semibold text-center text-(--text-app-primary) mb-6">
            {testName}
          </h3>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
              <div className="h-12 w-12 rounded-full bg-[#21C55D] flex items-center justify-center mb-2">
                <span className="text-white font-semibold text-lg">
                  {attemptedCount}
                </span>
              </div>
              <p className="text-sm text-(--text-muted)">Attempted</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
              <div className="h-12 w-12 rounded-full bg-[#F69E23] flex items-center justify-center mb-2">
                <span className="text-white font-semibold text-lg">
                  {unansweredCount}
                </span>
              </div>
              <p className="text-sm text-(--text-muted)">Unanswered</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
              <div className="h-12 w-12 rounded-full bg-[#EAEDF0] flex items-center justify-center mb-2">
                <span className="text-(--text-muted) font-semibold text-lg">
                  {notVisitedCount}
                </span>
              </div>
              <p className="text-sm text-(--text-muted)">Not Visited</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
              <div className="h-12 w-12 rounded-full bg-[#9B7EF5] flex items-center justify-center mb-2">
                <span className="text-white font-semibold text-sm">
                  {timeTaken}
                </span>
              </div>
              <p className="text-sm text-(--text-muted)">Time Taken</p>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-(--text-muted)">
                Completion Rate
              </span>
              <span className="text-sm font-semibold text-(--text-app-primary)">
                {completionRate}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-700"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Section-wise Summary */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-(--text-app-primary) mb-4">
              Section-wise Summary
            </h4>
            <div className="space-y-3">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-purple-600" />
                    <span className="font-medium text-(--text-app-primary)">
                      {section.sectionName}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-(--text-app-primary)">
                      {section.attempted}/{section.total}
                    </span>
                    {section.unanswered > 0 && (
                      <span className="text-xs text-[#F69E23]">
                        {section.unanswered} Unanswered
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning Message */}
          {hasUnanswered && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-red-800 mb-1">
                    You have {unansweredCount + notVisitedCount} unanswered
                    questions
                  </h5>
                  <p className="text-sm text-red-700">
                    Time remaining: {timeRemaining}, you can go back and attempt
                    them
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-300 text-(--text-app-primary) font-medium hover:bg-gray-50"
            >
              Go Back To Test
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-6 rounded-xl bg-[#21C55D] text-white font-medium hover:bg-[#1ea851]"
            >
              Confirm Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
