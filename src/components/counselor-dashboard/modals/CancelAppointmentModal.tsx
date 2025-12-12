import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isSubmitting: boolean;
}

export default function CancelAppointmentModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isSubmitting 
}: Props) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (isSubmitting || !reason) return;
    onConfirm(reason);
  };

  return (
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 hover:cursor-pointer text-gray-400 hover:text-gray-700"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-[#343C6A]">Cancel Your Appointment</h2>
        <p className="text-base text-gray-600 mt-4">Are you sure you want to cancel this student's appointment?</p>

        <div className="mt-6">
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Add Reason (Required)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full flex-1 px-6 py-3 bg-white border hover:cursor-pointer border-gray-300 text-gray-700 font-semibold rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Go Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !reason}
            className="w-full flex-1 px-6 py-3 bg-gray-500 hover:cursor-pointer text-white font-semibold rounded-lg text-sm hover:bg-gray-600 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Cancelling...' : 'Yes, Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}