import { useQuery } from '@tanstack/react-query';
import { getCoursesForCounsellorByCounsellorId, getCoursesForUserByCounsellorId, getPublicCoursesForCounsellorId } from '@/api/course';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import CourseCard from '@/components/course-cards/CourseCard';
import { useAuthStore } from '@/store/AuthStore';

type CounselorCoursesCardProps = {
  counsellorId: string;
  userRole?: "user" | "student" | "counselor";
};

export default function CounselorCoursesCard({ counsellorId, userRole = "user" }: CounselorCoursesCardProps) {
  const navigate = useNavigate();
  const { userId } = useAuthStore();

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
          {courses.slice(0, 4).map(course => (
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
              onClick={() => navigate('/courses')}
              className="text-[#13097D] text-sm font-semibold hover:underline"
            >
              View All Courses ({courses.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
