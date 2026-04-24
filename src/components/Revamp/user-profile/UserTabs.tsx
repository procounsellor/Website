import { useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/AuthStore";
import { getUserAppointments } from "@/api/appointment";
import { getUserReviews } from "@/api/review";
import { getBoughtCourses, getBookmarkedCourses } from "@/api/course";
import { getSubscribedCounsellors, getFavouriteCounsellors } from "@/api/counsellor";
import { getUserBoughtTestGroups, getUserBookmarkedTestGroups } from "@/api/testGroup";
import FancyCard from "@/components/Revamp/admissions/counsellor/counsellorCard";
import CourseCard from "@/components/Revamp/courses/CourseCard";
import TestGroupCard from "@/components/Revamp/courses/TestGroupCard";
import ReviewCard from "@/components/Revamp/user-profile/ReviewCard";
import OldTransactionsTab from "@/components/student-dashboard/TransactionsTab";
import type { CourseType } from "@/types/course";
import type { Transaction } from "@/types/user";
import { Loader2 } from "lucide-react";

// Helper to format currency
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const tabs = [
  { title: "My Info", id: 1 },
  { title: "Appointments", id: 2 },
  { title: "Counsellor", id: 3 },
  { title: "My Courses", id: 5 },
  { title: "My Tests", id: 6 },
  { title: "Transaction", id: 4 },
  { title: "My Reviews", id: 7 },
];
export default function UserTabs() {
  const [searchParams] = useSearchParams();
  const urlTab = searchParams.get('activeTab');
  const initialTabId = urlTab ? (tabs.find(t => t.title === urlTab)?.id ?? 1) : 1;
  const [active, setActive] = useState(initialTabId);
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <div
      className="relative bg-white rounded-2xl w-232 h-153.75 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 6)}
    >
      <div
        className={`sticky top-0 z-10 px-6 w-full flex h-14.75 border-b border-[#E3E8F4] backdrop-blur-md transition-colors ${
          isScrolled ? "bg-[#C6DDF0]/75" : "bg-[#C6DDF0]/40"
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`relative flex hover:cursor-pointer pt-[1.38rem] justify-center pr-6 pl-3 items-center `}
          >
            <div
              className={`absolute bottom-0 left-0 right-0 h-0.75  ${active == tab.id ? "bg-(--text-main) rounded-t-[0.125rem]" : "bg-none"}`}
            ></div>
            {tab.title}
          </button>
        ))}
      </div>
      <div className="pt-6 px-6 pb-6">{renderTabContent(active)}</div>
    </div>
  );
}

function MyInfoTab() {
  const { user } = useAuthStore();
  const walletAmount = user?.walletAmount || 0;
  const totalCredit = (user?.transactions || []).filter((t: Transaction) => t.type === 'credit').reduce((sum: number, t: Transaction) => sum + (t.amount || 0), 0);
  const totalDebit = (user?.transactions || []).filter((t: Transaction) => t.type === 'debit').reduce((sum: number, t: Transaction) => sum + (t.amount || 0), 0);

  return (
    <div className="flex  flex-col items-start justify-center gap-6">
      <h1 className="text-(--text-main) text-[1rem] font-medium">
        About Yourself
      </h1>
      <InfoCard
        gap={3}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="27"
            height="18"
            viewBox="0 0 27 18"
            fill="none"
          >
            <path
              d="M26.6 5.37142C26.6 5.72532 26.3813 6.04241 26.0505 6.16804L24.6361 6.70906V13.0565C25.3973 13.3923 25.8885 14.1458 25.8886 14.9777V17.0438C25.8886 17.5144 25.5071 17.8958 25.0366 17.8958H22.536C22.0654 17.8958 21.684 17.5144 21.684 17.0438V14.9777C21.6828 14.1477 22.1726 13.3955 22.9321 13.0607V7.36084L21.1216 8.05096L19.4176 8.70275L14.8211 10.4621C13.8417 10.8364 12.7588 10.8364 11.7794 10.4621L7.1829 8.70274L5.4789 8.05096L0.550071 6.16804C0.110109 6.00116 -0.111268 5.50922 0.0556105 5.06926C0.142084 4.84128 0.322091 4.66127 0.550071 4.5748L11.7794 0.280715C12.7588 -0.0935718 13.8417 -0.0935718 14.8211 0.280715L26.0505 4.5748C26.3813 4.70044 26.6 5.01752 26.6 5.37142ZM14.8211 12.1661C13.8417 12.5404 12.7588 12.5404 11.7794 12.1661L7.1829 10.4067L5.4789 9.75497V13.3163C5.47768 13.6219 5.64024 13.9048 5.9049 14.0576C8.19061 15.243 10.7255 15.868 13.3003 15.8809C15.8747 15.8693 18.4095 15.2458 20.6956 14.0618C20.9603 13.909 21.1228 13.6262 21.1216 13.3206V9.75497L19.4176 10.4067L14.8211 12.1661Z"
              fill="#0E1629"
            />
          </svg>
        }
        title="Preferred Course"
      >
        <div className="flex items-start">
          <p className="flex items-start justify-start flex-col gap-1 text-(--text-muted) font-medium text-[1rem]">
            {user?.interestedCourse || 'Not specified'}
          </p>
        </div>
      </InfoCard>

      <InfoCard
        gap={3}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
          >
            <g clip-path="url(#clip0_230_915)">
              <path
                d="M21.4247 5.40889C23.3524 7.33638 24.455 9.93803 24.4992 12.6637C24.5434 15.3894 23.5258 18.0254 21.6616 20.0144L21.4247 20.2594L16.4746 25.2084C15.8465 25.8361 15.0032 26.2016 14.1157 26.2308C13.2282 26.2601 12.3628 25.9509 11.6947 25.3659L11.5267 25.2084L6.5754 20.2582C4.60625 18.2891 3.5 15.6184 3.5 12.8336C3.5 10.0488 4.60625 7.37804 6.5754 5.40889C8.54454 3.43975 11.2153 2.3335 14.0001 2.3335C16.7849 2.3335 19.4556 3.43975 21.4247 5.40889ZM14.0001 9.33356C13.5404 9.33356 13.0853 9.42409 12.6607 9.59998C12.236 9.77587 11.8502 10.0337 11.5252 10.3587C11.2002 10.6837 10.9424 11.0695 10.7665 11.4942C10.5906 11.9188 10.5001 12.3739 10.5001 12.8336C10.5001 13.2932 10.5906 13.7483 10.7665 14.173C10.9424 14.5976 11.2002 14.9834 11.5252 15.3084C11.8502 15.6334 12.236 15.8912 12.6607 16.0671C13.0853 16.243 13.5404 16.3336 14.0001 16.3336C14.9283 16.3336 15.8186 15.9648 16.4749 15.3084C17.1313 14.6521 17.5001 13.7618 17.5001 12.8336C17.5001 11.9053 17.1313 11.0151 16.4749 10.3587C15.8186 9.70231 14.9283 9.33356 14.0001 9.33356Z"
                fill="#0E1629"
              />
            </g>
            <defs>
              <clipPath id="clip0_230_915">
                <rect width="28" height="28" fill="white" />
              </clipPath>
            </defs>
          </svg>
        }
        title="Preferred States"
      >
        <div className="flex items-start">
          <p className="flex items-start justify-start flex-col gap-1 text-(--text-muted) font-medium text-[1rem]">
            {(user?.userInterestedStateOfCounsellors && user.userInterestedStateOfCounsellors.length > 0)
              ? user.userInterestedStateOfCounsellors.map((state: string) => <span key={state}>{state}</span>)
              : 'Not specified'}
          </p>
        </div>
      </InfoCard>
      <InfoCard
        gap={1}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.83333 7.29102C4.98243 7.29102 4.16638 7.62904 3.5647 8.23071C2.96302 8.83239 2.625 9.64845 2.625 10.4993V20.9993C2.625 21.8503 2.96302 22.6663 3.5647 23.268C4.16638 23.8697 4.98243 24.2077 5.83333 24.2077H22.1667C23.0176 24.2077 23.8336 23.8697 24.4353 23.268C25.037 22.6663 25.375 21.8503 25.375 20.9993V10.4993C25.375 9.64845 25.037 8.83239 24.4353 8.23071C23.8336 7.62904 23.0176 7.29102 22.1667 7.29102H5.83333ZM19.25 14.291C18.8632 14.291 18.4923 14.4447 18.2188 14.7182C17.9453 14.9916 17.7917 15.3626 17.7917 15.7493C17.7917 16.1361 17.9453 16.5071 18.2188 16.7805C18.4923 17.054 18.8632 17.2077 19.25 17.2077C19.6368 17.2077 20.0077 17.054 20.2812 16.7805C20.5547 16.5071 20.7083 16.1361 20.7083 15.7493C20.7083 15.3626 20.5547 14.9916 20.2812 14.7182C20.0077 14.4447 19.6368 14.291 19.25 14.291Z"
              fill="#0E1629"
            />
            <path
              d="M19.2325 3.57868C19.5779 3.48663 19.9399 3.47518 20.2904 3.54521C20.641 3.61524 20.9708 3.76489 21.2543 3.98259C21.5379 4.2003 21.7676 4.48024 21.9258 4.80082C22.084 5.1214 22.1664 5.47404 22.1667 5.83152H10.5L19.2325 3.57868Z"
              fill="#0E1629"
            />
          </svg>
        }
        title="Wallet Balance"
      >
        <div>
          <h1 className="flex text-[#28A745] text-[2.25rem] font-medium">
            {/* <img src="/coin.svg" alt="procoin_icon" className=""/> */}
            {`₹${formatCurrency(walletAmount)}`}
          </h1>
          <div className="flex gap-15">
            <div className="flex items-center gap-3">
              <svg
                width="47"
                height="47"
                viewBox="0 0 47 47"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="47" height="47" rx="12" fill="#E30004" />
                <path
                  d="M28.4497 18.5493L18.5502 28.4488M28.4497 18.5493V27.0346M28.4497 18.5493H19.9644"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p className="text-[#E30004] text-[1.25rem] font-medium">
                -₹{formatCurrency(totalDebit)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <svg
                width="47"
                height="47"
                viewBox="0 0 47 47"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="47"
                  y="47"
                  width="47"
                  height="47"
                  rx="12"
                  transform="rotate(180 47 47)"
                  fill="#28A745"
                />
                <path
                  d="M18.5503 28.4507L28.4498 18.5512M18.5503 28.4507V19.9654M18.5503 28.4507H27.0356"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p className="text-[#28A745] font-medium text-[1.25rem] font-montserrat">
                +₹{formatCurrency(totalCredit)}
              </p>
            </div>
          </div>
        </div>
      </InfoCard>
    </div>
  );
}

interface infoTitle {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
  gap: Number;
}

function InfoCard({ icon, title, children, gap }: infoTitle) {
  return (
    <div
      className={`flex  flex-col gap-${gap} w-full bg-white border border-[#efefef] p-4 rounded-[0.75rem]`}
    >
      <div className="flex justify-start items-center gap-2">
        {icon}
        <h3 className="text-(--text-main) font-semibold text-xl">{title}</h3>
      </div>

      <div>{children}</div>
    </div>
  );
}

const counsellor_tabs = [
  { title: "Subscribed", id: 1 },
  { title: "Favourite", id: 2 },
];

function CounsellorsTab() {
  const [active, setActive] = useState(1);
  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');

  const { data: subscribedCounsellors = [], isLoading: loadingSub } = useQuery({
    queryKey: ['subscribedCounsellors', userId],
    queryFn: () => getSubscribedCounsellors(userId!, token!),
    enabled: !!userId && !!token,
  });
  const { data: favouriteCounsellors = [], isLoading: loadingFav } = useQuery({
    queryKey: ['favouriteCounsellors', userId],
    queryFn: () => getFavouriteCounsellors(userId!, token!),
    enabled: !!userId && !!token,
  });

  const counsellorsToDisplay = active === 1 ? subscribedCounsellors : favouriteCounsellors;
  const isLoading = active === 1 ? loadingSub : loadingFav;

  return (
    <div className="flex flex-col items-start">
      <div className="flex gap-1">
        {counsellor_tabs.map((tab) => (
          <div
            key={tab.id}
            className={`hover:cursor-pointer px-4 flex  items-center py-2.5  rounded-3xl text-[1rem] ${active == tab.id ? "bg-[rgba(14,22,41,0.10)] text-(--text-main) font-normal" : "bg-none text-(--text-muted) font-normal "}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.title}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-6">
        {isLoading ? (
          <div className="flex justify-center w-full py-10"><Loader2 className="w-8 h-8 animate-spin text-[#13097D]" /></div>
        ) : counsellorsToDisplay.length > 0 ? (
          counsellorsToDisplay.map((card: any) => (
            <FancyCard
              key={card.counsellorId}
              counsellorId={card.counsellorId}
              name={card.counsellorFullName || card.name || 'Counsellor'}
              imageUrl={card.counsellorPhootoSmall || card.imageUrl || '/counsellor.png'}
              rating={card.rating || 0}
              experience={card.experience || ''}
              city={card.city || ''}
              proCoins={card.proCoins || 0}
            />
          ))
        ) : (
          <p className="text-(--text-muted)">No counsellors found.</p>
        )}
      </div>
    </div>
  );
}

function Transaction() {
  const { user } = useAuthStore();
  return (
    <OldTransactionsTab
      transactions={user?.transactions || []}
      offlineTransactions={user?.offlineTransactions || []}
    />
  );
}

const course_tabs = [
  { title: "Purchased", id: 1 },
  { title: "Saved", id: 2 },
];

function MyCourse() {
  const [active, setActive] = useState(1);
  const { userId } = useAuthStore();

  const { data: purchasedData, isLoading: loadingPurchased } = useQuery({
    queryKey: ['boughtCourses', userId],
    queryFn: () => getBoughtCourses(userId as string),
    enabled: !!userId && active === 1,
  });
  const { data: bookmarkedData, isLoading: loadingBookmarked } = useQuery({
    queryKey: ['bookmarkedCourses', userId],
    queryFn: () => getBookmarkedCourses(userId as string),
    enabled: !!userId && active === 2,
  });

  const currentData = active === 1 ? purchasedData : bookmarkedData;
  const isLoading = active === 1 ? loadingPurchased : loadingBookmarked;
  const courses: CourseType[] = (currentData?.data || []).map((c: any) => ({
    id: c.courseId,
    name: c.courseName,
    subject: c.category,
    price: `₹${c.coursePriceAfterDiscount}`,
    image: c.courseThumbnailUrl,
    courseTimeHours: c.courseTimeHours || 0,
    courseTimeMinutes: c.courseTimeMinutes || 0,
  }));

  return (
    <div className="flex flex-col items-start">
      <div className="flex gap-1">
        {course_tabs.map((tab) => (
          <div
            key={tab.id}
            className={`hover:cursor-pointer px-4 flex  items-center py-2.5  rounded-3xl text-[1rem] ${active == tab.id ? "bg-[rgba(14,22,41,0.10)] text-(--text-main) font-normal" : "bg-none text-(--text-muted) font-normal "}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.title}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-6">
        {isLoading ? (
          <div className="flex justify-center w-full py-10"><Loader2 className="w-8 h-8 animate-spin text-[#13097D]" /></div>
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard
              key={course.id}
              isBaught={active === 1}
              isLoading={false}
              course={course}
            />
          ))
        ) : (
          <p className="text-(--text-muted)">No courses found.</p>
        )}
      </div>
    </div>
  );
}

function Reviews() {
  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['userReviews', userId],
    queryFn: () => getUserReviews(userId!, token!),
    enabled: !!userId && !!token,
  });

  return (
    <div>
      <h2 className="text-(--text-main) text-[1rem] font-medium mb-6">
        My Reviews
      </h2>
      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[#13097D]" /></div>
      ) : reviews.length > 0 ? (
        <div className="flex flex-col gap-4">
          {reviews.map((review: any) => (
            <ReviewCard key={review.reviewId} review={review} />
          ))}
        </div>
      ) : (
        <p className="text-(--text-muted)">No reviews yet</p>
      )}
    </div>
  );
}

const appointments_tabs = [
  { title: "All", id: 1 },
  { title: "Upcoming", id: 2 },
  { title: "Complete", id: 3 },
  { title: "Cancelled", id: 4 },
];

type AppointmentStatus = "completed" | "cancelled" | "upcoming" | "booked" | "rescheduled";

type AppointmentItem = {
  id: string;
  doctorName: string;
  sessionTitle: string;
  dateLabel: string;
  timeLabel: string;
  status: AppointmentStatus;
  photo?: string;
};

const appointments_type: Record<string, string> = {
  completed: "Completed",
  cancelled: "Cancelled",
  upcoming: "Upcoming",
  booked: "Upcoming",
  rescheduled: "Rescheduled",
};

function AppointmentsCard({ appointment }: { appointment: AppointmentItem }) {
  const statusStyles: Record<string, string> = {
    completed: "bg-[#28A7451A] text-[#28A745]",
    cancelled: "bg-[#EE1C1F1A] text-[#EE1C1F]",
    upcoming: "bg-[#13097D1A] text-[#13097D]",
    booked: "bg-[#13097D1A] text-[#13097D]",
    rescheduled: "bg-[#F2C94C1A] text-[#F2994A]",
  };

  return <div className="flex gap-[2.48rem] items-center">
        <div className="flex gap-2">
          <img
            src={appointment.photo || "/aditya.svg"}
            alt=""
            className="w-[5.0625rem] h-[5.0625rem] rounded-[0.5rem]"
          />
          <h1 className="text-(--text-main) font-semibold text-xl flex flex-col items-start justify-center gap-2">
            {appointment.doctorName}
            <span className="text-[1rem] font-medium text-(--text-muted)">
              {appointment.sessionTitle}
            </span>
          </h1>
        </div>

        <div className="">
          <h1 className="flex flex-col gap-2 items-start justify-center text-(--text-main) text-xl font-semibold">
            Date
            <span className="text-[1rem] font-medium text-(--text-muted)">
              {appointment.dateLabel}
            </span>
          </h1>
        </div>

        <div className="">
          <h1 className="flex flex-col gap-2 items-start justify-center text-(--text-main) text-xl font-semibold">
            Time
            <span className="text-[1rem] font-medium text-(--text-muted)">
              {appointment.timeLabel}
            </span>
          </h1>
        </div>

        <div
          className={`px-3 py-1 flex items-center justify-center font-semibold text-sm rounded-3xl ${statusStyles[appointment.status]}`}
        >
            {appointments_type[appointment.status]}
        </div>
      </div>;
}

function Appointments() {
  const [active, setActive] = useState(1);
  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['userAppointments', userId],
    queryFn: () => getUserAppointments(userId!, token!),
    enabled: !!userId && !!token,
    staleTime: 30000,
  });

  // Map API data to AppointmentItem format used by your card design
  const mappedAppointments: AppointmentItem[] = appointments.map((a: any) => {
    const status = a.status === 'booked' ? 'upcoming' : a.status;
    const dateObj = a.date ? new Date(a.date) : null;
    const dateLabel = dateObj
      ? dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'long' })
      : '';
    return {
      id: a.appointmentId || a.id,
      doctorName: a.counsellorFullName || a.counsellorId || '',
      sessionTitle: `${a.mode || ''} Session`,
      dateLabel,
      timeLabel: `${a.startTime || ''} - ${a.endTime || ''}`,
      status: status as AppointmentStatus,
      photo: a.counsellorPhootoSmall || '',
    };
  });

  const filteredAppointments = mappedAppointments.filter((appointment) => {
    if (active === 1) return true;
    if (active === 2) return appointment.status === "upcoming" || appointment.status === "booked" || appointment.status === "rescheduled";
    if (active === 3) return appointment.status === "completed";
    return appointment.status === "cancelled";
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-1">
        {appointments_tabs.map((tab) => (
          <div
            key={tab.id}
            className={`hover:cursor-pointer px-4 flex  items-center py-2.5  rounded-3xl text-[1rem] ${active == tab.id ? "bg-[rgba(14,22,41,0.10)] text-(--text-main) font-normal" : "bg-none text-(--text-muted) font-normal "}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.title}
          </div>
        ))}
      </div>

      <div className="mt-2 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[#13097D]" /></div>
        ) : filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <AppointmentsCard key={appointment.id} appointment={appointment} />
          ))
        ) : (
          <p className="text-(--text-muted)">No appointments in this filter.</p>
        )}
      </div>
    </div>
  );
}

const tests_tabs = [
  { title: "Purchased", id: 1 },
  { title: "Saved", id: 2 },
];

function MyTests() {
  const [active, setActive] = useState(1);
  const { userId } = useAuthStore();

  const { data: purchasedData, isLoading: loadingPurchased } = useQuery({
    queryKey: ['boughtTestGroups', userId],
    queryFn: () => getUserBoughtTestGroups(userId!),
    enabled: !!userId && active === 1,
  });
  const { data: bookmarkedData, isLoading: loadingBookmarked } = useQuery({
    queryKey: ['bookmarkedTestGroups', userId],
    queryFn: () => getUserBookmarkedTestGroups(userId!),
    enabled: !!userId && active === 2,
  });

  const currentData = active === 1 ? purchasedData : bookmarkedData;
  const isLoading = active === 1 ? loadingPurchased : loadingBookmarked;
  const testGroups = currentData?.data || [];

  return (
    <div className="flex flex-col items-start">
      <div className="flex gap-1">
        {tests_tabs.map((tab) => (
          <div
            key={tab.id}
            className={`hover:cursor-pointer px-4 flex  items-center py-2.5  rounded-3xl text-[1rem] ${active == tab.id ? "bg-[rgba(14,22,41,0.10)] text-(--text-main) font-normal" : "bg-none text-(--text-muted) font-normal "}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.title}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-6">
        {isLoading ? (
          <div className="flex justify-center w-full py-10"><Loader2 className="w-8 h-8 animate-spin text-[#13097D]" /></div>
        ) : testGroups.length > 0 ? (
          testGroups.map((test: any, index: number) => (
            <TestGroupCard
              key={test.testGroupId || `${test.testGroupName}-${index}`}
              testGroupId={test.testGroupId}
              image={test.bannerImagUrl || '/discover-exam.jpg'}
              rating={test.rating?.toFixed(1) || '0'}
              title={test.testGroupName || ''}
              description={test.testGroupDescription || ''}
              totalTests={test.attachedTestIds?.length || 0}
              totalStudents={test.soldCount || 0}
            />
          ))
        ) : (
          <p className="text-(--text-muted)">No test series found.</p>
        )}
      </div>
    </div>
  );
}

function renderTabContent(tabId: number) {
  switch (tabId) {
    case 1:
      return <MyInfoTab />;
    case 2:
      return <Appointments />;
    case 3:
      return <CounsellorsTab />;
    case 4:
      return <Transaction />;
    case 5:
      return <MyCourse />;
    case 6:
      return <MyTests />;
    case 7:
      return <Reviews />;
    default:
      return <MyInfoTab />;
  }
}
