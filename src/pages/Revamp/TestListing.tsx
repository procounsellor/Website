import MobileCourseBottomNav from "@/components/Revamp/courses/MobileCourseBottomNav";

export default function TestListing() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-24">
      <div className="px-5 pt-8 md:px-12">
        <h1 className="text-2xl font-semibold text-[#0E1629]">Test Listing</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Placeholder page. You can add the test listing content here.
        </p>
      </div>

      <MobileCourseBottomNav />
    </div>
  );
}
