import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import type { Counsellor } from '@/types/counsellor';
import { getFavouriteCounsellors, getSubscribedCounsellors } from '@/api/counsellor';
import { AllCounselorCardSkeleton } from '@/components/skeletons/CounselorSkeletons';
import { DashboardCounselorCard } from './DashboardCounselorCard';

type CounsellorFilter = 'Subscribed' | 'Favourite';

const CounsellorsTab: React.FC = () => {
  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');

  const [activeFilter, setActiveFilter] = useState<CounsellorFilter>('Subscribed');
  const [favouriteCounsellors, setFavouriteCounsellors] = useState<Counsellor[]>([]);
  const [subscribedCounsellors, setSubscribedCounsellors] = useState<Counsellor[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribedError, setSubscribedError] = useState<string | null>(null);
  const [favouriteError, setFavouriteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounsellors = async () => {
      if (!userId || !token) {
        setSubscribedError("User not authenticated.");
        setFavouriteError("User not authenticated.");
        setLoading(false);
        return;
      }
      setLoading(true);
      const results = await Promise.allSettled([
        getSubscribedCounsellors(userId, token),
        getFavouriteCounsellors(userId, token),
      ]);

      if (results[0].status === 'fulfilled') {
        setSubscribedCounsellors(results[0].value);
      } else {
        console.error("Failed to fetch subscribed counsellors:", results[0].reason);
        setSubscribedError('Could not load subscribed counsellors.');
      }

      // Handle Favourite Counsellors result
      if (results[1].status === 'fulfilled') {
        setFavouriteCounsellors(results[1].value);
      } else {
        console.error("Failed to fetch favourite counsellors:", results[1].reason);
        setFavouriteError('Could not load favourite counsellors.');
      }
      
      setLoading(false);
      // -- FIX ENDS HERE --
    };
      

    fetchCounsellors();
  }, [userId, token]);

  const TABS: CounsellorFilter[] = ['Subscribed', 'Favourite'];
  const counsellorsToDisplay = activeFilter === 'Subscribed' ? subscribedCounsellors : favouriteCounsellors;
  const currentError = activeFilter === 'Subscribed' ? subscribedError : favouriteError;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <AllCounselorCardSkeleton key={i} />)}
        </div>
      );
    }

    if (currentError) {
      return (
        <div className="text-center py-16 bg-white rounded-xl border border-red-200">
          <h3 className="text-lg font-semibold text-red-600">Error</h3>
          <p className="text-gray-500 mt-2">{currentError}</p>
        </div>
      );
    }

    if (counsellorsToDisplay.length === 0) {
      return (
        <div className="text-center py-16">
          <h3 className="text-lg font-semibold text-gray-700">No Counsellors Found</h3>
          <p className="text-gray-500 mt-2">You haven't added any counsellors to this list yet.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {counsellorsToDisplay.map((counsellor) => (
            <div 
            key={counsellor.counsellorId} 
            className="border border-gray-200 rounded-2xl p-2.5 transition-shadow hover:shadow-lg"
          >
          <Link to={`/counselors/${counsellor.counsellorId}`} key={counsellor.counsellorId}>
            <DashboardCounselorCard counselor={counsellor as any} />
          </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#EFEFEF]">
      <div className="flex items-center gap-2 sm:gap-6 mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 text-base font-medium rounded-full transition-colors duration-200 ${
              activeFilter === tab 
              ? 'bg-[#E8E7F2] text-[#13097D]' 
              : 'bg-transparent text-[#13097D]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};

export default CounsellorsTab;