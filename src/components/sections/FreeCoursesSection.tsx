import * as React from "react";
import type { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useNavigate } from "react-router-dom";
import CourseCard from "../course-cards/CourseCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "@/store/AuthStore";

// Interface for the API response
interface FreeCourse {
    courseId: string;
    courseName: string;
    courseThumbnailUrl: string;
    category: string;
    rating: number;
    coursePrice: number;
    discount: number;
    coursePriceAfterDiscount: number;
}

interface FreeCoursesResponse {
    data: FreeCourse[];
    message: string;
}

const addTrackpadScrolling = (emblaApi: EmblaCarouselType) => {
    const SCROLL_COOLDOWN_MS = 300;
    let isThrottled = false;

    const wheelListener = (event: WheelEvent) => {
        if (isThrottled) return;

        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
            event.preventDefault();

            isThrottled = true;

            if (event.deltaX > 0) {
                emblaApi.scrollNext();
            } else {
                emblaApi.scrollPrev();
            }
            setTimeout(() => {
                isThrottled = false;
            }, SCROLL_COOLDOWN_MS);
        }
    };

    const containerNode = emblaApi.containerNode();
    containerNode.addEventListener("wheel", wheelListener);

    return () => containerNode.removeEventListener("wheel", wheelListener);
};

export function FreeCoursesSection() {
    const navigate = useNavigate();
    const { role, userId } = useAuthStore();
    const userRole = role || "user";

    const autoplay = React.useRef(
        Autoplay({
            delay: 3000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            stopOnLastSnap: false
        })
    );

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            slidesToScroll: 1,
        },
        [autoplay.current]
    );

    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

    const updateScrollSnaps = React.useCallback((emblaApi: EmblaCarouselType) => {
        setScrollSnaps(emblaApi.scrollSnapList());
    }, []);

    const updateSelectedIndex = React.useCallback(
        (emblaApi: EmblaCarouselType) => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        },
        []
    );

    React.useEffect(() => {
        if (!emblaApi) return;

        updateScrollSnaps(emblaApi);
        emblaApi.on("select", updateSelectedIndex);
        emblaApi.on("reInit", updateScrollSnaps);

        const removeTrackpadScrolling = addTrackpadScrolling(emblaApi);
        return () => {
            emblaApi.off("select", updateSelectedIndex);
            emblaApi.off("reInit", updateScrollSnaps);
            removeTrackpadScrolling();
        };
    }, [emblaApi, updateSelectedIndex, updateScrollSnaps]);

    // Fetch Free Courses
    const { data: courses, isLoading, isError } = useQuery({
        queryKey: ['freeCourses'],
        queryFn: async () => {
            const response = await axios.get<FreeCoursesResponse>(
                'https://procounsellor-backend-1000407154647.asia-south1.run.app/api/counsellorCourses/getAllFreeCounsellorCourses?userId=0000000011',
                {
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMDAwMDAwMDExIiwiaWF0IjoxNzYzMDU2ODUyLCJleHAiOjE3OTQ1OTI4NTJ9.vb9De0x12cGFOy_3jZzMf031XRVQW6ZndagbpOBjJRs',
                        'Accept': 'application/json'
                    }
                }
            );
            return response.data.data;
        },
    });

    if (isLoading) {
        return null;
    }

    if (isError || !courses || courses.length === 0) {
        return null; // Don't show section if error or no courses
    }

    return (
        <section
            className="w-full py-8"
            style={{
                background: "linear-gradient(180deg, #FFFFFF 0%, #F5F5F7 100%)" // Subtle gradient to distinguish
            }}
        >
            <div className="max-w-[1200px] mx-auto pl-5 lg:px-0">
                <div className="mb-6 flex items-center pr-5 justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="font-bold text-[18px] lg:text-[28px] text-[#242645]">
                                Free Courses
                            </h2>
                            <span className="px-2 py-0.5 rounded-full bg-[#E1EDFA] text-[#072EB1] text-[10px] lg:text-xs font-bold uppercase tracking-wider">
                                Limited Time
                            </span>
                        </div>

                        <p className="text-sm lg:text-lg text-gray-500">
                            Start learning today with our compliments
                        </p>
                    </div>
                </div>

                <div className="relative mt-2 lg:mt-4">
                    <div className="overflow-x-hidden px-0.5 py-4" ref={emblaRef}>
                        <div className="flex gap-3 px-3 lg:px-6 lg:gap-6 py-1">
                            {courses.map((course) => (
                                <div
                                    key={course.courseId}
                                    className="flex-shrink-0 w-56 cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                                    onClick={() => navigate(`/detail/${course.courseId}/${userRole}`)}
                                >
                                    <CourseCard
                                        course={{
                                            id: course.courseId,
                                            name: course.courseName,
                                            subject: course.category,
                                            price: course.coursePriceAfterDiscount.toString(),
                                            rating: course.rating?.toString(),
                                            image: course.courseThumbnailUrl,
                                            courseTimeHours: 0,
                                            courseTimeMinutes: 0
                                        }}
                                        role={userRole as "user" | "student" | "counselor"}
                                        userId={userId}
                                        showBookmark={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Carousel Dots - Only show if scrolling is needed */}
                {scrollSnaps.length > 1 && (
                    <div className="flex justify-center mt-6 gap-2">
                        {scrollSnaps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => emblaApi && emblaApi.scrollTo(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${selectedIndex === index
                                    ? "w-8 bg-[#13097D]"
                                    : "w-2 bg-gray-300"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        )
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
