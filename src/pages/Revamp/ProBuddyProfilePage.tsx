import { useMemo, useRef, useState } from 'react';
import {  useParams } from 'react-router-dom';
import {  MapPin, Users, } from 'lucide-react';
import { Radar, RadarChart, PolarAngleAxis, PolarGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { FaInstagram, FaLinkedin, FaStar,} from 'react-icons/fa6';
import { FaCheckCircle } from 'react-icons/fa';
import ReviewSection from '@/components/Revamp/common/ReviewSection';
import RequestCallbackPopUp from '@/components/Revamp/probuddies/RequestCallbackPopup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { probuddiesApi } from '@/api/pro-buddies';
import ProBuddyProfileSkeleton from '@/components/skeletons/probuddies/ProBuddyProfileSkeleton';
import ProBuddyProfileError from '@/components/Revamp/error/ProBuddyErrorPage';
import { decodeCounselorId } from '@/lib/utils';
import { useAuthStore } from '@/store/AuthStore';
import toast from 'react-hot-toast';

function BookingCard({price, onRequestCall}:{price:string; onRequestCall: () => void}) {
    return (
        <div className="bg-white rounded-[8px] md:rounded-[16px] p-[12px] w-[350px] mx-auto md:w-full xl:w-[580px] h-[161px] md:h-auto font-['Poppins']">

            <div className="mt-[4px] md:mt-3 flex items-center gap-[8px] md:gap-3">
                <p className="font-semibold text-[#0e1629] text-[16px] md:text-lg">
                    ₹ {price}
                </p>
                <p className="font-normal text-[#6b7280] text-[12px] md:text-sm [text-decoration-skip-ink:none]">
                    /min
                </p>
            </div>

            <button
                onClick={onRequestCall}
                className="mt-[12px] md:mt-3 w-full bg-[#0e1629] h-[44px] md:h-auto rounded-[12px] px-4 py-2.5 font-medium text-[16px] text-white cursor-pointer"
            >
                Request a Call
            </button>

            <p className="mt-[8px] md:mt-2.5 text-center font-normal md:font-medium text-[#6b7280] text-[12px] md:text-sm">
                100% satisfaction guarantee
            </p>
        </div>
    );
}

function Divider() {
    return <div className="h-px w-full bg-[#efefef]" />;
}

export default function ProBuddyProfilePage() {
    const {id} = useParams();
    const { userId, isAuthenticated, toggleLogin } = useAuthStore();
    const [isReadMore, setIsReadMore] = useState(false);
    const [showCallbackPopup, setShowCallbackPopup] = useState(false);
    const [showPostReviewForm, setShowPostReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const reviewFormRef = useRef<HTMLDivElement | null>(null);

    const {data:probuddy ,isLoading, isError, refetch} = useQuery({
        queryKey:[`probuddy-profile`, id, userId ?? 'guest'],
        queryFn: () => probuddiesApi.profileUser(userId ?? null, decodeCounselorId(id as string)),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })


    const radarData = [
    { subject: 'Mess Food', A: 8, fullMark: 10 },
    { subject: 'Time Management', A: 8, fullMark: 10 },
    { subject: 'Exam Strategy', A: 9, fullMark: 10 },
    { subject: 'Career Guidance', A: 6, fullMark: 10 },
    { subject: 'Campus Navigation', A: 9, fullMark: 10 },
];



    const displayImage =
    probuddy?.photoUrl||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(probuddy?.firstName! + probuddy?.lastName|| "ProBuddy")}&background=6B7280&color=ffffff&size=400`;

    const callbackInfo = {
        name: `${probuddy?.firstName ?? ''} ${probuddy?.lastName ?? ''}`.trim() || 'ProBuddy',
        city: `${probuddy?.city ?? ''}${probuddy?.state ? `, ${probuddy.state}` : ''}`,
        imageUrl: displayImage,
        proBuddyId: probuddy?.proBuddyId || String(id ?? ''),
        rating: Number(probuddy?.rating ?? 0),
        reviewsCount: Number(probuddy?.reviewsCountForUser ?? probuddy?.noOfRatingsReceived ?? 0),
    };

    const displayRating = Number(probuddy?.rating ?? 0);
    const displayReviewsCount = Number(probuddy?.reviewsCountForUser ?? probuddy?.noOfRatingsReceived ?? 0);
    const ratingLabel = displayRating > 0 ? displayRating.toFixed(1) : 'NA';
    const reviewCountLabel = displayReviewsCount > 0 ? String(displayReviewsCount) : 'NA';
    const aboutMeText = String(probuddy?.aboutMe?.aboutMe ?? '');
    const shouldShowReadMore = aboutMeText.length > 60;

    const mappedReviews = useMemo(() => {
        return (probuddy?.reviewsReceivedForUser ?? []).map((review, index) => {
            const createdAt = typeof review.createdAt === 'string' ? review.createdAt : '';
            const parsedDate = createdAt ? new Date(createdAt) : null;

            return {
                name: String(review.userName ?? `Student ${index + 1}`),
                date: parsedDate && !Number.isNaN(parsedDate.getTime())
                    ? parsedDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                    : 'Recently',
                rating: Math.min(5, Math.max(1, Number(review.rating ?? 1))),
                text: String(review.reviewText ?? 'No review text provided.'),
                image: '/review1.jpeg',
            };
        });
    }, [probuddy?.reviewsReceivedForUser]);

    const withLoginGuard = (action: () => void) => {
        if (!isAuthenticated || !userId) {
            toggleLogin(() => action());
            return;
        }
        action();
    };

    const openPostReviewForm = () => {
        setShowPostReviewForm(true);
        requestAnimationFrame(() => reviewFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
    };

    const postReviewMutation = useMutation({
        mutationFn: async () => {
            if (!probuddy?.proBuddyId || !userId) {
                throw new Error('Missing ProBuddy or user details');
            }

            return probuddiesApi.postReview({
                proBuddyId: probuddy.proBuddyId,
                userId,
                rating: reviewRating,
                reviewText: reviewText.trim() ? reviewText.trim() : null,
            });
        },
        onSuccess: async () => {
            toast.success('Review posted successfully');
            setReviewText('');
            setReviewRating(5);
            setShowPostReviewForm(false);
            await refetch();
        },
        onError: (error: unknown) => {
            const message = error instanceof Error ? error.message : 'Failed to post review';
            toast.error(message);
        }
    });

    const handlePostReview = () => {
        withLoginGuard(() => {
            if (!showPostReviewForm) {
                openPostReviewForm();
                return;
            }

            postReviewMutation.mutate();
        });
    };

    const handleOpenCallback = () => withLoginGuard(() => setShowCallbackPopup(true));


    if(isLoading){
        return <ProBuddyProfileSkeleton />
    }

    if(isError || !probuddy){
        return <ProBuddyProfileError onRetry={() => refetch()} />
    }



    return (
        <div
            className="w-full min-h-screen"
            style={{
                background:
                    'linear-gradient(0deg, rgba(198, 221, 240, 0.25), rgba(198, 221, 240, 0.25)), #FFFFFF',
            }}
        >
            <div className="max-w-[1440px] mx-auto">

                {/* Profile + Booking */}
                <div className="px-4 md:px-16 pt-6 md:pt-10 pb-6 md:pb-10">
                    <div className="flex flex-col xl:flex-row gap-6 items-start">
                        <div className="bg-white rounded-[8px] md:rounded-[16px] p-[12px] w-[350px] mx-auto md:w-full xl:max-w-[716px] min-h-[438px] relative font-['Poppins']">
                            {/* Mobile Header Layout (Absolute/Positioned style based on CSS) */}
                            <div className="relative h-[438px] md:h-auto overflow-hidden md:overflow-visible">
                                {/* Profile Header Part */}
                                <div className="md:flex md:gap-[12px]">
                                    {/* Profile Image */}
                                    <div className="absolute left-0 top-0 md:relative shrink-0 w-[60px] h-[60px] md:w-[119px] md:h-[119px] rounded-[4.9px] md:rounded-[8px] border border-[#efefef] overflow-hidden bg-[#d9d9d9]">
                                        <img
                                            src={displayImage}
                                            alt={probuddy.firstName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Info Block */}
                                    <div className="absolute left-[64px] top-0 md:relative md:left-0 md:top-0 md:flex-1 min-w-0">
                                        <div className="flex justify-between items-start w-[250px] md:w-full">
                                            <p className="font-semibold text-[#0e1629] text-[14px] md:text-[24px] leading-[1.25]">
                                                {probuddy.firstName + probuddy.lastName}
                                            </p>
                                            {/* Rating on Mobile (absolute top-right in CSS) */}
                                            <div className="flex items-center gap-[4px] md:hidden">
                                                <FaStar className="text-[#FACC14] text-[15px]" />
                                                <p className="text-[#6b7280] text-[12px] tracking-[0.02em]">
                                                    {ratingLabel} ({reviewCountLabel})
                                                </p>
                                            </div>
                                        </div>

                                        <p className="mt-[2px] md:mt-[8px] font-medium md:font-semibold text-[#2f43f2] text-[12px] md:text-[16px] leading-[18px] md:leading-[1.25] line-clamp-1">
                                            {`${probuddy.currentYear}${probuddy.currentYear==='1'?"st":probuddy.currentYear==='2'?"nd":probuddy.currentYear==='3'?'rd':'th'} year ${probuddy.course} student`}
                                        </p>
                                        <p className="mt-[2px] md:mt-[8px] font-normal md:font-medium text-[#6b7280] text-[12px] md:text-[14px] leading-[18px] tracking-[0.02em] md:tracking-[0.28px] line-clamp-1">
                                            {`${probuddy.collegeName} • ${probuddy.course}`}
                                        </p>

                                        {/* Desktop Stats (Hidden on mobile as they're moved below) */}
                                        <div className="hidden md:flex mt-[12px] flex-col gap-[8px]">
                                            <div className="flex flex-wrap items-center gap-[16px]">
                                                <div className="flex items-center gap-[8px]">
                                                    <FaStar className="text-[#FACC14] text-[20px]" />
                                                    <p className="text-[#6b7280] text-[14px] tracking-[0.32px]">
                                                        <span className="font-medium">{ratingLabel} </span>
                                                        <span className="font-normal">({reviewCountLabel} reviews)</span>
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-[4px]">
                                                    <Users className="w-[20px] h-[20px] text-[#6b7280]" />
                                                    <p className="font-medium text-[#6b7280] text-[14px] tracking-[0.28px]">
                                                        850+ students helped
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-[4px]">
                                                    <MapPin className="w-[20px] h-[20px] text-[#6b7280]" />
                                                    <p className="font-medium text-[#6b7280] text-[14px] tracking-[0.28px]">
                                                        {probuddy.city+", "+probuddy.state}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-[8px]">
                                                {probuddy.languagesKnow.map((lang)=>(
                                                    <div key={lang} className="min-w-[80px] flex items-center justify-center bg-[#e6efec] rounded-[16px] px-[12px] py-[4px]">
                                                    <p className="font-medium text-[#25a777] text-[12px] leading-[normal]">
                                                        {lang}
                                                    </p>
                                                </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Stats (Group 1410128149 style) */}
                                <div className="absolute left-0 top-[70px] flex flex-col gap-[4px] md:hidden">
                                    <div className="flex items-center gap-[4px]">
                                        <Users className="w-[15px] h-[15px] text-[#6b7280]" />
                                        <p className="text-[#6b7280] text-[12px] font-normal leading-[18px] tracking-[0.02em]">
                                            850+ students helped
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-[4px]">
                                        <MapPin className="w-[15px] h-[15px] text-[#6b7280]" />
                                        <p className="text-[#6b7280] text-[12px] font-normal leading-[18px] tracking-[0.02em]">
                                            {probuddy.city}, {probuddy.state}
                                        </p>
                                    </div>
                                </div>

                                {/* Dividers & Socials (Kept but integrated) */}
                                <div className="hidden md:block mt-[12px]">
                                    <Divider />
                                    <div className="py-[8px] flex flex-wrap items-center gap-[20px]">
                                        <a href="#" className="flex items-center gap-[8px] font-medium text-[#6b7280] text-[14px] tracking-[0.28px]">
                                            <FaInstagram className="text-[20px] text-[#E4405F]" />
                                            instagramid
                                        </a>
                                        <a href="#" className="flex items-center gap-[8px] font-medium text-[#6b7280] text-[14px] tracking-[0.28px]">
                                            <FaLinkedin className="text-[20px] text-[#0A66C2]" />
                                            linkedinid
                                        </a>
                                        <a href="#" className="flex items-center gap-[8px] font-medium text-[#6b7280] text-[14px] tracking-[0.28px]">
                                            <FaInstagram className="text-[20px] text-[#E4405F]" />
                                            instagramid
                                        </a>
                                    </div>
                                    <Divider />
                                </div>

                                {/* About Me Section */}
                                <p className="absolute left-0 top-[122px] md:relative md:left-auto md:top-auto md:mt-[16px] font-semibold text-[#0e1629] text-[16px] md:text-[20px] leading-normal">
                                    About me
                                </p>

                                <div className="absolute left-0 top-[154px] w-full md:relative md:left-auto md:top-auto md:mt-[12px] bg-[#f3f7f6] rounded-[4px] md:rounded-[12px] p-[12px]">
                                    <div className="flex gap-[12px] items-start">
                                        <img
                                            src="/probuddies_career_icon.png"
                                            alt="Career Transition"
                                            className="w-[30px] h-[30px] md:w-[48px] md:h-[48px] shrink-0 rounded-[6.67px] md:rounded-[10.67px] object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-[#0e1629] text-[14px] md:text-[16px] leading-[21px] md:leading-normal">
                                                {probuddy.aboutMe.heading}
                                            </p>
                                            <p className="font-normal text-[#6b7280] text-[12px] leading-[18px] md:leading-normal">
                                                Specialised in {probuddy.aboutMe.subHeading}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-[12px] font-normal text-[#6b7280] text-[12px] md:text-[14px] leading-[18px] md:leading-normal">
                                        {shouldShowReadMore ? (isReadMore ? aboutMeText : `${aboutMeText.slice(0, 60)}...`) : aboutMeText}
                                        {shouldShowReadMore && (
                                            <span
                                                onClick={() => setIsReadMore(!isReadMore)}
                                                className="text-[#2F43F2] cursor-pointer ml-1"
                                            >
                                                {isReadMore ? "Read Less" : "Read More"}
                                            </span>
                                        )}
                                    </p>
                                </div>

                                {/* Who Should Connect Section */}
                                <p className="absolute left-0 top-[306px] md:relative md:left-auto md:top-auto md:mt-[20px] font-semibold text-[#0e1629] text-[16px] md:text-[20px] leading-normal">
                                    Who Should Connect With Me?
                                </p>
                                <p className="absolute left-0 top-[342px] md:relative md:left-auto md:top-auto md:mt-[12px] font-medium text-[#6b7280] text-[12px] md:text-[16px] leading-[18px] md:leading-normal w-full max-w-[326px] md:max-w-none">
                                    {probuddy.whoShouldConnect}
                                </p>
                            </div>
                        </div>

                        {/* Right Card - Booking */}
                        <div className="w-full xl:w-auto xl:sticky xl:top-4">
                            <BookingCard
                                price={probuddy.ratePerMinute?.toFixed(2).toString() || 'NA'}
                                onRequestCall={handleOpenCallback}
                            />
                        </div>
                    </div>
                </div>

                {/* How I Can Help You */}
                <div className="mt-6 md:mt-10 md:px-16 pb-6 md:pb-10 bg-[#F0F6FB] md:bg-transparent">
                    <div className="px-5 md:px-0 py-6 md:py-0">
                        <p className="font-semibold text-[#0e1629] text-[16px] md:text-xl sm:text-2xl leading-normal mb-5">
                            How I Can Help You
                        </p>

                        <div className="flex flex-col xl:flex-row gap-6 items-start">
                            {/* Radar Chart */}
                            <div className="w-full xl:w-[656px] h-[220px] sm:h-[360px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius={window.innerWidth < 768 ? "60%" : "70%"} data={radarData}>
                                        <PolarGrid stroke="#B7BEFA95" strokeWidth={2}/>
                                        <PolarAngleAxis
                                            dataKey="subject"
                                            tick={{
                                                fill: '#2f43f2',
                                                fontSize: window.innerWidth < 768 ? 10 : 12,
                                                fontFamily: 'Poppins',
                                            }}
                                        />
                                        <Radar
                                            name="Score"
                                            dataKey="A"
                                            stroke="#2f43f2"
                                            strokeWidth={2}
                                            fill="#2f43f2"
                                            fillOpacity={0.12}
                                        />
                                        <Tooltip cursor={false} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Rating + Key Insights */}
                            <div className="w-full xl:flex-1">
                                <p className="font-medium text-[#0e1629] text-sm sm:text-base leading-normal">
                                    Overall Rating
                                </p>

                                <div className="mt-3 flex justify-between font-medium text-[#0e1629] text-sm leading-normal">
                                    <span>1</span>
                                    <span>5</span>
                                    <span>10</span>
                                </div>
                                <div
                                    className="mt-2.5 h-6 sm:h-7 rounded-3xl"
                                    style={{
                                        background:
                                            'linear-gradient(90deg, rgb(250, 102, 15) 0%, rgb(255, 214, 66) 36.01%, rgb(129, 192, 65) 64.368%, rgb(34, 197, 93) 100%)',
                                    }}
                                />
                                <p className="mt-2.5 font-normal text-[#6b7280] text-xs sm:text-sm leading-normal">
                                    Hover over the chart to see detailed scores
                                </p>

                                <div className="mt-4 sm:mt-5 bg-white rounded-[16px] border border-[#efefef] p-4">
                                    <p className="font-semibold text-[#0e1629] text-base sm:text-lg leading-normal">
                                        Key Insights
                                    </p>

                                    <div className="mt-4 space-y-4">
                                        <div className="flex gap-3 items-start">
                                            <FaCheckCircle className="text-[#2f43f2] text-lg mt-0.5 shrink-0" />
                                            <div>
                                                <p className="font-medium text-[#0e1629] text-sm sm:text-base leading-normal">
                                                    Interview Prep
                                                </p>
                                                <p className="mt-1.5 font-normal text-[#6b7280] text-xs sm:text-sm leading-normal">
                                                    Real prep strategies for internships and placements based on actual
                                                    experiences
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <FaCheckCircle className="text-[#2f43f2] text-lg mt-0.5 shrink-0" />
                                            <div>
                                                <p className="font-medium text-[#0e1629] text-sm sm:text-base leading-normal">
                                                    Exam Strategy
                                                </p>
                                                <p className="mt-1.5 font-normal text-[#6b7280] text-xs sm:text-sm leading-normal">
                                                    Effective study techniques that work - not just theoretical advice.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <FaCheckCircle className="text-[#2f43f2] text-lg mt-0.5 shrink-0" />
                                            <div>
                                                <p className="font-medium text-[#0e1629] text-sm sm:text-base leading-normal">
                                                    Placement Tips
                                                </p>
                                                <p className="mt-1.5 font-normal text-[#6b7280] text-xs sm:text-sm leading-normal">
                                                    Insights on 98.6% percentile preparation strategies.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Success Stories Section */}
           <ReviewSection
                reviews={mappedReviews}
                onWriteReview={handlePostReview}
                writeReviewLabel={showPostReviewForm ? (postReviewMutation.isPending ? 'Posting...' : 'Post Review') : 'Write Review'}
                writeReviewDisabled={postReviewMutation.isPending}
                composer={
                    showPostReviewForm ? (
                        <div ref={reviewFormRef} className="max-w-[520px] space-y-3 font-['Poppins']">
                            <div>
                                <label className="block text-xs text-[#6b7280] mb-1">Rating</label>
                                <select
                                    value={reviewRating}
                                    onChange={(e) => setReviewRating(Number(e.target.value))}
                                    className="w-full border border-[#E5E7EB] rounded-[10px] px-3 py-2 text-sm bg-white"
                                >
                                    <option value={5}>5</option>
                                    <option value={4}>4</option>
                                    <option value={3}>3</option>
                                    <option value={2}>2</option>
                                    <option value={1}>1</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-[#6b7280] mb-1">Review (optional)</label>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    rows={3}
                                    placeholder="Share your experience"
                                    className="w-full border border-[#E5E7EB] rounded-[10px] px-3 py-2 text-sm resize-none bg-white"
                                />
                            </div>
                        </div>
                    ) : null
                }
            />

            {/* Spacer */}
            <div className="h-8 md:h-10" />

            {/* Footer CTA */}
            <div className="bg-white">
                <div className="max-w-[1440px] mx-auto md:border-t md:border-[#E5E7EB]">
                    <div className="py-0 md:py-16 text-center">
                        {/* Mobile View */}
                        <div className="md:hidden bg-gradient-to-t from-[#2F43F2] to-[#1B278C] rounded-none h-[288px] relative overflow-hidden">
                            <p className="absolute left-1/2 -translate-x-1/2 top-[60px] w-[309px] font-['Poppins'] font-semibold text-white text-[16px] leading-[1.25]">
                                Ready to Make Your College Decision?
                            </p>
                            <p className="absolute left-1/2 -translate-x-1/2 top-[100px] w-[316px] font-['Poppins'] font-normal text-[#F5F5F5] text-[14px] leading-[21px] text-center">
                                Book a session with Aditya and get personalized guidance for your unique situation
                            </p>
                            <button onClick={handleOpenCallback} className="absolute left-1/2 -translate-x-1/2 top-[183px] w-[246px] h-[48px] bg-white rounded-[12px] font-['Poppins'] font-medium text-[16px] text-[#2F43F2] cursor-pointer">
                                Request a Callback
                            </button>
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:block px-4">
                            <p className="font-['Poppins'] font-semibold text-[#0e1629] text-2xl leading-snug">
                                Ready to Make Your College Decision?
                            </p>
                            <p className="mt-3 font-['Poppins'] font-normal text-[#6b7280] text-base leading-normal">
                                Book a session with Aditya and get personalized guidance for your unique situation
                            </p>
                            <button onClick={handleOpenCallback} className="mt-6 bg-[#2f43f2] rounded-[12px] px-4 py-2.5 w-full max-w-[357px] font-['Poppins'] font-medium text-base text-white cursor-pointer">
                                Request a Callback
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showCallbackPopup && (
                <RequestCallbackPopUp
                    isOpen={showCallbackPopup}
                    onClose={() => setShowCallbackPopup(false)}
                    info={callbackInfo}
                />
            )}
        </div>
    );
}
