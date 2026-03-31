import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Clock, MapPin, Users, ChevronRight, ChevronLeft } from 'lucide-react';
import { Radar, RadarChart, PolarAngleAxis, PolarGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { FaInstagram, FaLinkedin, FaStar, FaRegStar } from 'react-icons/fa6';
import { FaCheckCircle } from 'react-icons/fa';

const radarData = [
    { subject: 'Mess Food', A: 8, fullMark: 10 },
    { subject: 'Time Management', A: 8, fullMark: 10 },
    { subject: 'Exam Strategy', A: 9, fullMark: 10 },
    { subject: 'Career Guidance', A: 6, fullMark: 10 },
    { subject: 'Campus Navigation', A: 9, fullMark: 10 },
];

function BookingCard() {
    return (
        <div className="bg-white rounded-[8px] md:rounded-[16px] p-[12px] w-[350px] mx-auto md:w-full xl:w-[580px] h-[161px] md:h-auto font-['Poppins']">
            <div className="flex items-center justify-between">
                <p className="font-medium text-[#6b7280] text-[10px] md:text-sm">
                    30-min Video call
                </p>
                <div className="flex items-center gap-[4px] md:gap-2">
                    <Clock className="w-[15px] h-[15px] md:w-5 md:h-5 text-[#6b7280]" />
                    <p className="font-medium text-[#6b7280] text-[10px] md:text-sm whitespace-nowrap">
                        Usually replies in 2 Hrs
                    </p>
                </div>
            </div>

            <div className="mt-[4px] md:mt-3 flex items-center gap-[8px] md:gap-3">
                <p className="font-semibold text-[#0e1629] text-[16px] md:text-lg">
                    ₹ 1,499
                </p>
                <p className="font-normal text-[#6b7280] text-[12px] md:text-sm line-through [text-decoration-skip-ink:none]">
                    ₹ 2,499
                </p>
                <div className="bg-[#e6efec] rounded-[16px] px-[4px] py-[2px] md:px-3 md:py-0.5">
                    <p className="font-medium text-[#25a777] text-[10px]">
                        40% off
                    </p>
                </div>
            </div>

            <button className="mt-[12px] md:mt-3 w-full bg-[#0e1629] h-[44px] md:h-auto rounded-[12px] px-4 py-2.5 font-medium text-[16px] text-white">
                Book An Appointment
            </button>

            <p className="mt-[8px] md:mt-2.5 text-center font-normal md:font-medium text-[#6b7280] text-[12px] md:text-sm">
                Free rescheduling • 100% satisfaction guarantee
            </p>
        </div>
    );
}

function Divider() {
    return <div className="h-px w-full bg-[#efefef]" />;
}

export default function ProBuddyProfilePageFigma() {
    useParams();
    const [isReadMore, setIsReadMore] = useState(false);
    const [collegeSlide, setCollegeSlide] = useState(0);

    const collegeLifeItems = [
        {
            title: 'Mess Food',
            description: '7/10 - Decent, but get yourself acquainted with local food joints',
            color: 'bg-white',
            textColor: 'text-[#6B7280]',
        },
        {
            title: 'Campus Vibe',
            description: 'Competitive yet collaborative. Strong peer learning culture',
            color: 'bg-[#C7CFD9]',
            textColor: 'text-[#0E1629]',
        },
        {
            title: 'Attendance',
            description: 'Moderate enforcement. 75% mandatory, but professors are understanding.',
            color: 'bg-white',
            textColor: 'text-[#6B7280]',
        },
        {
            title: 'Faculty Quality',
            description: 'Excellent. Most are research-active with real-world experience.',
            color: 'bg-white',
            textColor: 'text-[#6B7280]',
        },
    ];

    const nextSlide = () => {
        if (collegeSlide < collegeLifeItems.length - 2) {
            setCollegeSlide((prev) => prev + 1);
        }
    };

    const prevSlide = () => {
        if (collegeSlide > 0) {
            setCollegeSlide((prev) => prev - 1);
        }
    };

    const [reviewSlide, setReviewSlide] = useState(0);

    const reviews = [
        {
            name: 'Leo',
            role: 'Lead Designer',
            title: 'It was a very good experience',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis.',
            stars: 4,
            dark: true,
        },
        {
            name: 'Leo',
            role: 'Lead Designer',
            title: 'It was a very good experience',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis.',
            stars: 4,
            dark: false,
        },
    ];

    const nextReview = () => {
        if (reviewSlide < reviews.length - 1) {
            setReviewSlide((prev) => prev + 1);
        }
    };

    const prevReview = () => {
        if (reviewSlide > 0) {
            setReviewSlide((prev) => prev - 1);
        }
    };

    return (
        <div
            className="w-full min-h-screen"
            style={{
                background:
                    'linear-gradient(0deg, rgba(198, 221, 240, 0.25), rgba(198, 221, 240, 0.25)), #FFFFFF',
            }}
        >
            <div className="max-w-[1440px] mx-auto">
                {/* Breadcrumb */}
                <div className="bg-white border-b border-[#f5f5f5] h-10 flex items-center px-5 md:px-20">
                    {/* Mobile: back arrow + ProBuddy label */}
                    <div className="flex md:hidden items-center gap-2 font-['Poppins']">
                        <Link to="/probuddy" className="flex items-center gap-2">
                            <ChevronLeft className="w-6 h-6 text-[#343C6A] shrink-0" />
                            <span className="font-semibold text-[16px] leading-6 text-[#0E1629]">
                                ProBuddy
                            </span>
                        </Link>
                    </div>
                    {/* Desktop: full breadcrumb trail */}
                    <div className="hidden md:flex items-center gap-2 font-['Poppins'] text-base whitespace-nowrap">
                        <Link to="/probuddy" className="text-[#6b7280] font-normal hover:text-[#2f43f2]">
                            ProBuddy
                        </Link>
                        <ChevronRight className="w-4 h-4 text-[#6b7280] shrink-0" />
                        <Link to="/probuddy/list" className="text-[#6b7280] font-medium hover:text-[#2f43f2]">
                            List of ProBuddy
                        </Link>
                        <ChevronRight className="w-4 h-4 text-[#6b7280] shrink-0" />
                        <span className="text-[#0e1629] font-medium">Aditya Kumar Sharma</span>
                    </div>
                </div>

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
                                            src="/probuddies_aaditya.jpg"
                                            alt="Aditya Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Info Block */}
                                    <div className="absolute left-[64px] top-0 md:relative md:left-0 md:top-0 md:flex-1 min-w-0">
                                        <div className="flex justify-between items-start w-[250px] md:w-full">
                                            <p className="font-semibold text-[#0e1629] text-[14px] md:text-[24px] leading-[1.25]">
                                                Aditya Kumar Sharma
                                            </p>
                                            {/* Rating on Mobile (absolute top-right in CSS) */}
                                            <div className="flex items-center gap-[4px] md:hidden">
                                                <FaStar className="text-[#FACC14] text-[15px]" />
                                                <p className="text-[#6b7280] text-[12px] tracking-[0.02em]">
                                                    4.0 (128)
                                                </p>
                                            </div>
                                        </div>

                                        <p className="mt-[2px] md:mt-[8px] font-medium md:font-semibold text-[#2f43f2] text-[12px] md:text-[16px] leading-[18px] md:leading-[1.25]">
                                            3rd Year B.Tech Student
                                        </p>
                                        <p className="mt-[2px] md:mt-[8px] font-normal md:font-medium text-[#6b7280] text-[12px] md:text-[14px] leading-[18px] tracking-[0.02em] md:tracking-[0.28px]">
                                            IIT Delhi • Computer Science Engineering
                                        </p>

                                        {/* Desktop Stats (Hidden on mobile as they're moved below) */}
                                        <div className="hidden md:flex mt-[12px] flex-col gap-[8px]">
                                            <div className="flex flex-wrap items-center gap-[16px]">
                                                <div className="flex items-center gap-[8px]">
                                                    <FaStar className="text-[#FACC14] text-[20px]" />
                                                    <p className="text-[#6b7280] text-[14px] tracking-[0.32px]">
                                                        <span className="font-medium">4.0 </span>
                                                        <span className="font-normal">(128 reviews)</span>
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
                                                        Delhi, India
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-[8px]">
                                                <div className="min-w-[80px] flex items-center justify-center bg-[#e6efec] rounded-[16px] px-[12px] py-[4px]">
                                                    <p className="font-medium text-[#25a777] text-[12px] leading-[normal]">
                                                        Hindi
                                                    </p>
                                                </div>
                                                <div className="min-w-[80px] flex items-center justify-center bg-[#e6efec] rounded-[16px] px-[12px] py-[4px]">
                                                    <p className="font-medium text-[#25a777] text-[12px] leading-[normal]">
                                                        English
                                                    </p>
                                                </div>
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
                                            Delhi, India
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
                                                Career Transition Strategy
                                            </p>
                                            <p className="font-normal text-[#6b7280] text-[12px] leading-[18px] md:leading-normal">
                                                Specialised in Tech & Management Roles
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-[12px] font-normal text-[#6b7280] text-[12px] md:text-[14px] leading-[18px] md:leading-normal">
                                        I've helped 850+ aspiring students navigate their college journey at IIT Delhi.
                                        Passionate about making the admission process less stressful
                                        {!isReadMore ? "..." : " and sharing real college insights that matter. Currently in 3rd year, been through it all - exams, placements, hostel life, branch selection."}
                                        <span
                                            onClick={() => setIsReadMore(!isReadMore)}
                                            className="text-[#2F43F2] cursor-pointer ml-1"
                                        >
                                            {isReadMore ? "Read Less" : "Read More"}
                                        </span>
                                    </p>
                                </div>

                                {/* Who Should Connect Section */}
                                <p className="absolute left-0 top-[306px] md:relative md:left-auto md:top-auto md:mt-[20px] font-semibold text-[#0e1629] text-[16px] md:text-[20px] leading-normal">
                                    Who Should Connect With Me?
                                </p>
                                <p className="absolute left-0 top-[342px] md:relative md:left-auto md:top-auto md:mt-[12px] font-medium text-[#6b7280] text-[12px] md:text-[16px] leading-[18px] md:leading-normal w-full max-w-[326px] md:max-w-none">
                                    Connect with me if you want real, unfiltered advice about IIT admission, competitive
                                    exam preparation, and actual college life (not just the Instagram version!)
                                </p>
                            </div>
                        </div>

                        {/* Right Card - Booking */}
                        <div className="w-full xl:w-auto xl:sticky xl:top-4">
                            <BookingCard />
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
                                        <PolarGrid stroke="#E5E7EB" />
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

                {/* College Life */}
                <div className="mt-6 md:mt-10 md:px-16 pb-12 bg-[#F0F6FB] md:bg-transparent overflow-hidden sm:h-auto h-[286px] relative">
                    {/* Mobile: 2-card carousel */}
                    <div className="md:hidden">
                        <p className="absolute left-[20px] top-[24px] font-semibold text-[#0e1629] text-[16px] leading-[20px] font-['Poppins']">
                            College Life @College Name
                        </p>

                        <div className="relative h-[182px] mt-[68px]">
                            {collegeLifeItems.map((item, idx) => {
                                // Calculate position based on slide
                                const position = idx - collegeSlide;
                                let left = '';
                                if (position === 0) left = '20px';
                                else if (position === 1) left = '202px';
                                else if (position === 2) left = '384px'; // Off-screen right
                                else if (position < 0) left = '-162px'; // Off-screen left
                                else left = '600px'; // Far off-screen

                                return (
                                    <div
                                        key={idx}
                                        className={`absolute transition-all duration-300 w-[170px] h-[182px] rounded-[8px] border border-[#EDEDED] p-[12px] flex flex-col ${item.color}`}
                                        style={{ left }}
                                    >
                                        <div className="mb-[12px]">
                                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clip-path="url(#clip0_2000_3261)">
                                                    <path d="M6.66797 6.66667C6.66797 5.95942 6.94892 5.28115 7.44902 4.78105C7.94911 4.28095 8.62739 4 9.33464 4H22.668C23.3752 4 24.0535 4.28095 24.5536 4.78105C25.0537 5.28115 25.3346 5.95942 25.3346 6.66667V25.3333C25.3346 26.0406 25.0537 26.7189 24.5536 27.219C24.0535 27.719 23.3752 28 22.668 28H9.33464C8.62739 28 7.94911 27.719 7.44902 27.219C6.94892 26.7189 6.66797 26.0406 6.66797 25.3333V6.66667Z" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M12 9.33337H20" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M12 14.6666H20" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M12 20H17.3333" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_2000_3261">
                                                        <rect width="32" height="32" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </div>
                                        <p className="font-semibold text-[#0e1629] text-[14px] leading-[21px] font-['Poppins']">
                                            {item.title}
                                        </p>
                                        <p className={`mt-[4px] font-medium text-[12px] leading-[18px] font-['Poppins'] ${item.textColor}`}>
                                            {item.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Navigation Arrows */}
                        <div className="absolute top-[262px] w-full flex justify-center">
                            <div className="relative w-[57px] h-[24px]">
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-[-15.75px] top-0 w-[27px] h-[24px] flex items-center justify-center transition-opacity"
                                >
                                    <svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M23.6285 2.63465C23.444 1.13037 22.1664 0 20.6509 0H3C1.34315 0 5.72205e-06 1.34315 5.72205e-06 3V21C5.72205e-06 22.6569 1.34315 24 3.00001 24H22.8594C24.6612 24 26.0565 22.423 25.8371 20.6346L23.6285 2.63465Z" fill="#EDEDED" />
                                        <g clip-path="url(#clip0_2000_3301_cl)">
                                            <path d="M16.625 11.7502H9.625" stroke="#0E1629" stroke-width="0.5625" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M11.625 13.7502L9.625 11.7502" stroke="#0E1629" stroke-width="0.5625" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M11.625 9.75L9.625 11.75" stroke="#0E1629" stroke-width="0.5625" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2000_3301_cl">
                                                <rect width="12" height="12" fill="white" transform="matrix(-1 0 0 1 19.125 6)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute left-[15px] top-0 w-[27px] h-[24px] flex items-center justify-center transition-opacity"
                                >
                                    <svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.62146 2.63465C2.80603 1.13037 4.08356 0 5.59913 0H23.25C24.9069 0 26.25 1.34315 26.25 3V21C26.25 22.6569 24.9068 24 23.25 24H3.39059C1.58882 24 0.193492 22.423 0.412917 20.6346L2.62146 2.63465Z" fill="#EDEDED" />
                                        <g clip-path="url(#clip0_2000_3293_cl)">
                                            <path d="M9.625 11.7502H16.625" stroke="#0E1629" stroke-width="0.5625" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M14.625 13.7502L16.625 11.7502" stroke="#0E1629" stroke-width="0.5625" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M14.625 9.75L16.625 11.75" stroke="#0E1629" stroke-width="0.5625" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2000_3293_cl">
                                                <rect width="12" height="12" fill="white" transform="translate(7.125 6)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Desktop: Grid Layout */}
                    <div className="hidden md:block">
                        <p className="font-['Poppins'] font-semibold text-[#0e1629] text-xl sm:text-2xl leading-normal">
                            College Life @College Name
                        </p>

                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                            <div className="bg-white rounded-[16px] p-3 min-h-[150px] sm:min-h-[170px]">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_2000_3261)">
                                        <path d="M6.66797 6.66667C6.66797 5.95942 6.94892 5.28115 7.44902 4.78105C7.94911 4.28095 8.62739 4 9.33464 4H22.668C23.3752 4 24.0535 4.28095 24.5536 4.78105C25.0537 5.28115 25.3346 5.95942 25.3346 6.66667V25.3333C25.3346 26.0406 25.0537 26.7189 24.5536 27.219C24.0535 27.719 23.3752 28 22.668 28H9.33464C8.62739 28 7.94911 27.719 7.44902 27.219C6.94892 26.7189 6.66797 26.0406 6.66797 25.3333V6.66667Z" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 9.33337H20" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 14.6666H20" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 20H17.3333" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2000_3261">
                                            <rect width="32" height="32" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <p className="mt-4 sm:mt-5 font-['Poppins'] font-semibold text-[#0e1629] text-sm sm:text-base leading-normal">
                                    Mess Food
                                </p>
                                <p className="mt-2 font-['Poppins'] font-normal text-[#6b7280] text-xs sm:text-sm leading-normal">
                                    7/10 - Decent, but get yourself acquainted with local food joints
                                </p>
                            </div>

                            <div className="bg-[#0e1629] rounded-[16px] p-3 min-h-[150px] sm:min-h-[170px]">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_2000_3261)">
                                        <path d="M6.66797 6.66667C6.66797 5.95942 6.94892 5.28115 7.44902 4.78105C7.94911 4.28095 8.62739 4 9.33464 4H22.668C23.3752 4 24.0535 4.28095 24.5536 4.78105C25.0537 5.28115 25.3346 5.95942 25.3346 6.66667V25.3333C25.3346 26.0406 25.0537 26.7189 24.5536 27.219C24.0535 27.719 23.3752 28 22.668 28H9.33464C8.62739 28 7.94911 27.719 7.44902 27.219C6.94892 26.7189 6.66797 26.0406 6.66797 25.3333V6.66667Z" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 9.33337H20" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 14.6666H20" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 20H17.3333" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2000_3261">
                                            <rect width="32" height="32" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <p className="mt-4 sm:mt-5 font-['Poppins'] font-semibold text-[#f5f5f5] text-sm sm:text-base leading-normal">
                                    Campus Vibe
                                </p>
                                <p className="mt-2 font-['Poppins'] font-normal text-[#f5f5f5] text-xs sm:text-sm leading-normal opacity-90">
                                    Competitive yet collaborative. Strong peer learning culture
                                </p>
                            </div>

                            <div className="bg-white rounded-[16px] p-3 min-h-[150px] sm:min-h-[170px]">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-[12px]">
                                    <g clip-path="url(#clip0_2000_3261)">
                                        <path d="M6.66797 6.66667C6.66797 5.95942 6.94892 5.28115 7.44902 4.78105C7.94911 4.28095 8.62739 4 9.33464 4H22.668C23.3752 4 24.0535 4.28095 24.5536 4.78105C25.0537 5.28115 25.3346 5.95942 25.3346 6.66667V25.3333C25.3346 26.0406 25.0537 26.7189 24.5536 27.219C24.0535 27.719 23.3752 28 22.668 28H9.33464C8.62739 28 7.94911 27.719 7.44902 27.219C6.94892 26.7189 6.66797 26.0406 6.66797 25.3333V6.66667Z" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 9.33337H20" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 14.6666H20" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 20H17.3333" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2000_3261">
                                            <rect width="32" height="32" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <p className="mt-4 sm:mt-5 font-['Poppins'] font-semibold text-[#0e1629] text-sm sm:text-base leading-normal">
                                    Attendance
                                </p>
                                <p className="mt-2 font-['Poppins'] font-normal text-[#6b7280] text-xs sm:text-sm leading-normal">
                                    Moderate enforcement. 75% mandatory, but professors are understanding.
                                </p>
                            </div>

                            <div className="bg-[rgba(159,168,184,0.5)] rounded-[16px] p-3 min-h-[150px] sm:min-h-[170px]">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-[12px]">
                                    <g clip-path="url(#clip0_2000_3261)">
                                        <path d="M6.66797 6.66667C6.66797 5.95942 6.94892 5.28115 7.44902 4.78105C7.94911 4.28095 8.62739 4 9.33464 4H22.668C23.3752 4 24.0535 4.28095 24.5536 4.78105C25.0537 5.28115 25.3346 5.95942 25.3346 6.66667V25.3333C25.3346 26.0406 25.0537 26.7189 24.5536 27.219C24.0535 27.719 23.3752 28 22.668 28H9.33464C8.62739 28 7.94911 27.719 7.44902 27.219C6.94892 26.7189 6.66797 26.0406 6.66797 25.3333V6.66667Z" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 9.33337H20" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 14.6666H20" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 20H17.3333" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2000_3261">
                                            <rect width="32" height="32" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <p className="mt-4 sm:mt-5 font-['Poppins'] font-semibold text-[#0e1629] text-sm sm:text-base leading-normal">
                                    Faculty Quality
                                </p>
                                <p className="mt-2 font-['Poppins'] font-normal text-[#6b7280] text-xs sm:text-sm leading-normal">
                                    Excellent. Most are research-active with real-world experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Stories Section */}
            <div className="bg-white">
                <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 md:py-10">
                    {/* Mobile Carousel View */}
                    <div className="md:hidden relative h-[300px]">
                        <p className="font-['Poppins'] font-semibold text-[#0e1629] text-[16px] leading-[20px] mb-6">
                            Success Stories
                        </p>

                        <div className="relative h-[210px] overflow-hidden">
                            {reviews.map((review, idx) => {
                                const position = idx - reviewSlide;
                                let left = '';
                                if (position === 0) left = '0px';
                                else if (position === 1) left = '302px';
                                else if (position < 0) left = '-302px';
                                else left = '600px';

                                return (
                                    <div
                                        key={idx}
                                        className={`absolute transition-all duration-300 w-[290px] ${review.dark ? 'h-[201px] bg-[#0E1629] top-0' : 'h-[186px] bg-white top-[7px] border border-[#f0f0f0]'} rounded-[15px] p-3 shadow-[0px_0px_25px_rgba(0,0,0,0.07)] flex flex-col`}
                                        style={{ left }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#C4C4C4] overflow-hidden">
                                                <img src="/probuddies_leo.png" alt={review.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className={`font-semibold ${review.dark ? 'text-white' : 'text-[#0E1629]'} text-[20px] leading-[30px]`}>{review.name}</p>
                                                <p className={`text-[14px] ${review.dark ? 'text-white' : 'text-[#0E1629]'} opacity-80`}>{review.role}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={`w-4 h-4 ${i < review.stars ? 'text-[#FFA033]' : 'text-[#E5E7EB]'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className={`mt-4 text-center font-medium ${review.dark ? 'text-white' : 'text-[#0E1629]'} text-[16px] leading-[24px]`}>
                                            {review.title}
                                        </p>
                                        <p className={`mt-2 font-normal ${review.dark ? 'text-white' : 'text-[#6B7280]'} text-[12px] leading-[18px] line-clamp-4`}>
                                            {review.content}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Navigation Arrows */}
                        <div className="absolute top-[257px] w-full flex justify-center">
                            <div className="relative w-[57px] h-[24px]">
                                <button
                                    onClick={prevReview}
                                    className="absolute left-[-15.75px] top-0 w-[27px] h-[24px] flex items-center justify-center transition-opacity"
                                >
                                    <svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M23.6285 2.63465C23.444 1.13037 22.1664 0 20.6509 0H3C1.34315 0 5.72205e-06 1.34315 5.72205e-06 3V21C5.72205e-06 22.6569 1.34315 24 3.00001 24H22.8594C24.6612 24 26.0565 22.423 25.8371 20.6346L23.6285 2.63465Z" fill="#EDEDED" />
                                        <g clip-path="url(#clip0_2000_3301_ss)">
                                            <path d="M16.625 11.7502H9.625" stroke="#0E1629" stroke-width="0.5625" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M11.625 13.7502L9.625 11.7502" stroke="#0E1629" stroke-width="0.5625" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M11.625 9.75L9.625 11.75" stroke="#0E1629" stroke-width="0.5625" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2000_3301_ss">
                                                <rect width="12" height="12" fill="white" transform="matrix(-1 0 0 1 19.125 6)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                                <button
                                    onClick={nextReview}
                                    className="absolute left-[15px] top-0 w-[27px] h-[24px] flex items-center justify-center transition-opacity"
                                >
                                    <svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.62146 2.63465C2.80603 1.13037 4.08356 0 5.59913 0H23.25C24.9069 0 26.25 1.34315 26.25 3V21C26.25 22.6569 24.9068 24 23.25 24H3.39059C1.58882 24 0.193492 22.423 0.412917 20.6346L2.62146 2.63465Z" fill="#EDEDED" />
                                        <g clip-path="url(#clip0_2000_3293_ss)">
                                            <path d="M9.625 11.7502H16.625" stroke="#0E1629" stroke-width="0.5625" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M14.625 13.7502L16.625 11.7502" stroke="#0E1629" stroke-width="0.5625" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M14.625 9.75L16.625 11.75" stroke="#0E1629" stroke-width="0.5625" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2000_3293_ss">
                                                <rect width="12" height="12" fill="white" transform="translate(7.125 6)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <p className="font-['Poppins'] font-bold text-[#0e1629] text-xl sm:text-2xl leading-normal text-center">
                            Reviews
                        </p>

                        <div className="mt-6 flex flex-col md:flex-row md:justify-between md:items-end gap-6 md:gap-10">
                            {/* Left card */}
                            <div className="bg-white rounded-[24px] p-4 sm:p-6 text-left shadow-sm flex flex-col w-full md:max-w-[503px]">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/probuddies_leo.png"
                                        alt="Leo"
                                        className="w-14 h-14 sm:w-[70px] sm:h-[70px] shrink-0 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-['Poppins'] font-semibold text-[#0e1629] text-lg sm:text-[22.5px]">Leo</p>
                                        <p className="font-['Poppins'] font-normal text-[#6b7280] text-sm sm:text-[15px]">
                                            Lead Designer
                                        </p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-1 text-[#FFA033]">
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                        <FaRegStar />
                                    </div>
                                </div>
                                <p className="mt-4 font-['Poppins'] font-medium text-[#0e1629] text-base sm:text-[22.5px]">
                                    It was a very good experience
                                </p>
                                <p className="mt-2.5 font-['Poppins'] font-normal text-[#6b7280] text-sm leading-normal">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis
                                    orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam
                                    lacus arcu.
                                </p>
                            </div>

                            {/* Center card */}
                            <div className="bg-[#0E1629] rounded-[24px] p-4 sm:p-6 text-left shadow-2xl md:scale-105 flex flex-col w-full md:max-w-[620px]">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/probuddies_leo.png"
                                        alt="Leo"
                                        className="w-16 h-16 sm:w-[90px] sm:h-[90px] shrink-0 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-['Poppins'] font-semibold text-white text-xl sm:text-[30px]">Leo</p>
                                        <p className="font-['Poppins'] font-normal text-[#6b7280] text-base sm:text-[22px]">
                                            Lead Designer
                                        </p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-1 text-[#FFA033]">
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                        <FaRegStar />
                                    </div>
                                </div>
                                <p className="mt-4 font-['Poppins'] font-medium text-white text-lg sm:text-[30px] leading-normal">
                                    It was a very good experience
                                </p>
                                <p className="mt-3 font-['Poppins'] font-normal text-[#f5f5f5] text-sm sm:text-lg leading-normal opacity-90">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis
                                    orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam
                                    lacus arcu.
                                </p>
                            </div>

                            {/* Right card */}
                            <div className="bg-white rounded-[24px] p-4 sm:p-6 text-left shadow-sm flex flex-col w-full md:max-w-[460px]">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/probuddies_leo.png"
                                        alt="Leo"
                                        className="w-14 h-14 sm:w-[70px] sm:h-[70px] shrink-0 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-['Poppins'] font-semibold text-[#0e1629] text-lg sm:text-[22.5px]">Leo</p>
                                        <p className="font-['Poppins'] font-normal text-[#6b7280] text-sm sm:text-[15px]">
                                            Lead Designer
                                        </p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-1 text-[#FFA033]">
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                        <FaRegStar />
                                    </div>
                                </div>
                                <p className="mt-4 font-['Poppins'] font-medium text-[#0e1629] text-base sm:text-[22.5px]">
                                    It was a very good experience
                                </p>
                                <p className="mt-2.5 font-['Poppins'] font-normal text-[#6b7280] text-sm leading-normal">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis
                                    orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam
                                    lacus arcu.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                            <button className="absolute left-1/2 -translate-x-1/2 top-[183px] w-[246px] h-[48px] bg-white rounded-[12px] font-['Poppins'] font-medium text-[16px] text-[#2F43F2]">
                                Book An Appointment
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
                            <button className="mt-6 bg-[#2f43f2] rounded-[12px] px-4 py-2.5 w-full max-w-[357px] font-['Poppins'] font-medium text-base text-white">
                                Book An Appointment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
