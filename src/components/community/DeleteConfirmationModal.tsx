import React from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  title?: string;
  message?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title = "Delete Answer",
  message = "Are you sure you want to delete this answer? This action cannot be undone."
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#23232380] backdrop-blur-[35px]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[400px] p-8 bg-white rounded-2xl shadow-xl border border-[#EFEFEF]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 rounded-full text-[#8C8CA1] hover:bg-gray-100 hover:text-black transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500">
            <AlertTriangle size={24} />
          </div>

          <h2 className="text-xl font-bold text-[#343C6A] mb-2">
            {title}
          </h2>
          
          <p className="text-sm text-[#8C8CA1] mb-8 leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-11 rounded-xl border border-[#EFEFEF] text-[#343C6A] font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 h-11 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;