import ComingSoonFallback from "@/components/shared/ComingSoonFallback";

export default function CourseDetailsPage() {
  return (
    <div className="bg-gray-50 pt-20 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <ComingSoonFallback 
          title="Course Details Coming Soon!"
          message="Our team is working diligently to bring you detailed course information including curriculum, eligibility, career prospects, and top colleges offering this course. Stay tuned!"
        />
      </main>
    </div>
  );
}
