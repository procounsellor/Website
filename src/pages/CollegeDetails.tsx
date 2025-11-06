import ComingSoonFallback from "@/components/shared/ComingSoonFallback";

export default function CollegeDetailsPage() {
  return (
    <div className="bg-gray-50 pt-20 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <ComingSoonFallback 
          title="College Details Coming Soon!"
          message="Our team is working hard to bring you comprehensive college information including rankings, admission criteria, fees, placements, and student reviews. Stay tuned!"
        />
      </main>
    </div>
  );
}
