import CourseCard from './CourseCard';
import type { CourseOffered } from '@/types/academic';

interface CoursesTabProps {
  courses?: CourseOffered[];
  fallbackImage?: string;
}

// Real courses offered by this college. This tab used to render the same four
// invented degrees on every college page.
const CoursesTab = ({ courses = [], fallbackImage }: CoursesTabProps) => {
  const items = courses.filter((course) => course?.courseName?.trim());

  if (items.length === 0) {
    return (
      <div className="p-4 min-h-[200px] rounded-lg flex items-center justify-center text-center text-[#718EBF] font-medium">
        The course list for this college has not been published yet.
      </div>
    );
  }

  return (
    // Mobile: Grid with 2 columns. Desktop: Flex wrap (preserved)
    <div className="w-full grid grid-cols-2 gap-3 md:flex md:flex-wrap md:gap-[23px] md:justify-center">
      {items.map((course, index) => (
        <CourseCard
          key={course.courseId || `${course.courseName}-${index}`}
          title={course.courseName}
          category={String(course.courseLevel).toUpperCase() === 'PG' ? 'PG' : 'UG'}
          image={fallbackImage || '/course/2.webp'}
          onViewCourse={() => {}}
        />
      ))}
    </div>
  );
};

export default CoursesTab;
