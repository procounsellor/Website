import QuickLeadForm from "@/components/leads/QuickLeadForm";
import DialogShell from "./DialogShell";

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

/** The site's login-free call-back form (QuickLeadForm → /api/leads/captureLead) in an accessible dialog. */
export default function LeadDialog({ title, subheading, intent, formId, course, exam, onClose }: LeadDialogProps) {
  return (
    <DialogShell label={title} onClose={onClose}>
      <QuickLeadForm
        heading={title}
        subheading={subheading}
        intent={intent}
        formId={formId}
        course={course}
        exam={exam}
        className="border-0 shadow-none"
      />
    </DialogShell>
  );
}
