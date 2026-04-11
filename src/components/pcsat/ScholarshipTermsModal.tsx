import { X, CheckCircle2, AlertCircle } from "lucide-react";

interface ScholarshipTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScholarshipTermsModal({ isOpen, onClose }: ScholarshipTermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-semibold text-[#0E1629]">Scholarship Terms & Conditions</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            
            {/* Intro Alert */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-[#2F43F2] shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900 leading-relaxed">
                The PCSAT 2026 Scholarship Program aims to reward consistent academic excellence. 
                Please note that performance in PCSAT alone does not guarantee a scholarship; 
                it must be backed by your school academic records.
              </p>
            </div>

            <section>
              <h3 className="text-lg font-semibold text-[#0E1629] mb-3 flex items-center gap-2">
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded">TIER 1</span>
                Top 3 Performers (100% Scholarship)
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Eligibility:</strong> Candidates securing Ranks 1 through 3 in PCSAT 2026 are provisionally eligible for a 100% tuition fee waiver.
                  </span>
                </li>
                <li className="flex gap-3 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Academic Requirement:</strong> To validate the scholarship, the student must have secured a minimum of <strong>90% aggregate marks</strong> (or equivalent grade) in their most recent school semester or preliminary examination.
                  </span>
                </li>
                <li className="flex gap-3 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Disqualification Condition:</strong> If the candidate's school academic score is below 90%, the 100% scholarship offer will be revoked immediately, and the student will not be eligible for this specific benefit.
                  </span>
                </li>
              </ul>
            </section>

            <div className="h-px bg-gray-100 w-full"></div>

            <section>
              <h3 className="text-lg font-semibold text-[#0E1629] mb-3 flex items-center gap-2">
                <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded">TIER 2</span>
                Next Top 10 Performers (50% Scholarship)
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Eligibility:</strong> Candidates securing Ranks 4 through 13 in PCSAT 2026 are provisionally eligible for a 50% tuition fee waiver.
                  </span>
                </li>
                <li className="flex gap-3 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Academic Requirement:</strong> Similar to Tier 1, eligible students must produce valid proof of securing <strong>90% or above</strong> in their last semester or preliminary examinations.
                  </span>
                </li>
                <li className="flex gap-3 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Disqualification Condition:</strong> Failure to meet the 90% academic threshold will result in the forfeiture of the 50% scholarship benefit.
                  </span>
                </li>
              </ul>
            </section>

             <div className="h-px bg-gray-100 w-full"></div>

            {/* General Terms */}
            <section className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">General Policies</h4>
              <ul className="list-disc pl-4 space-y-1 text-xs text-gray-500">
                <li>Scholarships are non-transferable and cannot be exchanged for cash or other goods.</li>
                <li><strong>Document Verification:</strong> Winners must submit valid school ID cards and authenticated marksheets within 7 days of the result declaration for verification purposes.</li>
                <li>The management reserves the right to withhold prizes or scholarships in cases of suspected malpractice or unfair means during the PCSAT 2026.</li>
                <li>The decision of the ProCounsel examination committee regarding ranks and scholarship allocation will be final and binding.</li>
              </ul>
            </section>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-[#0E1629] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}