import { CheckCircle, X, Calendar, Clock, User } from "lucide-react";
import { Button } from "../ui";
import { createPortal } from "react-dom";
import { useEffect } from "react";

interface BookingConfirmationCardProps {
  isOpen: boolean;
  onClose?: () => void;
  bookingDetails: {
    counselorName: string;
    counselorPhoto?: string;
    appointmentDate: string;
    appointmentTime: string;
    appointmentId?: string;
  };
}

const BookingConfirmationCard: React.FC<BookingConfirmationCardProps> = ({
  isOpen,
  onClose,
  bookingDetails
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #CBD5E0;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #A0AEC0;
        }
      `}</style>
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#718EBF] hover:text-[#343C6A] transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        <div className="bg-white w-[500px] max-h-[600px] p-6 rounded-2xl shadow-xl relative z-10">
          {/* Success Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#343C6A] mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-[#718EBF]">
              Your appointment has been successfully scheduled
            </p>
          </div>

          {/* Appointment Details */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h2 className="text-lg font-semibold text-[#343C6A] mb-4">
              Appointment Details
            </h2>
            
            <div className="space-y-3">
              {/* Counselor Info */}
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-[#718EBF]" />
                <div className="flex items-center space-x-3">
                  {bookingDetails.counselorPhoto && (
                    <img
                      src={bookingDetails.counselorPhoto}
                      alt={bookingDetails.counselorName}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-sm text-[#718EBF]">Counselor</p>
                    <p className="font-medium text-[#343C6A]">{bookingDetails.counselorName}</p>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-[#718EBF]" />
                <div>
                  <p className="text-sm text-[#718EBF]">Date</p>
                  <p className="font-medium text-[#343C6A]">{formatDate(bookingDetails.appointmentDate)}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-[#718EBF]" />
                <div>
                  <p className="text-sm text-[#718EBF]">Time</p>
                  <p className="font-medium text-[#343C6A]">{bookingDetails.appointmentTime}</p>
                </div>
              </div>

              {/* Appointment ID if available */}
              {bookingDetails.appointmentId && (
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-[#718EBF]">Appointment ID</p>
                  <p className="font-mono text-sm font-medium text-[#343C6A]">
                    {bookingDetails.appointmentId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Important Notes:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Join 5 minutes before scheduled time</li>
              <li>• Confirmation email will be sent shortly</li>
              <li>• Reschedule 24 hours in advance if needed</li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button
              onClick={onClose}
              className="px-8 py-3 bg-[#3537B4] hover:bg-[#2c2e96] text-white rounded-lg"
            >
              Got It!
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BookingConfirmationCard;