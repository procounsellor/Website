import Banner from "@/components/Revamp/courses/Banner";
import MobileCourseBottomNav from "@/components/Revamp/courses/MobileCourseBottomNav";
import PageSEO from "@/components/SEO/PageSEO";

export default function Courses() {
  return (
    <>
      <PageSEO
        title="Courses & Test Series for JEE, NEET & Competitive Exams"
        description="Explore online courses, mock test series, and live sessions for JEE, NEET, and other competitive exams on ProCounsel. Learn from top counsellors and educators."
        canonical="/courses"
        keywords="JEE online courses, NEET test series, competitive exam preparation, mock tests, live sessions, ProCounsel courses"
      />
      <div className="min-h-screen relative ">
        <Banner />
        <MobileCourseBottomNav />
      </div>
    </>
  );
}
