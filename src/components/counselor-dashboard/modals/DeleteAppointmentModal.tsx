import { X } from "lucide-react";
import { useState } from "react";

interface DeleteAppointmentModalProps {
  userName: string;
  onClose: () => void;
  onConfirm: (reason: string) => void; 
}

export default function DeleteAppointmentModal({
  onClose,
  onConfirm,
}: DeleteAppointmentModalProps) {
  const [reason, setReason] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = () => {
    if (!reason.trim()) {
      alert("Please provide a reason for cancellation.");
      return;
    }
    setIsDeleting(true);
    onConfirm(reason);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      <div
        className="fixed bg-white rounded-[16px] shadow-lg z-[70] p-5 flex flex-col"
        style={{
          width: "580px",
          height: "auto",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: "1px solid #2B2B2F40",
        }}
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

        <div className="flex justify-end gap-4 mt-auto pt-4">
          <button
            onClick={handleConfirm}
            disabled={!reason.trim() || isDeleting}
            className="px-6 py-2 bg-[#FA660F] text-white rounded-lg font-medium hover:bg-[#e55d0e] transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Cancelling..." : "Confirm Cancellation"}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-[#FA660F] text-[#FA660F] rounded-lg font-medium hover:bg-[#FA660F]/5 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
}