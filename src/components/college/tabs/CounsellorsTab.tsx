import { useAllCounselors } from '@/hooks/useCounselors';
import FancyCard from '@/components/Revamp/admissions/counsellor/counsellorCard';

const CounsellorsTab = () => {
  const { data: counsellors, loading, error } = useAllCounselors(4);
  // Counsellors we already have (the build-time snapshot, or a previous fetch)
  // are shown even while a refresh is loading or after it failed. The prerender
  // can't reach the API, so it otherwise saved "Unable to load counsellors."
  // while the browser first rendered "Loading…", and the page failed to hydrate.
  const hasCounsellors = Boolean(counsellors?.length);

  if (loading && !hasCounsellors) {
    return (
      <div className="w-full flex justify-center items-center min-h-[150px] md:min-h-[300px]">
        <p className="text-[#8C8CA1] font-medium font-['Poppins'] text-sm md:text-base">Loading counsellors...</p>
      </div>
    );
  }

  if (error && !hasCounsellors) {
    return (
      <div className="w-full flex justify-center items-center min-h-[150px] md:min-h-[300px]">
        <p className="text-red-500 font-medium font-['Poppins'] text-sm md:text-base">Unable to load counsellors.</p>
      </div>
    );
  }

  if (!counsellors || counsellors.length === 0) {
    return (
      <div className="w-full flex justify-center items-center min-h-[150px] md:min-h-[300px]">
        <p className="text-[#8C8CA1] font-medium font-['Poppins'] text-sm md:text-base">No counsellors found.</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      <div className="grid grid-cols-2 gap-3 gap-y-6 md:flex md:flex-wrap md:gap-8 md:justify-center lg:justify-start">
        {counsellors.map((counselor) => (
          <div key={counselor.counsellorId} className="shrink-0 flex justify-center">
             {/* FancyCard links to the profile itself (card click + name link); an
                 outer <Link> nested its <a> inside another, which browsers split
                 apart when reading the prerendered HTML, failing hydration. */}
             <FancyCard
                counsellorId={counselor.counsellorId}
                name={counselor.firstName + counselor.lastName} 
                imageUrl={counselor.photoUrlSmall || ""} 
                rating={Number(counselor.rating?.toFixed(1)) || 0} 
                experience={counselor.experience ||  'NA'} 
                city={counselor.city || 'NA'}
                proCoins={counselor.plusAmount}
               />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounsellorsTab;