import type { CourseType } from "@/types/course";
import type { CourseDetails } from "@/api/course";
import { Bookmark } from "lucide-react";

type DetailsCardProps = {
  role: string;
  courseId: string;
  course: CourseType;
  courseDetails?: CourseDetails;
  isPurchased?: boolean;
  isBookmarked?: boolean;
  onBookmark?: () => void;
  onBuyCourse?: () => void;
  isBookmarking?: boolean;
  isBuying?: boolean;
  isUserOrStudent?: boolean;
};

function normalizeTime(courseHours = 0, courseMinutes = 0) {
  const MINUTES_IN_HOUR = 60;
  const HOURS_IN_DAY = 24;
  const DAYS_IN_MONTH = 30;
  const DAYS_IN_YEAR = 365;

  let totalMinutes = courseHours * MINUTES_IN_HOUR + courseMinutes;

  const minutes = totalMinutes % MINUTES_IN_HOUR;
  let totalHours = Math.floor(totalMinutes / MINUTES_IN_HOUR);

  const hours = totalHours % HOURS_IN_DAY;
  let totalDays = Math.floor(totalHours / HOURS_IN_DAY);

  const years = Math.floor(totalDays / DAYS_IN_YEAR);
  totalDays %= DAYS_IN_YEAR;

  const months = Math.floor(totalDays / DAYS_IN_MONTH);
  const days = totalDays % DAYS_IN_MONTH;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years}y`);
  if (months > 0) parts.push(`${months}m`);
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}min`);

  return parts.length > 0 ? parts.join(" ") : "0min";
}

export default function ({
  role,
  course,
  courseDetails,
  isPurchased,
  isBookmarked,
  onBookmark,
  onBuyCourse,
  isBookmarking,
  isBuying,
  isUserOrStudent,
}: DetailsCardProps) {
  const totalBought = courseDetails?.soldCount?.toString() || "0";
  const moneyEarned = courseDetails
    ? (
      (courseDetails.soldCount || 0) *
      (courseDetails.coursePriceAfterDiscount || 0)
    ).toString()
    : "0";

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-3">
        {/* Left: Image + Info */}
        <div className="flex gap-3 flex-1 min-w-0">
          <div className="relative shrink-0">
            <img
              src={course.image}
              alt=""
              className="w-24 h-24 md:w-30 md:h-30 rounded-lg object-cover"
            />
            {isUserOrStudent && onBookmark && (
              <button
                onClick={onBookmark}
                disabled={isBookmarking}
                className="absolute top-2 right-2 flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-md transition-colors hover:bg-black/50 hover:cursor-pointer"
                aria-label="Bookmark course"
              >
                <Bookmark
                  className={`h-3.5 w-3.5 md:h-4 md:w-4 text-white transition-colors ${isBookmarked ? "fill-current" : ""
                    }`}
                />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1 md:gap-1 justify-start min-w-0 flex-1">
            <h1 className="text-[#343C6A] text-[0.875rem] md:text-[1.25rem] font-semibold line-clamp-2 md:line-clamp-none leading-tight">
              {course.name}
            </h1>

            {/* {course.rating && course.reviews && (
                        <div className="flex gap-1.5 md:gap-2 items-center">
                            <span className="text-[#343C6A] font-medium text-sm md:text-base">{course.rating} <img src="/star.svg" alt="" /></span>
                            <span className="text-[#8C8CA1] text-xs md:text-sm">({course.reviews} reviews)</span>
                        </div>
                    )} */}

            {/* Badges - inline on desktop, below on mobile */}
            <div className="flex gap-1 md:gap-3 mt-1 flex-wrap">
              {courseDetails && totalBought && (
                <p className="bg-[#E1EDFA] rounded-[12px] px-2 py-1 flex items-center justify-center gap-1 max-h-7.5 font-medium text-[#226CBD] text-[0.5rem] md:text-sm w-fit">
                  <img
                    src="/people.svg"
                    alt=""
                    className="shrink-0 h-2.5 w-2.5 md:w-5 md:h-5"
                  />
                  {totalBought} courses bought
                </p>
              )}

              {/* Mobile only badges - show below on mobile */}
              {role === "counselor" && courseDetails && (
                <span className="bg-[#FDEFE2] rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 font-medium text-[#EF7F21] text-[0.5rem] md:text-sm whitespace-nowrap">
                  <img
                    src="/orangeRuppe.svg"
                    alt=""
                    className="w-3.5 md:w-5 md:h-5 h-3.5"
                  />
                  ₹{moneyEarned}
                </span>
              )}

              {role !== 'counselor' && course.rating && course.reviews && (
                <div>
                  <p className="bg-[#FDEFE2] rounded-[12px] p-1 flex items-center justify-center gap-1 max-h-7.5 text-[0.5rem] md:text-sm font-medium text-[#EF7F21]">
                    <img
                      src="/star.svg"
                      alt=""
                      className="shrink-0 h-2.5 w-2.5 md:h-5 md:w-5"
                    />
                    <span>{Math.round(Number(course.rating) * 10) / 10}</span>
                    <span>({course.reviews} reviews)</span>
                  </p>
                </div>
              )}

              <p className="bg-[#E7FAF9] rounded-[12px] p-1 flex items-center justify-center gap-1 max-h-7.5 text-[0.5rem] md:text-xs font-medium text-[#058C91]">
                <img
                  src="/greenClock.svg"
                  alt=""
                  className="w-2.5 h-2.5 md:w-5 md:h-5 shrink-0"
                />
                {normalizeTime(
                  course.courseTimeHours,
                  course.courseTimeMinutes
                )}
              </p>
            </div>
            {/* 
            {role === "counselor" && courseDetails && (
              <div className="hidden md:flex gap-5 mt-1">
                <p className="bg-[#FDEFE2] rounded-[12px] p-1 flex items-center justify-center max-h-7.5 font-medium text-[#EF7F21] text-center">
                  <img src="/orangeRuppe.svg" alt="" className="shrink-0" />₹
                  {moneyEarned} money earned
                </p>
                <p className="bg-[#E7FAF9] rounded-[12px] p-1 flex items-center justify-center max-h-7.5 font-medium text-[#058C91]">
                  <img src="/greenClock.svg" alt="" className="shrink-0" />
                  {normalizeTime(
                    course.courseTimeHours,
                    course.courseTimeMinutes
                  )}
                </p>
              </div>
            )} */}
          </div>
        </div>

        {/* Right: Price + Button */}
        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3">
          <div className="flex flex-col items-start md:items-end gap-0.5 md:gap-1">
            <div className="flex gap-1.5 md:gap-2 items-center">
              <img src="/coin.svg" alt="" className="w-4 h-4 md:w-5 md:h-5" />
              <h3 className="text-[#07B02E] text-xl md:text-[1.5rem] font-bold">
                {(courseDetails?.coursePriceAfterDiscount === 0 || Number(course.price) === 0)
                  ? "Free"
                  : `₹${courseDetails?.coursePriceAfterDiscount || course.price}`
                }
              </h3>
            </div>
            {courseDetails?.coursePrice &&
              courseDetails.coursePriceAfterDiscount !== undefined &&
              courseDetails.coursePrice > courseDetails.coursePriceAfterDiscount &&
              courseDetails.coursePriceAfterDiscount > 0 && (
                <div className="flex gap-1.5 md:gap-2 items-center">
                  <span className="text-[#8C8CA1] text-xs md:text-sm line-through">
                    ₹{courseDetails.coursePrice}
                  </span>
                  <span className="text-[#07B02E] text-xs md:text-sm font-semibold">
                    {Math.round(
                      ((courseDetails.coursePrice -
                        courseDetails.coursePriceAfterDiscount) /
                        courseDetails.coursePrice) *
                      100
                    )}
                    % off
                  </span>
                </div>
              )}
          </div>

          {role !== 'counselor' && !isPurchased && onBuyCourse && (
            <button
              onClick={onBuyCourse}
              disabled={isBuying}
              className="px-5 py-2 md:px-6 md:py-2.5 bg-[#13097D] hover:bg-[#0d0659] text-white rounded-lg font-semibold transition-colors hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base whitespace-nowrap md:w-full"
            >
              {isBuying
                ? "Processing..."
                : (courseDetails?.coursePriceAfterDiscount === 0 || Number(course.price) === 0)
                  ? "Enroll for Free"
                  : "Buy Course"
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
