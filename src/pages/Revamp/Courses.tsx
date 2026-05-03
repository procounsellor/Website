import Banner from "@/components/Revamp/courses/Banner";
import MobileCourseBottomNav from "@/components/Revamp/courses/MobileCourseBottomNav";
import PageSEO from "@/components/SEO/PageSEO";

export default function Courses() {
  return (
    <>
      <PageSEO
        title="Courses & Test Series – Learn from Expert Counsellors"
        description="Explore courses, mock test series, and live sessions created by verified counsellors on ProCounsel. Find the right course based on your counsellor's guidance and your academic goals."
        canonical="/courses"
        keywords="counsellor courses, online courses, mock test series, live sessions, academic guidance, ProCounsel courses"
      />
      <div className="min-h-screen relative ">
        <Banner />
        <MobileCourseBottomNav />
      </div>
    </>
  );
}
