import { CounselorCard, type CounselorCardData } from "@/components/cards/CounselorListingCard";
import { useAllCounselors } from "@/hooks/useCounselors";
import type { AllCounselor } from "@/types/academic";

function adaptApiDataToCardData(apiCounselor: AllCounselor): CounselorCardData {
  return {
    id: apiCounselor.id,
    name: apiCounselor.name,
    imageUrl: apiCounselor.imageUrl,
    rating: apiCounselor.rating || 0,
    reviews: apiCounselor.reviews || 0,
    verified: true,
    specialization: "Engineering | MBA +5",
    location: apiCounselor.location,
    languages: ["Hindi", "English", "Marathi", "Telugu"],
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    pricing: {
      plus: 5000,
      pro: 25000,
      elite: 100000,
    },
  };
}

export default function CounselorListingPage() {
  const { data: counselors, loading, error } = useAllCounselors();
  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-gray-500">Loading counselors...</div>;
    }

    if (error) {
      return <div className="text-center text-red-500">Error: {error}</div>;
    }

    if (!counselors || counselors.length === 0) {
      return <p>No counselors found.</p>;
    }

    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {counselors.map((counselor) => (
          <CounselorCard
            key={counselor.id}
            counselor={adaptApiDataToCardData(counselor)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 pt-20">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="hidden lg:block">
            {/* filter component comes here */}
            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="text-xl font-semibold">Filters</h2>
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