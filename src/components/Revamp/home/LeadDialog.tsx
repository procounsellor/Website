import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import QuickLeadForm from "@/components/leads/QuickLeadForm";

interface LeadDialogProps {
  /** Dialog title (also the form heading). */
  title: string;
  subheading: string;
  /** Recorded in the lead remarks so the desk knows what the student asked for. */
  intent: string;
  /** Analytics placement id, e.g. "home_exam_reminders". */
  formId: string;
  course?: string;
  exam?: string;
  onClose: () => void;
}

/**
 * The site's login-free call-back form (QuickLeadForm → /api/leads/captureLead)
 * in an accessible dialog: focus moves in, Tab stays in, Esc closes, the page
 * behind doesn't scroll, and focus returns to the button that opened it.
 */
export default function LeadDialog({ title, subheading, intent, formId, course, exam, onClose }: LeadDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/50 p-0 md:items-center md:p-4" onClick={() => onCloseRef.current()}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[20px] bg-white md:max-w-[480px] md:rounded-[20px]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={() => onCloseRef.current()}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-[#F5F7FB]"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        <QuickLeadForm
          heading={title}
          subheading={subheading}
          intent={intent}
          formId={formId}
          course={course}
          exam={exam}
          className="border-0 shadow-none"
        />
      </div>
    </div>
  );
}
