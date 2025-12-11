import { useState } from "react";
import { useAuthStore } from "@/store/AuthStore";
import { updateUserProfile } from "@/api/user";
import { buyCourse, getBoughtCourses } from "@/api/course";
import EditProfileModal from "@/components/student-dashboard/EditProfileModal";
import CourseEnrollmentPopup from "@/components/landing-page/CourseEnrollmentPopup";
import FAQ from "@/components/landing-page/FAQ";
import { Carousel } from "@/components/landing-page/Carousel";
import { GuidanceSection } from "@/components/landing-page/GuidanceSection";
import toast from "react-hot-toast";
import startRecharge from "@/api/wallet";
import { useQuery } from '@tanstack/react-query';

declare global {
  interface Window {
    Razorpay: unknown;
  }
}
type RazorpayConstructor = new (opts: unknown) => { open: () => void };

const COURSE_ID = "a997f3a9-4a36-4395-9f90-847b739fb225";
const COURSE_NAME = "MHT-CET Mastery Course";
const COURSE_PRICE = 2499;

export default function LandingPage() {
  const { user, userId, isAuthenticated, toggleLogin, refreshUser } = useAuthStore();
  const token = localStorage.getItem("jwt");

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: boughtCoursesData, isLoading: isLoadingBought } = useQuery({
    queryKey: ['boughtCourses', userId],
    queryFn: () => getBoughtCourses(userId as string),
    enabled: !!userId && isAuthenticated,
    staleTime: 5000, 
  });
  const isCoursePurchased = boughtCoursesData?.data?.some(
    (course) => course.courseId === COURSE_ID
  ) ?? false;
  
  const isButtonDisabled = isProcessing || isLoadingBought || isCoursePurchased;

  const handleProfileIncomplete = (action: () => void) => {
    setPendingAction(() => action);
    setIsEditProfileModalOpen(true);
  };

  const handleUpdateProfile = async (updatedData: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    if (!userId || !token) {
      throw new Error("User not authenticated");
    }
    await updateUserProfile(userId, updatedData, token);
    await refreshUser(true);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleCloseModal = () => {
    setIsEditProfileModalOpen(false);
    setPendingAction(null);
  };

  // Direct Razorpay payment for course purchase
  const handleDirectPayment = async (amount: number) => {
    // Get fresh user data
    const freshUser = useAuthStore.getState().user;
    const freshUserId = localStorage.getItem("phone");

    if (!freshUser?.userName || !freshUserId) {
      toast.error("User information not found. Please try logging in again.");
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading("Initiating payment...");

    try {
      // Create Razorpay order
      const order = await startRecharge(freshUser.userName, amount);
      
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "ProCounsel",
        description: `${COURSE_NAME} - Course Enrollment`,
        prefill: {
          contact: freshUser.phoneNumber || freshUserId || "",
          email: freshUser.email || "",
          name: freshUser.firstName ? `${freshUser.firstName} ${freshUser.lastName || ""}`.trim() : "",
        },
        notes: { 
          userId: freshUser.userName,
          courseId: COURSE_ID,
          courseName: COURSE_NAME,
        },
        handler: async function (response: any) {
          toast.dismiss(loadingToast);
          console.log("Payment successful:", response);
          
          // Now purchase the course
          const purchaseToast = toast.loading("Enrolling you in the course...");
          
          try {
            const purchaseResponse = await buyCourse({
              userId: freshUser.userName,
              courseId: COURSE_ID,
              counsellorId: "",
              price: amount,
            });

            if (purchaseResponse.status) {
              toast.success("Enrollment successful!", { id: purchaseToast });
              await refreshUser(true);
              setShowSuccessPopup(true);
            } else {
              throw new Error(purchaseResponse.message || "Failed to enroll in course");
            }
          } catch (error) {
            console.error("Course purchase error:", error);
            toast.error(
              (error as Error).message || "Payment succeeded but enrollment failed. Please contact support.",
              { id: purchaseToast }
            );
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            console.log("Razorpay payment dismissed");
            toast.dismiss(loadingToast);
            setIsProcessing(false);
          },
        },
        theme: { color: "#13097D" },
      };

      const Rz = (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay;
      const rzp = new Rz(options);
      
      rzp.open();
      toast.dismiss(loadingToast);
      
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      toast.error("Could not start payment process. Please try again.", { id: loadingToast });
      setIsProcessing(false);
    }
  };

  // Enrollment handler with login and name checks (email not required)
  const handleEnroll = async (amount: number) => {
    if (isCoursePurchased) {
      toast.error("You are already enrolled in this course.");
      return;
    }
    const enrollAction = async () => {
      // Refresh user data after login
      console.log("Login successful, refreshing user data...");
      await refreshUser(true);
      
      // Get fresh user data
      const freshUser = useAuthStore.getState().user;
      
      // Check if name is provided (email not required)
      if (!freshUser?.firstName) {
        console.log("Name missing, showing profile modal...");
        handleProfileIncomplete(async () => {
          await handleDirectPayment(amount);
        });
        return;
      }
      
      // Small delay to ensure state is updated
      setTimeout(async () => {
        console.log("Opening payment...");
        await handleDirectPayment(amount);
      }, 300);
    };

    // Check if user is logged in
    if (!isAuthenticated) {
      // Set flag to skip onboarding (course/state selection) for this landing page
      const { setIsCounselorSignupFlow } = useAuthStore.getState();
      setIsCounselorSignupFlow(true);
      
      toggleLogin(enrollAction);
      return;
    }

    // Check if name is provided (email not required)
    if (!user?.firstName) {
      handleProfileIncomplete(async () => {
        await handleDirectPayment(amount);
      });
      return;
    }

    // User is logged in and has name, open payment directly
    await handleDirectPayment(amount);
  };

  return (
    <div className="mx-auto mt-1 md:mt-20">
      {/* Mobile version */}
      <div className="block md:hidden w-full h-full bg-[#F5F7FA] p-5 mt-14">
        <div className="w-full max-w-sm p-3 bg-white rounded-[12px] border border-[#EFEFEF]">
          <div>
            <div className="flex gap-3">
              <div className="bg-[#E3E1EF] w-21 h-21 rounded-xl">
                <img src="/adityam.svg" alt="" className="" />
              </div>

              <div className="flex flex-col gap-1.5">
                <h1 className="flex flex-col text-[0.875rem] font-semibold text-[#343C6A]">
                  GuruCool Crash Course for <span>MHT-CET 2026 | Aaditya Coep</span>
                </h1>

                <img src="/ratingandduration.svg" alt="" />

                <p className="flex gap-2 items-center">
                  <img src="/4,999.svg" alt="" className="h-[15px]" />
                  <span className="text-[1rem] text-[#232323] font-semibold">
                    ₹{COURSE_PRICE.toLocaleString("en-IN")}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleEnroll(COURSE_PRICE)}
            disabled={isButtonDisabled}
            className="w-full bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-[12px] text-white font-medium text-[14px] py-2.5 mt-3.5 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoadingBought 
              ? "Checking enrollment..." 
              : isCoursePurchased
                ? "Already Enrolled"
                : isProcessing
                  ? "Processing..." 
                  : "Enroll Now"}
          </button>

          <hr className="h-px bg-#EFEFEF mt-4 mb-2" />

          <div>
            <h1 className="text-[0.875rem] font-semibold text-[#343C6A]">
              Course Description
            </h1>
            <p className="text-xs font-normal text-[#8C8CA1]">
              The course is structured to ensure fast learning, solid revision, and maximum
              marks with minimum confusion.
            </p>
          </div>
        </div>
      </div>

      {/* Desktop version */}
      <div className="hidden md:block w-full h-[34.313rem] bg-[#13097D1F] md:p-5 font-sans">
        <div className="flex justify-between max-w-7xl h-[24.313rem] bg-white rounded-2xl mx-auto mt-16 px-10 pt-10">
          <div className="flex flex-col gap-3">
            <h1 className="flex flex-col text-[#13097D] font-semibold md:text-3xl lg:text-[2rem]">
              GuruCool Crash Course for MHT-CET <span>2026 | Aaditya Coep</span>
            </h1>
            <p className="flex flex-col text-[#232323] text-[1rem] font-medium">
              The course is structured to ensure fast learning, solid revision, and{" "}
              <span>maximum marks with minimum confusion.</span>
            </p>

            <div className="flex gap-5">
              <div className="flex flex-col">
                <p className="flex gap-2 items-center">
                  <img src="/star.svg" alt="" />{" "}
                  <span className="text-[#13097D] text-[1.25rem] font-semibold">4.7</span>
                </p>
                <span className="text-[1rem] font-medium text-[#232323]">Course Rating</span>
              </div>
              <div className="flex flex-col">
                <p className="text-[#13097D] text-[1.25rem] font-semibold">4 Months</p>
                <span className="text-[1rem] font-medium text-[#232323]">Course Duration</span>
              </div>
            </div>

            <div className="flex gap-3 pt-5">
              <button
            onClick={() => handleEnroll(COURSE_PRICE)}
            disabled={isButtonDisabled} 
            className="w-full bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-[12px] text-white font-medium text-[14px] py-2.5 mt-3.5 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoadingBought 
              ? "Checking enrollment..." 
              : isCoursePurchased
                ? "Already Enrolled"
                : isProcessing
                  ? "Processing..." 
                  : "Enroll Now"}
          </button>
              <p className="flex gap-2 items-center">
                <img src="/4,999.svg" alt="" className="h-5" />
                <span className="text-[1.25rem] font-semibold text-[#232323]">
                  ₹{COURSE_PRICE.toLocaleString("en-IN")}
                </span>
              </p>
            </div>
          </div>

          <div>
            <div className="w-75 h-[17.313rem] bg-[#E3E1EF] rounded-[12px]">
              <img src="/aditya.svg" alt="" />
            </div>
          </div>
        </div>
      </div>

      <Carousel />
      <GuidanceSection />
      <FAQ />

      {/* Profile Modal - Email optional on /gurucool route */}
      {user && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={handleCloseModal}
          user={user}
          onUpdate={handleUpdateProfile}
          onUploadComplete={() => {}}
          isMandatory={true}
        />
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <CourseEnrollmentPopup
          courseName={COURSE_NAME}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </div>
  );
}
