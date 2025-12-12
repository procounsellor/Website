import ContentCard from "@/components/course-cards/ContentCard";
import CourseReviewsCard from "@/components/course-cards/CourseReviewsCard";
import DetailsCard from "@/components/course-cards/DetailsCard";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getCounsellorCourseByCourseId, 
  getCounsellorCourseForUserByCourseId,
  bookmarkCourse,
  buyCourse
} from "@/api/course";
import { useAuthStore } from "@/store/AuthStore";
import { Loader2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import AddFundsPanel from '@/components/student-dashboard/AddFundsPanel';
import startRecharge from '@/api/wallet';

declare global {
  interface Window {
    Razorpay: unknown;
  }
}
type RazorpayConstructor = new (opts: unknown) => { open: () => void };

export default function CoursePage() {
  const { courseId, role: roleParam } = useParams();
  const { userId, user, role: userRole } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [currentPath, setCurrentPath] = useState<string[]>(['root']);
  const [addFundsOpen, setAddFundsOpen] = useState(false);

  // Use actual user role from auth store, fallback to route param
  const role = userRole || roleParam || 'user';
  const isCounselor = role === 'counselor';
  const isUserOrStudent = role === 'user' || role === 'student';

  const { data: courseDetails, isLoading, error } = useQuery({
    queryKey: ["courseDetails", courseId, userId, role],
    queryFn: async () => {
      console.log('Fetching course details:', { courseId, userId, role, isCounselor, isUserOrStudent });
      if (isCounselor && userId) {
        return getCounsellorCourseByCourseId(userId as string, courseId as string);
      } else if (isUserOrStudent) {
        const effectiveUserId = userId || 'guest';
        return getCounsellorCourseForUserByCourseId(effectiveUserId, courseId as string);
      }
      throw new Error('Unauthorized access');
    },
    enabled: !!courseId,
    retry: 1,
  });

  const isBookmarked = courseDetails?.bookmarkedByMe === true;
  const isPurchased = courseDetails?.purchasedByMe === true;

  const bookmarkMutation = useMutation({
    mutationFn: () => bookmarkCourse({ userId: userId as string, courseId: courseId as string }),
    onSuccess: () => {
      toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
      queryClient.invalidateQueries({ queryKey: ['courseDetails', courseId, userId, role] });
      queryClient.invalidateQueries({ queryKey: ['bookmarkedCourses', userId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to bookmark course');
    },
  });

  const buyCourseMutation = useMutation({
    mutationFn: () => {
      if (!courseDetails) throw new Error('Course details not available');
      
      const price = courseDetails.coursePriceAfterDiscount || courseDetails.coursePrice || 0;
      const userBalance = courseDetails.userWalletAmount || 0;

      if (userBalance < price) {
        throw new Error('INSUFFICIENT_BALANCE');
      }
      
      return buyCourse({
        userId: userId as string,
        courseId: courseId as string,
        counsellorId: courseDetails.counsellorId || '',
        price: price,
      });
    },
    onSuccess: () => {
      toast.success('Course purchased successfully!');
      queryClient.invalidateQueries({ queryKey: ['courseDetails', courseId, userId, role] });
      queryClient.invalidateQueries({ queryKey: ['boughtCourses', userId] });
    },
    onError: (error: Error) => {
      if (error.message === 'INSUFFICIENT_BALANCE') {
        toast.error('Insufficient balance. Please add coins to your wallet.');
        setAddFundsOpen(true);
      } else {
        toast.error(error.message || 'Failed to purchase course');
      }
    },
  });

  const handleBookmark = () => {
    if (!user) {
      toast.error('Please sign in to bookmark courses');
      return;
    }
    bookmarkMutation.mutate();
  };

  const handleBuyCourse = () => {
    if (!user) {
      toast.error('Please sign in to purchase courses');
      return;
    }
    buyCourseMutation.mutate();
  };

  const handleBack = () => {
    const from = (location.state as any)?.from;
    if (from === 'courses') {
      navigate('/counsellor-dashboard', { state: { activeTab: 'courses' } });
    } else if (from === 'my-courses') {
      navigate('/dashboard-student', { state: { activeTab: 'My Courses' } });
    } else {
      navigate(-1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-[#13097D]" />
      </div>
    );
  }

  if (error) {
    console.error('Course details error:', error);
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 p-8">
        <p className="text-red-500 text-lg font-semibold">
          {(error as Error).message || 'Failed to load course details'}
        </p>
        <div className="text-sm text-gray-600">
          <p>CourseId: {courseId}</p>
          <p>UserId: {userId || 'Not logged in'}</p>
          <p>Role: {role}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#13097D] text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Course not found</p>
      </div>
    );
  }

  console.log('Course details loaded:', courseDetails);

  const course = {
    id: courseDetails?.courseId || '',
    name: courseDetails?.courseName || 'Untitled Course',
    subject: courseDetails?.category || 'General',
    price: (courseDetails?.coursePriceAfterDiscount || courseDetails?.coursePrice || 0).toString(),
    rating: courseDetails?.rating ? String(courseDetails.rating) : undefined,
    reviews: courseDetails?.counsellorCourseReviewResponse?.length 
      ? String(courseDetails.counsellorCourseReviewResponse.length)
      : undefined,
    image: courseDetails?.courseThumbnailUrl || '',
    isBookmarked: isBookmarked,
  };

  return (
    <div className="bg-[#F5F5F7] mt-20 p-6 md:mt-20">
      <div className="max-w-7xl mx-auto mb-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#13097D] hover:text-[#0d0659] font-medium transition-colors mb-4 hover:cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>
      
      <DetailsCard
        role={role as string}
        courseId={courseId as string}
        course={course}
        courseDetails={courseDetails}
        isPurchased={isPurchased}
        isBookmarked={isBookmarked}
        onBookmark={handleBookmark}
        onBuyCourse={handleBuyCourse}
        isBookmarking={bookmarkMutation.isPending}
        isBuying={buyCourseMutation.isPending}
        isUserOrStudent={isUserOrStudent && !!user && !!userId}
      />

      <div className="max-w-7xl mx-auto mt-6 py-4 mb-4">
        <h1 className="text-[1.25rem] text-[#343C6A] font-semibold mb-4">Course Description</h1>
        <p className="text-[1rem] font-normal text-[#8C8CA1]">
          {courseDetails.description}
        </p>
      </div>

      <div className="max-w-7xl mx-auto mb-6">
        <ContentCard 
          courseContents={courseDetails.courseContents}
          currentPath={currentPath}
          setCurrentPath={setCurrentPath}
          isPurchased={isPurchased || isCounselor}
          userRole={role as string}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <CourseReviewsCard 
          courseId={courseId as string}
          isPurchased={isPurchased || isCounselor}
          role={role as 'user' | 'student' | 'counselor'} 
          reviews={courseDetails.counsellorCourseReviewResponse}
          rating={courseDetails.rating}
          onReviewSubmitted={() => {
            queryClient.invalidateQueries({ queryKey: ['courseDetails', courseId, userId, role] });
          }}
        />
      </div>

      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${addFundsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <AddFundsPanel
          isOpen={addFundsOpen}
          onClose={() => setAddFundsOpen(false)}
          balance={user?.walletAmount ?? 0}
          onAddMoney={async (amount) => {
            if (!amount || amount <= 0) return;
            try {
              const order = await startRecharge(user?.userName ?? '', amount);
              const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                order_id: order.orderId,
                name: "ProCounsel Wallet",
                description: "Wallet Recharge",
                notes: { userId: user?.userName },
                handler: async function () {
                  toast.success("Payment successful. Your balance will be updated shortly.");
                  queryClient.invalidateQueries({ queryKey: ['user', userId] });
                  queryClient.invalidateQueries({ queryKey: ['courseDetails', courseId, userId, role] });
                  setAddFundsOpen(false);
                },
                modal: {
                  ondismiss: function() {
                    console.log('Razorpay modal dismissed.');
                  }
                },
                theme: { color: "#3399cc" },
              };
              const Rz = (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay;
              const rzp = new Rz(options);
              rzp.open();
            } catch (error) {
              console.error("Failed to initiate payment.", error);
              toast.error("Could not start the payment process.");
            }
          }}
        />
      </div>
    </div>
  );
}
