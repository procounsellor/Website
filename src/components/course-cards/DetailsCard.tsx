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

export default function ({role, courseId, course, courseDetails, isPurchased, isBookmarked, onBookmark, onBuyCourse, isBookmarking, isBuying, isUserOrStudent}: DetailsCardProps){
    const duration = courseDetails 
        ? `${courseDetails.courseTimeHours}h ${courseDetails.courseTimeMinutes}min` 
        : "N/A";
    const totalBought = courseDetails?.soldCount?.toString() || "0";
    const moneyEarned = courseDetails 
        ? ((courseDetails.soldCount || 0) * (courseDetails.coursePriceAfterDiscount || 0)).toString() 
        : "0";

    return <div className="max-w-7xl mx-auto">
        <div className="relative flex gap-3">
            <div className="flex gap-3 flex-1">
                <div className="relative flex-shrink-0">
                    <img src={course.image} alt="" className="w-[7.5rem] h-[7.5rem] rounded-lg object-cover"/>
                    {isUserOrStudent && onBookmark && (
                        <button
                            onClick={onBookmark}
                            disabled={isBookmarking}
                            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-md transition-colors hover:bg-black/50"
                            aria-label="Bookmark course"
                        >
                            <Bookmark className={`h-4 w-4 text-white transition-colors ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                    )}
                </div>
                <div className="flex flex-col gap-1 justify-center">
                    <p className="text-[#8C8CA1] text-[1rem] font-medium">{course.subject}</p>
                    <h1 className="text-[#343C6A] text-[1.25rem] font-semibold">{course.name}</h1>
                    
                    {course.rating && course.reviews && (
                        <div className="flex gap-2 items-center">
                            <span className="text-[#343C6A] font-medium">{course.rating}</span>
                            <span className="text-[#8C8CA1] text-sm">({course.reviews} reviews)</span>
                        </div>
                    )}

                    {courseDetails && totalBought && (
                        <p className="bg-[#E1EDFA] rounded-[12px] px-2 py-1 flex items-center gap-1 max-h-7.5 font-medium text-[#226CBD] text-sm w-fit">
                            <img src="/people.svg" alt="" />{totalBought} courses bought
                        </p>
                    )}

                    {role === 'counselor' && courseDetails && (
                        <div className="flex gap-5">
                            <p className="bg-[#FDEFE2] rounded-[12px] p-1 flex items-center justify-center max-h-7.5 font-medium text-[#EF7F21] text-center">
                                <img src="/orangeRuppe.svg" alt="" />{moneyEarned} money earned
                            </p>
                            <p className="bg-[#E7FAF9] rounded-[12px] p-1 flex items-center justify-center max-h-7.5 font-medium text-[#058C91]">
                                <img src="/greenClock.svg" alt="" />{duration}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-end justify-center gap-3">
                <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-2 items-center">
                        <img src="/coin.svg" alt="" className="w-5 h-5"/>
                        <h3 className="text-[#07B02E] text-[1.5rem] font-bold">{courseDetails?.coursePriceAfterDiscount || course.price}</h3>
                    </div>
                    {courseDetails?.discount && courseDetails.discount > 0 && courseDetails.coursePrice > 0 && (
                        <div className="flex gap-2 items-center">
                            <span className="text-[#8C8CA1] text-sm line-through">₹{courseDetails.coursePrice}</span>
                            <span className="text-[#07B02E] text-sm font-semibold">{Math.round((courseDetails.discount / courseDetails.coursePrice) * 100)}% off</span>
                        </div>
                    )}
                </div>

                {isUserOrStudent && !isPurchased && onBuyCourse && (
                    <button
                        onClick={onBuyCourse}
                        disabled={isBuying}
                        className="px-6 py-2.5 bg-[#13097D] hover:bg-[#0d0659] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
                    >
                        {isBuying ? 'Processing...' : 'Buy Course'}
                    </button>
                )}
            </div>
        </div>
    </div>
}

