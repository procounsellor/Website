// import { Flame } from 'lucide-react';
import { useState, type JSX } from 'react';
import AppointmentCard from '../appointment-cards/AppointmentCard';
import type { CounselorDetails } from '@/types/academic';
import { useAuthStore } from '@/store/AuthStore';
import type { User } from '@/types/user';
import { Info } from 'lucide-react';

interface Props{
  counselor: CounselorDetails;
  user: User | null;
  onProfileIncomplete: (action: () => void) => void;
}

export function FreeCareerAssessmentCard({counselor, user, onProfileIncomplete}:Props):JSX.Element {
  const [booking, setBooking] = useState(false);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const toggleLogin = useAuthStore(state => state.toggleLogin);
  const loggedInUserRole = useAuthStore(state => state.role);

  const isCurrentUserCounselor = loggedInUserRole === 'counselor';

  const handleBookingClick = () => {
    if (isCurrentUserCounselor) {
      console.log("Counselors cannot book appointments with other counselors.");
      return;
    }
    console.log('Book Appointment clicked, isAuthenticated:', isAuthenticated);
    if (!isAuthenticated) {
      console.log('User not authenticated, triggering login');
      toggleLogin();
      return;
    }
    const bookAction = () => {
      setBooking(true);
    };
    if (!user?.firstName || !user?.email) {
      onProfileIncomplete(bookAction);
      return;
    }
    bookAction();
  };

  if(booking){
      return <AppointmentCard counselor={counselor} onClose={() => setBooking(false)} />
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
        <div className="flex justify-between items-center gap-2">
            <h3 className="text-base md:text-lg font-semibold md:font-bold text-[#343C6A]">Free Career Assessment</h3>
            <span className="flex-shrink-0 flex items-center gap-1 bg-[#FFF9D9] text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                <img 
                  src="/flame.gif" 
                  alt="Flame animation" 
                  className="w-5 h-5"
                /> Trending
            </span>
        </div>
        <p className="text-gray-600 mt-1 font-medium text-sm">30-minute discovery session</p>
        <button
          onClick={handleBookingClick}
          disabled={isCurrentUserCounselor}
          className={`mt-4 w-full text-white text-xs md:text-base font-semibold py-2.5 rounded-lg transition-colors ${
            isCurrentUserCounselor
            ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
            : 'bg-[#FA660F] hover:bg-orange-600'
          }`}
        >
            {isCurrentUserCounselor ? 'Cannot Book (Counselor)' : 'Book Appointment Now'}
        </button>
        {isCurrentUserCounselor && (
             <div className="mt-2 p-1.5 bg-yellow-50 text-yellow-800 text-xs rounded-md flex items-center gap-1.5 justify-center">
                 <Info size={14} /> Counselors cannot book appointments.
             </div>
         )}
         {!isCurrentUserCounselor && (
            <p className="md:text-xs text-[10px] text-center text-[#3537B4] mt-2">Discover the approach to a brighter future</p>
         )}
    </div>
  );
}