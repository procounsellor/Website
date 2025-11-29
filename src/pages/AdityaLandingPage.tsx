import { useState } from "react";
import { useAuthStore } from "@/store/AuthStore";
import { updateUserProfile } from "@/api/user";
import { buyCourse } from "@/api/course";
import EditProfileModal from "@/components/student-dashboard/EditProfileModal";
import AddFundsPanel from "@/components/student-dashboard/AddFundsPanel";
import CourseEnrollmentPopup from "@/components/landing-page/CourseEnrollmentPopup";
import FAQ from "@/components/landing-page/FAQ";
import { Carousel } from "@/components/landing-page/Carousel";
import { GuidanceSection } from "@/components/landing-page/GuidanceSection";
import toast from "react-hot-toast";
import startRecharge from "@/api/wallet";

declare global {
  interface Window {
    Razorpay: unknown;
  }
}
type RazorpayConstructor = new (opts: unknown) => { open: () => void };

const COURSE_ID = "a997f3a9-4a36-4395-9f90-847b739fb225";
const COURSE_NAME = "MHT-CET Mastery Course";
const COURSE_PRICE = 1999;

export default function LandingPage() {
  const { user, userId, isAuthenticated, toggleLogin, refreshUser } = useAuthStore();
  const token = localStorage.getItem("jwt");

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Razorpay recharge handler
  const handleRecharge = async (amount: number) => {
    if (!amount || amount <= 0) {
      console.error("A valid amount is required.");
      return;
    }
    try {
      const order = await startRecharge(user?.userName ?? "", amount);
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
          try {
            await refreshUser(true);
            setAddFundsOpen(false);
            // Retry enrollment after successful recharge
            setTimeout(() => {
              handleEnroll(requiredAmount);
            }, 500);
          } catch (err) {
            console.error("Failed to refresh user balance after payment.", err);
          }
        },
        modal: {
          ondismiss: function () {
            console.log("Razorpay modal dismissed.");
          },
        },
        theme: { color: "#3399cc" },
      };
      const Rz = (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay;
      const rzp = new Rz(options);
      rzp.open();
    } catch (error) {
      console.error("Failed to initiate Razorpay order.", error);
      toast.error("Could not start the payment process. Please try again later.");
    }
  };

  // Purchase course function
  const purchaseCourse = async (price: number) => {
    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Processing your enrollment...");

    try {
      const response = await buyCourse({
        userId: userId,
        courseId: COURSE_ID,
        counsellorId: "",
        price: price,
      });

      if (response.status) {
        toast.success("Course purchased successfully!", { id: toastId });
        await refreshUser(true);
        setShowSuccessPopup(true);
      } else {
        throw new Error(response.message || "Failed to purchase course");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error((error as Error).message || "Failed to purchase course", {
        id: toastId,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Main enrollment handler with all checks
  const handleEnroll = (amount: number) => {
    const enrollAction = async () => {
      const freshUserId = localStorage.getItem("phone");
      const freshUser = useAuthStore.getState().user;

      if (!freshUserId || !freshUser) {
        toast.error("Could not get user details. Please try again.");
        return;
      }

      // Check wallet balance
      const walletBalance = freshUser.walletAmount || 0;
      if (walletBalance < amount) {
        const deficit = amount - walletBalance;
        toast.error(
          `Insufficient balance. You need ₹${amount} but have ₹${walletBalance}. Please add at least ₹${deficit}.`
        );
        setRequiredAmount(amount);
        setAddFundsOpen(true);
        return;
      }

      // All checks passed - purchase course
      await purchaseCourse(amount);
    };

    // Check 1: User must be logged in
    if (!isAuthenticated) {
      toggleLogin(enrollAction);
      return;
    }

    // Check 2: Profile must be complete
    if (!user?.firstName || !user?.email) {
      handleProfileIncomplete(enrollAction);
      return;
    }

    // All checks passed
    enrollAction();
  };

  return (
    <div className="mx-auto mt-1 md:mt-20">
      {/* Mobile version */}
      <div className="block md:hidden w-full h-full bg-[#F5F7FA] p-5 mt-14">
        <div className="w-full max-w-sm p-3 bg-white rounded-[12px] border border-[#EFEFEF]">
          <div>
            <div className="relative flex gap-3">
              <div className="bg-[#E3E1EF] w-21 h-21 rounded-xl">
                <img src="/adityam.svg" alt="" className="absolute bottom-4 left-0" />
              </div>

              <div className="flex flex-col gap-1.5">
                <h1 className="flex flex-col text-[0.875rem] font-semibold text-[#343C6A]">
                  GuruCool Crash Course for <span>MHT-CET 2026 | Aaditya Coep</span>
                </h1>

                <img src="/ratingandduration.svg" alt="" />

                <p className="flex gap-2 items-center">
                  <img src="/2999.svg" alt="" className="h-[15px]" />
                  <span className="text-[1rem] text-[#232323] font-semibold">
                    ₹{COURSE_PRICE.toLocaleString("en-IN")}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleEnroll(COURSE_PRICE)}
            disabled={isProcessing}
            className="w-full bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-[12px] text-white font-medium text-[14px] py-2.5 mt-3.5 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isProcessing ? "Processing..." : "Enroll Now"}
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
                disabled={isProcessing}
                className="text-white text-[0.875rem] font-medium bg-[#13097D] hover:bg-[#0d0659] active:bg-[#0a0447] py-2.5 px-10 rounded-[5px] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
              >
                {isProcessing ? "Processing..." : "Enroll Now"}
              </button>
              <p className="flex gap-2 items-center">
                <img src="/2999.svg" alt="" className="h-5" />
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

      {/* Profile Completion Modal */}
      {user && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={handleCloseModal}
          user={user}
          onUpdate={handleUpdateProfile}
          onUploadComplete={() => {}}
        />
      )}

      {/* Add Funds Panel */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          addFundsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <AddFundsPanel
          isOpen={addFundsOpen}
          onClose={() => setAddFundsOpen(false)}
          balance={user?.walletAmount ?? 0}
          onAddMoney={handleRecharge}
        />
      </div>

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
