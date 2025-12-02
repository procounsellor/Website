import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// import type { CourseType } from '@/types/course';
import CourseCard from '@/components/course-cards/CourseCard';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import CreateCourseCard from '@/components/course-cards/CreateCourseCard';
import { getCoursesForCounsellorByCounsellorId } from '@/api/course';
import { Loader2 } from 'lucide-react';

type SubTab = 'PYQ' | 'Test Series' | 'Courses';

type CourseTabProps = {
  user: any,
  token: string;
}



export default function CourseTab(props: CourseTabProps) {
  const { user: _user, token: _token } = props;
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('PYQ');
  const { role, userId } = useAuthStore();
  const navigate = useNavigate();
  const [createCourse, setCreateCourse] = useState(false);

  const { data: coursesData, isLoading, error } = useQuery({
    queryKey: ["counsellorCourses", userId],
    queryFn: () => getCoursesForCounsellorByCounsellorId(userId as string),
    enabled: !!userId,
  });

  const TABS: SubTab[] = ['PYQ', 'Courses', 'Test Series'];

  const filteredCourses = coursesData?.data?.filter(
    course => course.category === activeSubTab
  ) || [];

  function onClose() {
    setCreateCourse(false);
  }



  return (
    <div className="md:bg-white md:py-5 md:px-4 md:rounded-2xl md:border md:border-[#EFEFEF]">
      <div className="bg-white p-2 rounded-xl border border-[#EFEFEF] md:bg-transparent md:p-0 md:border-none md:mb-5">
      <div className='flex justify-between'>
          <div className="flex items-center gap-2">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveSubTab(tab);
              }}
              className={`flex-1 md:flex-none px-4 py-2 text-[12px] md:text-base font-medium rounded-full transition-colors duration-200 ${
                activeSubTab === tab 
                ? 'bg-[#E8E7F2] text-[#13097D]' 
                : 'bg-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
        onClick={()=>setCreateCourse(true)}
        className='flex bg-[#655E95] hover:bg-[#655E95]/90 rounded-2xl md:rounded-[0.75rem] cursor-pointer text-clip border text-xs py-2 lg:py-3 px-3 lg:px-6 text-white items-center justify-center lg:font-semibold'
        >
          Create a Course
        </button>
      </div>

      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#13097D]" />
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">
          {(error as Error).message || 'Failed to load courses'}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid gap-2 grid-cols-2 md:grid-col-4 lg:grid-cols-5 mt-2">
          {filteredCourses.map(course => (
            <div 
              key={course.courseId} 
              className='cursor-pointer' 
              onClick={() => navigate(`/detail/${course.courseId}/${role}`, { state: { from: 'courses' } })}
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
                }} 
                role={role || "counselor"}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          No {activeSubTab} courses created yet.
        </div>
      )}

      {createCourse && <CreateCourseCard onClose={onClose}/>}
    </div>
  );
}