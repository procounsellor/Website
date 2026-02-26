import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCoursesForCounsellorByCounsellorId, getCoursesForUserByCounsellorId, getPublicCoursesForCounsellorId } from '@/api/course';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import CourseCard from '@/components/course-cards/CourseCard';
import { useAuthStore } from '@/store/AuthStore';

type CounselorCoursesCardProps = {
  counsellorId: string;
  userRole?: "user" | "student" | "counselor";
};

export default function CounselorCoursesCard({ counsellorId, userRole = "user" }: CounselorCoursesCardProps) {
  const navigate = useNavigate();
  const { userId } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const isCounselor = userRole === 'counselor';
  const isUserOrStudent = userRole === 'user' || userRole === 'student';

  const { data, isLoading, error } = useQuery({
    queryKey: ['counsellorCourses', counsellorId, userId, userRole],
    queryFn: () => {
      if (isCounselor) {
        return getCoursesForCounsellorByCounsellorId(counsellorId);
      } else if (isUserOrStudent && userId) {
        return getCoursesForUserByCounsellorId(userId, counsellorId);
      } else if (isUserOrStudent && !userId) {
        // Use public API for non-logged-in users
        return getPublicCoursesForCounsellorId(counsellorId);
      }
      throw new Error('Unauthorized access');
    },
    enabled: !!counsellorId,
  });

  const courses = data?.data || [];
  const displayedCourses = isExpanded ? courses : courses.slice(0, 4);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#13097D]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <p className="text-red-500 text-center text-sm">Failed to load courses</p>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return null; // Don't show the card if no courses
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Courses</h2>
        <p className="text-sm text-gray-500 mt-1">Browse courses offered by this counsellor</p>
      </div>

      <div className="p-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {displayedCourses.map(course => (
            <div
              key={course.courseId}
              className='cursor-pointer'
              onClick={() => navigate(`/detail/${course.courseId}/${userRole}`)}
            >
              <CourseCard
                course={{
                  id: course.courseId,
                  name: course.courseName,
                  subject: course.category,
                  price: course.coursePriceAfterDiscount.toString(),
                  rating: course.rating?.toString() || undefined,
                  reviews: undefined,
                  image: course.courseThumbnailUrl,
                  courseTimeHours: (course as any).courseTimeHours || 0,
                  courseTimeMinutes: (course as any).courseTimeMinutes || 0,
                }}
                role={userRole}
              />
            </div>
          ))}
        </div>

        {courses.length > 4 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer py-1 mx-auto"
            >
              {isExpanded ? (
                <>
                  Show Less <ChevronUp size={14} />
                </>
              ) : (
                <>
                  See More ({courses.length - 4} more) <ChevronDown size={14} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
