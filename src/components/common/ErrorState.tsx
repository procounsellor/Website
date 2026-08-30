import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, RefreshCw, WifiOff } from "lucide-react";

type ErrorStateProps = {
  /** Short headline. Keep it about the user's situation, not the exception. */
  title?: string;
  /** One sentence of plain English. Never paste a raw API message in here. */
  message?: string;
  /** Retry handler. Omitted means the failure is not retryable in place. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Hidden when the page has nowhere sensible to go back to. */
  showBack?: boolean;
  backLabel?: string;
  onBack?: () => void;
  /** `page` fills the viewport; `inline` sits inside an existing section. */
  variant?: "page" | "inline";
  children?: ReactNode;
};

/**
 * The one error surface for "the API did not answer".
 *
 * Two failure modes it exists to kill:
 *   - a skeleton or spinner that never resolves, because the loading flag went
 *     false but the data stayed null — the page then looks permanently busy;
 *   - dumping the raw error plus internal ids (courseId, userId, role) on the
 *     screen, which is debug output, not a user-facing state.
 */
export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this right now. Please try again in a moment.",
  onRetry,
  retryLabel = "Try again",
  showBack = true,
  backLabel = "Go back",
  onBack,
  variant = "page",
  children,
}: ErrorStateProps) {
  const navigate = useNavigate();
  const offline = typeof navigator !== "undefined" && navigator.onLine === false;
  const Icon = offline ? WifiOff : AlertTriangle;

  return (
    <div
      role="alert"
      className={
        variant === "page"
          ? "flex min-h-[70vh] w-full items-center justify-center bg-[#F5F5F7] px-4 py-12"
          : "flex w-full items-center justify-center px-4 py-10"
      }
    >
      <div className="w-full max-w-md rounded-2xl border border-[#E6E6E6] bg-white p-8 text-center shadow-[0_1px_2px_rgba(14,22,41,0.04)]">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FEF2F2]">
          <Icon className="h-7 w-7 text-[#DC2626]" strokeWidth={1.75} />
        </div>

        <h2 className="font-[Poppins] text-[18px] font-semibold text-[#0E1629] md:text-[20px]">
          {offline ? "You're offline" : title}
        </h2>
        <p className="mt-2 font-[Poppins] text-[14px] leading-relaxed text-[#6B7280]">
          {offline
            ? "Check your internet connection and try again."
            : message}
        </p>

        {children}

        <div className="mt-6 flex flex-col-reverse items-stretch justify-center gap-3 sm:flex-row">
          {showBack && (
            <button
              type="button"
              onClick={() => (onBack ? onBack() : navigate(-1))}
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-[#D6DCE5] bg-white px-5 font-[Poppins] text-[14px] font-medium text-[#0E1629] transition-colors hover:bg-[#F8F9FA]"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </button>
          )}
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-[#0E1629] px-5 font-[Poppins] text-[14px] font-medium text-white transition-opacity hover:opacity-90"
            >
              <RefreshCw className="h-4 w-4" />
              {retryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
