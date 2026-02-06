import { Link } from 'react-router-dom';
import { CollegeCounselorCard } from './CollegeCounselorCard';
import { useAllCounselors } from '@/hooks/useCounselors';
import { encodeCounselorId } from '@/lib/utils';

const CounsellorsTab = () => {
  const { data: counsellors, loading, error } = useAllCounselors(4);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[150px] md:min-h-[300px]">
        <p className="text-[#8C8CA1] font-medium font-['Poppins'] text-sm md:text-base">Loading counsellors...</p>
      </div>
    );
  }

  if (error) {
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
             <Link to={`/counsellor/${encodeCounselorId(counselor.counsellorId)}`} className="block hover:no-underline">
                <CollegeCounselorCard counselor={counselor} />
             </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounsellorsTab;