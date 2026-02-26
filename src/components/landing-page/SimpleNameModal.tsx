import { useState } from 'react';
import { X } from 'lucide-react';

interface SimpleNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (firstName: string, lastName: string) => Promise<void>;
  initialFirstName?: string;
  initialLastName?: string;
}

export default function SimpleNameModal({
  isOpen,
  onClose,
  onSubmit,
  initialFirstName = '',
  initialLastName = '',
}: SimpleNameModalProps) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(firstName.trim(), lastName.trim());
      onClose();
    } catch (error) {
      console.error('Error submitting name:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          type="button"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-[#343C6A] mb-2">Complete Your Profile</h2>
        <p className="text-sm text-gray-600 mb-6">Please enter your name to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoFocus
              className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-base text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-base text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your last name (optional)"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !firstName.trim()}
              className="w-full h-12 bg-[#13097D] text-white font-semibold text-base rounded-xl hover:bg-[#0d0659] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Continue to Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
