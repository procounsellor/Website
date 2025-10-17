import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { useAuthStore } from '@/store/AuthStore';
import type { Counsellor } from '@/types/counsellor';
import { getFavouriteCounsellors, getSubscribedCounsellors } from '@/api/counsellor';
import { AllCounselorCardSkeleton } from '@/components/skeletons/CounselorSkeletons';
import { DashboardCounselorCard } from './DashboardCounselorCard';
import { useMediaQuery } from '@/hooks/useMediaQuery';

type CounsellorFilter = 'Subscribed' | 'Favourite';

const addTrackpadScrolling = (emblaApi: EmblaCarouselType) => {
  const SCROLL_COOLDOWN_MS = 300; 
  let isThrottled = false;

  const wheelListener = (event: WheelEvent) => {
    if (isThrottled) return;

    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      event.preventDefault();
      
      isThrottled = true;
      
      if (event.deltaX > 0) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollPrev();
      }
      setTimeout(() => {
        isThrottled = false;
      }, SCROLL_COOLDOWN_MS);
    }
  };

  const containerNode = emblaApi.containerNode();
  containerNode.addEventListener("wheel", wheelListener);

  return () => containerNode.removeEventListener("wheel", wheelListener);
};

const CounsellorsTab: React.FC = () => {
  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');
  const isMobile = useMediaQuery('(max-width: 639px)');

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const updateSelectedIndex = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', updateSelectedIndex);
    const removeTrackpadScrolling = addTrackpadScrolling(emblaApi)
    return () => {
      emblaApi.off('select', updateSelectedIndex);
      removeTrackpadScrolling();
    };
  }, [emblaApi, updateSelectedIndex]);

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

      if (results[1].status === 'fulfilled') {
        setFavouriteCounsellors(results[1].value);
      } else {
        console.error("Failed to fetch favourite counsellors:", results[1].reason);
        setFavouriteError('Could not load favourite counsellors.');
      }
      
      setLoading(false);
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

    if (isMobile) {
      return (
        <>
          <div className="overflow-x-hidden -mx-4" ref={emblaRef}>
            <div className="flex gap-3 px-4 py-1">
              {counsellorsToDisplay.map((counsellor) => (
                <div key={counsellor.counsellorId} className="flex-shrink-0">
                  <div className="w-[170px] h-[264px] bg-white rounded-2xl p-2.5 shadow-[0px_0px_4px_0px_#23232340]">
                    <Link to="/counselors/profile" state={{ id: counsellor.counsellorId }} className="h-full flex flex-col">
                      <DashboardCounselorCard counselor={counsellor as any} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: Math.ceil(counsellorsToDisplay.length / 2) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi && emblaApi.scrollTo(index * 2)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    Math.floor(selectedIndex / 2) === index ? "w-6 bg-[#13097D]" : "w-2 bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              )
            )}
          </div>
        </>
      );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {counsellorsToDisplay.map((counsellor) => (
              <div key={counsellor.counsellorId} className="border border-gray-200 rounded-2xl p-2.5 transition-shadow hover:shadow-lg">
                <Link to="/counselors/profile" state={{ id: counsellor.counsellorId }}>
                  <DashboardCounselorCard counselor={counsellor as any} />
                </Link>
              </div>
            ))}
        </div>
    );
  };
  
  return (
    <div className="sm:bg-white sm:p-6 sm:rounded-2xl sm:border sm:border-[#EFEFEF]">
      <div className="bg-white p-1 rounded-2xl flex items-center gap-2 mb-6 sm:bg-transparent sm:p-0 sm:gap-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`w-full px-3 py-1.5 sm:w-auto sm:px-4 sm:py-2 text-xs sm:text-base font-medium rounded-full transition-colors duration-200 ${
              activeFilter === tab ? 'bg-[#E8E7F2] text-[#13097D]' : 'bg-transparent text-[#13097D]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>
         {renderContent()}
      </div>
    </div>
  );
};

export default CounsellorsTab;