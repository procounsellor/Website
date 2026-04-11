import { type ReactNode, useEffect, useRef, useState } from "react";
import ReviewCard, { type ReviewCardData } from "./ReviewCard";
import { SeeAllButton } from "../components/LeftRightButton";
import StudentReviews from "./StudentReviews.jsx";

type ReviewSectionProps = {
    reviews?: ReviewCardData[];
    onWriteReview?: () => void;
    writeReviewLabel?: string;
    writeReviewDisabled?: boolean;
    composer?: ReactNode;
};

export default function ReviewSection({
    reviews = [],
    onWriteReview,
    writeReviewLabel = "Write Review",
    writeReviewDisabled = false,
    composer,
}: ReviewSectionProps){
    const scrollRef = useRef<HTMLDivElement>(null);
    const [_activeIndex, setActiveIndex] = useState(0);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const reviewItems = reviews.slice(0, 3);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ left: 0, behavior: "auto" });
        }
    }, []);

    useEffect(() => {
        if (reviewItems.length < 2) {
            return;
        }

        const interval = setInterval(() => {
            if (scrollRef.current) {
                setActiveIndex((prev) => {
                    if (prev >= reviewItems.length - 1) {
                        return prev;
                    }

                    const nextIndex = prev + 1;
                    const firstCard = scrollRef.current?.firstElementChild as HTMLElement | null;
                    const gap = window.innerWidth >= 768 ? 32 : 12;
                    const cardWidth = firstCard ? firstCard.offsetWidth + gap : 306;
                    scrollRef.current?.scrollTo({
                        left: nextIndex * cardWidth,
                        behavior: "smooth",
                    });
                    return nextIndex;
                });
            }
        }, 4500);

        return () => clearInterval(interval);
    }, [reviewItems.length]);

    return (
        <div className="max-w-[1440px] md:px-[60px] mx-auto h-auto md:h-[352px] flex flex-col gap-6 md:gap-8 py-8 md:py-10 pl-5 md:pl-0 overflow-visible md:overflow-hidden">
            <div className="relative flex items-center justify-center pr-5 md:pr-0">
                <h1 className="text-(--text-main) font-bold text-[1rem] md:text-2xl text-center">
                    Reviews
                </h1>
                {onWriteReview && (
                    <button
                        onClick={onWriteReview}
                        disabled={writeReviewDisabled}
                        className="absolute right-5 md:right-0 text-[#2F43F2] text-xs md:text-sm font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {writeReviewLabel}
                    </button>
                )}
            </div>

            {composer && <div className="pr-5 md:pr-0">{composer}</div>}

            <div
             ref={scrollRef}
                            className={`flex gap-3 md:gap-8 items-start md:items-end w-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4 md:pb-0 ${reviewItems.length === 0 ? "justify-center" : "justify-start"}`}
            >
                {reviewItems.map((review, index)=>(
                <div key={`${review.name ?? "review"}-${index}`} className="snap-start shrink-0">
                    <ReviewCard review={review}/>
                </div>
            ))}

                {reviewItems.length === 0 && (
                    <div className="snap-start shrink-0 min-w-[320px] md:min-w-[597px] w-full p-3 md:p-4">
                        <p className="text-(--text-muted) text-sm md:text-base text-center w-full">No reviews yet. Be the first to review.</p>
                    </div>
                )}

                {reviewItems.length > 0 && (
                    <div className="md:hidden snap-start shrink-0 min-w-[320px] pr-4">
                        <div className="min-w-[320px] min-h-[146px] flex flex-col items-start justify-center gap-3 p-15 rounded-[12px]">
                            {/* <p className="text-(--text-main) font-semibold text-sm text-center">See all reviews</p> */}
                            <SeeAllButton text="See all" onClick={() => setShowAllReviews(true)} />
                        </div>
                    </div>
                )}
            </div>
            {reviewItems.length > 0 && (
                <div className="hidden md:flex justify-end">
                    <SeeAllButton onClick={() => setShowAllReviews(true)} />
                </div>
            )}

            {showAllReviews && (
                <StudentReviews
                    reviews={reviews}
                    defaultView="modal"
                    onClose={() => setShowAllReviews(false)}
                />
            )}
        </div>
    );
}