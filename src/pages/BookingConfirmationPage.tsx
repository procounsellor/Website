import BookingConfirmationCard from '@/components/appointment-cards/BookingConfirmationCard';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BookingConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const bookingDetails = state ?? {};

  const handleClose = () => {
    // go back to home or counselors listing
    navigate('/');
  };

  return (
    <BookingConfirmationCard
      isOpen={true}
      onClose={handleClose}
      bookingDetails={{
        counselorName: bookingDetails.counselorName ?? 'Counselor',
        counselorPhoto: bookingDetails.counselorPhoto,
        appointmentDate: bookingDetails.appointmentDate ?? new Date().toISOString(),
        appointmentTime: bookingDetails.appointmentTime ?? '',
        appointmentId: bookingDetails.appointmentId,
      }}
    />
  );
}
