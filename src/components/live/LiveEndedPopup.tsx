import { X } from 'lucide-react';

interface LiveEndedPopupProps {
  onClose: () => void;
}

export default function LiveEndedPopup({ onClose }: LiveEndedPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Live Session Ended</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          The live session has ended. Thank you for watching!
        </p>
        
        <button
          onClick={onClose}
          className="w-full bg-[#13097D] hover:bg-[#0d0659] text-white py-3 rounded-lg font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
