import { CollegeCard, type CollegeCardData } from "@/components/cards/CollegeListingCard";
import { useColleges } from "@/hooks/useColleges";
import type { College } from "@/types/academic";

function adaptApiDataToCardData(apiCollege: College): CollegeCardData {
  return {
    id: apiCollege.id,
    name: apiCollege.name,
    imageUrl: apiCollege.logoUrl, 
    city: apiCollege.city,
    type: apiCollege.type,
  };
}

export default function CollegesListingPage() {
  const { colleges, loading, error } = useColleges();

  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-gray-500">Loading colleges...</div>;
    }

    if (error) {
      return <div className="text-center text-red-500">Error: {error}</div>;
    }

    if (!colleges || colleges.length === 0) {
      return <p className="text-center text-gray-600">No colleges found.</p>;
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {colleges.map((college) => (
          <CollegeCard
            key={college.id}
            college={adaptApiDataToCardData(college)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 pt-20">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/*filters column*/}
          <aside className="hidden lg:block">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h2 className="text-xl font-semibold">Filters</h2>
              {/*filter components*/}
            </div>
          </aside>

          <section className="col-span-1 lg:col-span-3">
            <h1 className="mb-6 text-3xl font-bold">Lorem ipsum dolor sit amet.</h1>
            {renderContent()}
          </section>
        </div>
      </main>
    </div>
  );
}