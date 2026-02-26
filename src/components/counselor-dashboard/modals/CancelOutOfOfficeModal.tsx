import { X, AlertTriangle } from "lucide-react";

interface CancelOutOfOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export default function CancelOutOfOfficeModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
}: CancelOutOfOfficeModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:cursor-pointer"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-red-100">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#343C6A]">
              Cancel Out of Office
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Are you sure you want to cancel this "Out of Office" period? This
              action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full flex-1 px-6 py-3 hover:cursor-pointer bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full flex-1 px-6 py-3 hover:cursor-pointer bg-red-600 text-white font-semibold rounded-lg text-sm hover:bg-red-700 disabled:bg-red-400"
          >
            {isSubmitting ? "Cancelling..." : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}