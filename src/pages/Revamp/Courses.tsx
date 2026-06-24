import Banner from "@/components/Revamp/courses/Banner";
import MobileCourseBottomNav from "@/components/Revamp/courses/MobileCourseBottomNav";
import PageSEO from "@/components/SEO/PageSEO";
import SeoArticle from "@/components/SEO/SeoArticle";
import { coursesContent } from "@/components/SEO/seoContent";

export default function Courses() {
  return (
    <>
      <PageSEO
        title="Online Courses, Test Series & Live Classes for Students | ProCounsel"
        description="Explore online courses, mock test series and live classes for JEE, NEET, MHT-CET, CUET, boards, foundation and skill-building — taught by verified counsellors on ProCounsel."
        canonical="/courses"
        keywords="online courses for students, entrance exam preparation, JEE NEET courses, MHT CET preparation, CUET courses, mock test series, online test series, foundation course, live online classes"
      />
      <div className="min-h-screen relative ">
        <Banner />
        <MobileCourseBottomNav />
        <SeoArticle {...coursesContent} />
      </div>
    </>
  );
}
