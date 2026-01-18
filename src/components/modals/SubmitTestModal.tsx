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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex-none flex items-start justify-between p-6 pb-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Submit Test?
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Please review your test summary before submitting
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
          {/* Test Name */}
          <h3 className="text-lg font-semibold text-center text-gray-900 mb-6">
            {testName}
          </h3>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 md:mb-8">
            {/* Attempted */}
            <div className="border border-gray-100 shadow-sm rounded-2xl p-3 md:p-4 flex flex-col items-center justify-center text-center bg-white">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500 mb-1.5 md:mb-2"></div>
              <span className="text-xl md:text-2xl font-bold text-gray-900 mb-0.5 md:mb-1 leading-none">
                {attemptedCount}
              </span>
              <p className="text-[10px] md:text-xs text-gray-500 font-medium">Attempted</p>
            </div>

            {/* Unanswered */}
            <div className="border border-gray-100 shadow-sm rounded-2xl p-3 md:p-4 flex flex-col items-center justify-center text-center bg-white">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-amber-400 mb-1.5 md:mb-2"></div>
              <span className="text-xl md:text-2xl font-bold text-gray-900 mb-0.5 md:mb-1 leading-none">
                {unansweredCount}
              </span>
              <p className="text-[10px] md:text-xs text-gray-500 font-medium">Unanswered</p>
            </div>

            {/* Not Visited */}
            <div className="border border-gray-100 shadow-sm rounded-2xl p-3 md:p-4 flex flex-col items-center justify-center text-center bg-white">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-gray-200 mb-1.5 md:mb-2"></div>
              <span className="text-xl md:text-2xl font-bold text-gray-900 mb-0.5 md:mb-1 leading-none">
                {notVisitedCount}
              </span>
              <p className="text-[10px] md:text-xs text-gray-500 font-medium whitespace-nowrap">Not Visited</p>
            </div>

            {/* Time Taken */}
            <div className="border border-gray-100 shadow-sm rounded-2xl p-3 md:p-4 flex flex-col items-center justify-center text-center bg-white">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-purple-400 mb-1.5 md:mb-2"></div>
              <span className="text-base md:text-lg font-bold text-gray-900 mb-0.5 md:mb-1 leading-tight">
                {timeTaken}
              </span>
              <p className="text-[10px] md:text-xs text-gray-500 font-medium">Time Taken</p>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-gray-500">
                Completion Rate
              </span>
              <span className="text-sm font-bold text-gray-900">
                {completionRate}%
              </span>
            </div>
            <div className="h-2.5 bg-purple-50 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6C2BD9] rounded-full"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Section-wise Summary */}
          <div className="mb-6">
            <h4 className="text-base font-bold text-gray-900 mb-4 text-left">
              Section-wise Summary
            </h4>
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#6C2BD9]" />
                    <span className="font-semibold text-sm text-gray-800">
                      {section.sectionName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-400">
                      <span className="text-gray-900 font-bold">{section.attempted}</span>
                      /{section.total}
                    </div>
                    {section.unanswered > 0 && (
                      <span className="text-[10px] font-semibold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-md">
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
            <div className="bg-red-50 rounded-2xl p-4 mb-2">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-red-500 mb-1">
                    You have {unansweredCount + notVisitedCount} unanswered questions
                  </h5>
                  <p className="text-sm text-red-400 leading-relaxed">
                    Time remaining: {timeRemaining}, you can go back and attempt them
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons (Fixed) */}
        <div className="flex-none p-4 md:p-6 pt-2 flex gap-3 md:gap-4 bg-white">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-full border border-gray-800 text-gray-900 text-xs md:text-base font-bold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Go Back To Test
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-full bg-[#00C55E] text-white text-xs md:text-base font-bold hover:opacity-90 transition-opacity shadow-lg shadow-green-200 cursor-pointer"
          >
            Confirm Submit
          </button>
        </div>
      </div>
    </div>
  );
}
