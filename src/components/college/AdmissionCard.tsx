import { useState } from "react";
import QuickLeadForm from "@/components/leads/QuickLeadForm";
import LeadDialog from "@/components/Revamp/home/LeadDialog";

/**
 * Admission help for one college: a call-back request.
 *
 * This used to be a static "Admissions Open · Session 2026-27 · Fee ₹1,500 ·
 * Deadline 30th Apr, 2026" card, identical on every college page (none of it
 * was that college's data), with an "Apply Now" button on phones that did
 * nothing and a disabled one on desktop. The visitor reading a college page is
 * the one most ready to ask for help, so both now open the site's lead form.
 */
const AdmissionCard = ({ collegeName }: { collegeName?: string }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const name = collegeName?.trim() || "this college";
  const heading = `Admission help for ${name}`;
  const subheading =
    "Cut-offs, fees, your chances and the application steps: leave your number and a ProCounsel counsellor will call you back. Free, no login needed.";
  const intent = `College page: ${name}`;

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#EFEFEF] shadow-[0_-4px_10px_0px_rgba(0,0,0,0.1)] px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <h3 className="text-[#343C6A] font-semibold text-[15px] leading-tight font-['Poppins']">
            Admission help
          </h3>
          <span className="truncate text-[#8C8CA1] text-[12px] font-medium font-['Poppins']">
            Free call with a counsellor
          </span>
        </div>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="cursor-pointer bg-[#13097D] text-white rounded-lg px-5 py-2.5 font-medium font-['Poppins'] text-[14px] hover:bg-[#0f0763] transition-colors shadow-md whitespace-nowrap"
        >
          Get a call back
        </button>
      </div>

      <QuickLeadForm
        className="hidden md:block"
        intent={intent}
        formId="college_details_sidebar"
        heading={heading}
        subheading={subheading}
      />

      {dialogOpen && (
        <LeadDialog
          title={heading}
          subheading={subheading}
          intent={intent}
          formId="college_details_mobile_bar"
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
};

export default AdmissionCard;
