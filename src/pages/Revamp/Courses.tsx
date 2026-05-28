import Banner from "@/components/Revamp/courses/Banner";
import MobileCourseBottomNav from "@/components/Revamp/courses/MobileCourseBottomNav";
import PageSEO from "@/components/SEO/PageSEO";

export default function Courses() {
  return (
    <>
      <PageSEO
        title="Courses & Test Series – JEE, NEET & Career Prep | ProCounsel"
        description="Explore JEE, NEET, MBA and career prep courses, mock test series, and live sessions by verified counsellors on ProCounsel. Start learning today."
        canonical="/courses"
        keywords="JEE courses online, NEET preparation, MBA entrance coaching, career counselling courses india"
      />
      <div className="min-h-screen relative ">
        <Banner />
        <MobileCourseBottomNav />
      </div>
    </>
  );
}
