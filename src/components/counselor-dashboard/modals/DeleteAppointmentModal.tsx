import { X } from "lucide-react";
import { useState } from "react";

interface DeleteAppointmentModalProps {
  userName: string;
  onClose: () => void;
  onConfirm: (reason: string) => void; 
  isSubmitting: boolean;
}

export default function DeleteAppointmentModal({
  onClose,
  onConfirm,
  isSubmitting,
}: DeleteAppointmentModalProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      alert("Please provide a reason for cancellation.");
      return;
    }
    onConfirm(reason);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      <div
        className="fixed bg-white rounded-[16px] shadow-lg z-[70] p-5 flex flex-col w-[90vw] max-w-[580px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-[#2B2B2F40]"
      >
        <div className="flex justify-between">
          <div className="text-[20px] font-semibold text-[#343C6A]">
            Cancel Meeting
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-[#262626] group rounded-full transition-colors"
          >
            <X size={18} className="text-gray-500 group-hover:text-white" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-[#232323] text-[16px] font-medium mb-2">
            Are you sure you want to cancel this meeting? Please provide a reason below.
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., I am not feeling well"
            className="w-full h-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FA660F] focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 sm:gap-4 mt-auto pt-4">
          <button
            onClick={handleConfirm}
            disabled={!reason.trim()|| isSubmitting}
            className="px-4 py-2 text-sm sm:px-6 sm:py-2 sm:text-base bg-[#FA660F] text-white rounded-lg font-medium hover:bg-[#e55d0e] transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm sm:px-6 sm:py-2 sm:text-base border border-[#FA660F] text-[#FA660F] rounded-lg font-medium hover:bg-[#FA660F]/5 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
}