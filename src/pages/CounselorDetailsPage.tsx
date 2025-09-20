import { useParams } from 'react-router-dom';
import { useCounselorById } from '@/hooks/useCounselors';

import { CounselorProfileCard } from '@/components/counselor-details/CounselorProfileCard';
import { AboutCounselorCard } from '@/components/counselor-details/AboutCounselorCard';
import { CounselorReviews } from '@/components/counselor-details/CounselorReviews';
import { FreeCareerAssessmentCard } from '@/components/shared/FreeCareerAssessmentCard';
import { FeaturedCollegesCard } from '@/components/shared/FeaturedCollegesCard';


export default function CounselorDetailsPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div className="p-8 text-center text-red-500">Error: Counselor ID is missing.</div>;
  }
  
  const { counselor, loading, error } = useCounselorById(id);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading Counselor Profile...</div>;
  }

  if (error || !counselor) {
    return <div className="flex h-screen items-center justify-center text-red-500">{error || "Counselor not found."}</div>;
  }

  return (
    <div className="bg-gray-50 pt-28 pb-8 px-4">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Counselor Profile</h1>
        <p className="text-gray-500">Discover their expertise and find the right guidance for your future</p>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <CounselorProfileCard counselor={counselor} />
          <AboutCounselorCard counselor={counselor} />
          <CounselorReviews />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <FreeCareerAssessmentCard  counselor={counselor}/>
          <FeaturedCollegesCard />
        </div>

      </div>
      </main>
    </div>
  );
}