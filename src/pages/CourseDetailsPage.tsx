import ContentCard from "@/components/course-cards/ContentCard";
import CourseReviewsCard from "@/components/course-cards/CourseReviewsCard";
import DetailsCard from "@/components/course-cards/DetailsCard";
import { useParams } from "react-router-dom";

const course = {
  id: "121dd23",
  name: "Course Name",
  subject: "Physics",
  price: "1200",
  rating: "4.5",
  reviews: "23",
  image: "/mockCourse.svg",
};

export default function CourseDetailsPage() {
  const { courseId, role } = useParams();
  return (
    <div className="bg-[#F5F5F7]   mt-20 p-6 md:mt-20">
      <DetailsCard
        role={role as string}
        courseId={courseId as string}
        course={course}
      />

      <div className="max-w-7xl mx-auto mt-6 py-4 mb-4">
        <h1 className="text-[1.25rem] text-[#343C6A] font-semibold mb-4">Course Description</h1>
        <p className="text-[1rem] font-normal text-[#8C8CA1]">
          Lorem ipsum dolor sit amet consectetur. Nibh consectetur vel cras
          mattis tincidunt. Etiam sem tellus auctor etiam. cras bibendum erat
          sce Lorem ipsum dolor sit amet consectetur. Nibh consectetur vel cras
          mattis tincidunt. Etiam sem tellus auctor etiam. cras bibendum erat
          sce Lorem ipsum dolor sit amet consectetur. Nibh consectetur vel cras
          mattis tincidunt. Etiam sem tellus auctor etiam. cras bibendum erat
          sce Lorem ipsum dolor sit amet consectetur. Nibh consectetur vel cras
          mattis tincidunt. Etiam sem tellus auctor etiam. cras bibendum erat
          sce Lorem ipsum dolor sit amet consectetur. Nibh consectetur vel cras
          mattis tincidunt. Etiam sem tellus auctor etiam. cras bibendum erat
          sce Lorem ipsum dolor sit amet consectetur. Nibh consectetur vel cras
          mattis tincidunt. Etiam sem tellus auctor etiam. cras bibendum erat
          sce.
        </p>
      </div>

      <div className="max-w-7xl mx-auto mb-6">
        <ContentCard/>
      </div>


      <div className="max-w-7xl mx-auto">
          <CourseReviewsCard role={role}/>
      </div>
    </div>
  );
}
