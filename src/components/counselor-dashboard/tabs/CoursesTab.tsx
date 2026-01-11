import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
// import type { CourseType } from '@/types/course';
import CourseCard from '@/components/course-cards/CourseCard';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import CreateCourseCard from '@/components/course-cards/CreateCourseCard';
import { getCoursesForCounsellorByCounsellorId } from '@/api/course';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type SubTab = 'Test Series' | 'Courses';

type CourseTabProps = {
  user: any,
  token: string;
}



export default function CourseTab(props: CourseTabProps) {
  const { user: _user, token: _token } = props;
  const { role, userId } = useAuthStore();
  const navigate = useNavigate();
  const [createCourse, setCreateCourse] = useState(false);
  
  // Persist active tab in localStorage
  const [activeTab, setActiveTab] = useState<SubTab>(() => {
    const savedTab = localStorage.getItem('counsellorCoursesActiveTab');
    return (savedTab as SubTab) || 'Courses';
  });
  
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ testSeriesId: string; testName: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('counsellorCoursesActiveTab', activeTab);
  }, [activeTab]);

  const { data: coursesData, isLoading, error } = useQuery({
    queryKey: ["counsellorCourses", userId],
    queryFn: () => getCoursesForCounsellorByCounsellorId(userId as string),
    enabled: !!userId,
  });

  const { data: testSeriesData, isLoading: isLoadingTests, error: testsError, refetch: refetchTests } = useQuery({
    queryKey: ["counsellorTestSeries", userId],
    queryFn: async () => {
      const token = localStorage.getItem("jwt");
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const response = await fetch(
        `https://procounsellor-backend-1000407154647.asia-south1.run.app/api/testSeries/getAllTestSeriesForCounsellor?counsellorId=${userId}`,
        { method: "GET", headers: myHeaders }
      );
      return response.json();
    },
    enabled: !!userId && activeTab === 'Test Series',
  });

  const TABS: SubTab[] = ['Courses', 'Test Series'];

  const filteredCourses = coursesData?.data || []

  function onClose() {
    setCreateCourse(false);
  }

  const handleDeleteTest = async (testSeriesId: string) => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("jwt");
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Accept", "application/json");

      const response = await fetch(
        `https://procounsellor-backend-1000407154647.asia-south1.run.app/api/testSeries/deleteTestSeries?counsellorId=${userId}&testSeriesId=${testSeriesId}`,
        { method: "DELETE", headers: myHeaders, body: new FormData() }
      );
      
      const result = await response.json();
      if (result.status) {
        toast.success("Test series deleted successfully!");
        refetchTests();
      } else {
        toast.error(result.message || "Failed to delete test series");
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      toast.error("Error deleting test series. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation(null);
    }
  };

  const handleEditTest = async (testSeriesId: string) => {
    try {
      const token = localStorage.getItem("jwt");
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Accept", "application/json");

      const response = await fetch(
        `https://procounsellor-backend-1000407154647.asia-south1.run.app/api/testSeries/getTestSeriesByIdForCounsellor?counsellorId=${userId}&testSeriesId=${testSeriesId}`,
        { method: "GET", headers: myHeaders }
      );
      
      const result = await response.json();
      if (result.status && result.data) {
        navigate('/create-test', { state: { editMode: true, testData: result.data } });
      } else {
        toast.error("Failed to fetch test data");
      }
    } catch (error) {
      console.error("Error fetching test:", error);
      toast.error("Error loading test data. Please try again.");
    }
  };



  return (
    <div className="md:bg-white md:py-5 md:px-4 md:rounded-2xl md:border md:border-[#EFEFEF]">
      <div className="bg-white p-2 rounded-xl border border-[#EFEFEF] md:bg-transparent md:p-0 md:border-none md:mb-5">
      <div className='flex justify-between'>
          <div className="flex items-center gap-2">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-4 py-2 text-[12px] md:text-base font-medium rounded-full transition-colors duration-200 cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#E8E7F2] text-[#13097D]'
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate('/create-test')}
            className='flex bg-[#655E95] hover:bg-[#655E95]/90 rounded-2xl md:rounded-[0.75rem] cursor-pointer text-clip border text-xs py-2 lg:py-3 px-3 lg:px-6 text-white items-center justify-center lg:font-semibold'
          >
            Create Test
          </button>
          <button
            onClick={()=>setCreateCourse(true)}
            className='flex bg-[#655E95] hover:bg-[#655E95]/90 rounded-2xl md:rounded-[0.75rem] cursor-pointer text-clip border text-xs py-2 lg:py-3 px-3 lg:px-6 text-white items-center justify-center lg:font-semibold'
          >
            Create a Course
          </button>
        </div>
      </div>

      </div>

      {activeTab === 'Test Series' ? (
        isLoadingTests ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#13097D]" />
          </div>
        ) : testsError ? (
          <div className="text-center py-16 text-red-500">
            {(testsError as Error).message || 'Failed to load test series'}
          </div>
        ) : testSeriesData?.data?.length > 0 ? (
          <div className="grid gap-2 grid-cols-2 md:grid-col-4 lg:grid-cols-5 mt-2">
            {testSeriesData.data.map((test: any) => (
              <div key={test.testSeriesId} className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow border border-[#E8EAED]">
                <div className="relative">
                  {test.bannerImagUrl ? (
                    <img src={test.bannerImagUrl} alt={test.testName} className="w-full h-32 object-cover" />
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {test.priceType === 'PAID' && (
                      <span className="text-xs px-2 py-1 bg-white/90 backdrop-blur-sm text-purple-700 rounded-full font-semibold shadow-sm">₹{test.price}</span>
                    )}
                    {test.priceType === 'FREE' && (
                      <span className="text-xs px-2 py-1 bg-white/90 backdrop-blur-sm text-green-700 rounded-full font-semibold shadow-sm">FREE</span>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-(--text-app-primary) mb-1 line-clamp-2 min-h-[2.5rem]">{test.testName}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">{test.stream}</span>
                    <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-md">{test.testType}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditTest(test.testSeriesId)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-(--btn-primary) text-white rounded-lg hover:opacity-90 transition-all text-xs font-medium cursor-pointer"
                      title="Edit Test"
                    >
                      <Pencil className="w-3 h-3" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => navigate(`/add-question/${test.testSeriesId}`)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium cursor-pointer"
                      title="Add Questions"
                    >
                      <Plus className="w-3 h-3" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirmation({ testSeriesId: test.testSeriesId, testName: test.testName })}
                      className="flex items-center justify-center py-1.5 px-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                      title="Delete Test"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            No test series created yet.
          </div>
        )
      ) : (
        isLoading ? (
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
                    courseTimeHours: (course as any).courseTimeHours || 0,
                    courseTimeMinutes: (course as any).courseTimeMinutes || 0,
                  }} 
                  role={role || "counselor"}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            No courses created yet.
          </div>
        )
      )}

      {createCourse && <CreateCourseCard onClose={onClose}/>}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-xl font-semibold text-(--text-app-primary) mb-4">
              Delete Test Series
            </h2>
            <p className="text-(--text-muted) mb-6">
              Are you sure you want to delete "<strong>{deleteConfirmation.testName}</strong>"? This action cannot be undone and will delete all questions associated with this test.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmation(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg border border-[#E9EBEC] text-(--text-app-primary) hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTest(deleteConfirmation.testSeriesId)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}