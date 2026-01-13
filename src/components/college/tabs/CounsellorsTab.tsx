import { useEffect, useState } from 'react';
import { AllCounselorCard } from '@/components/homecards/AllCounselorCard';
import { academicApi } from '@/api/academic';
import type { AllCounselor } from '@/types/academic';
import { Link } from 'react-router-dom';

const CounsellorsTab = () => {
  const [counsellors, setCounsellors] = useState<AllCounselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        const data = await academicApi.getLoggedOutCounsellors();
        
        if (data && Array.isArray(data)) {
          setCounsellors(data.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch counsellors:", err);
        setError("Unable to load counsellors at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchCounsellors();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[150px] md:min-h-[300px]">
        <p className="text-[#8C8CA1] font-medium font-['Montserrat'] text-sm md:text-base">Loading counsellors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center min-h-[150px] md:min-h-[300px]">
        <p className="text-red-500 font-medium font-['Montserrat'] text-sm md:text-base">{error}</p>
      </div>
    );
  }

  if (counsellors.length === 0) {
    return (
      <div className="w-full flex justify-center items-center min-h-[150px] md:min-h-[300px]">
        <p className="text-[#8C8CA1] font-medium font-['Montserrat'] text-sm md:text-base">No counsellors found.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-6 justify-items-center">
        {counsellors.map((counselor) => (
          <div key={counselor.counsellorId} className="shrink-0 w-full md:w-auto">
             <Link to={`/counsellor-profile`} state={{ id: counselor.counsellorId }} className="block">
                <AllCounselorCard counselor={counselor} />
             </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounsellorsTab;