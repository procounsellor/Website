import { X } from "lucide-react";

interface DeleteAppointmentModalProps {
  userName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteAppointmentModal({
  onClose,
  onConfirm,
}: DeleteAppointmentModalProps) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      <div
        className="fixed bg-white rounded-[16px] shadow-lg z-[70] p-5"
        style={{
          width: "580px",
          height: "208px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: "1px solid #2B2B2F40",
        }}
      >
        <div className="flex justify-between">
          <div className="text-[20px] font-semibold text-[#343C6A]">
            Delete Meeting
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-[#262626] group rounded-full transition-colors"
          >
            <X size={18} className="text-gray-500 group-hover:text-white" />
          </button>
        </div>

        <div className="mt-4 mb-[60px]">
          <p className="text-[#232323] text-[16px] font-medium">
            Are you sure you want to delete this meeting?
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-[#FA660F] text-white rounded-lg font-medium hover:bg-[#e55d0e] transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-[#FA660F] text-[#FA660F] rounded-lg font-medium hover:bg-[#FA660F]/5 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
