import { Link, useParams } from 'react-router-dom';
import { Clock, MapPin, Users, ChevronRight } from 'lucide-react';
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
        <div className="bg-white rounded-[16px] p-[12px] w-full xl:w-[580px]">
            <div className="flex items-start justify-between">
                <p className="font-['Poppins'] font-medium text-[#6b7280] text-[14px] leading-[normal]">
                    30-min Video call
                </p>
                <div className="flex items-center gap-[8px]">
                    <Clock className="w-[20px] h-[20px] text-[#6b7280]" />
                    <p className="font-['Poppins'] font-medium text-[#6b7280] text-[14px] leading-[normal] whitespace-nowrap">
                        Usually replies in 2 Hrs
                    </p>
                </div>
            </div>

            <div className="mt-[12px] flex items-center gap-[12px]">
                <p className="font-['Poppins'] font-semibold text-[#0e1629] text-[18px] leading-[normal]">
                    ₹ 1,499
                </p>
                <p className="font-['Poppins'] font-normal text-[#6b7280] text-[14px] leading-[normal] line-through [text-decoration-skip-ink:none]">
                    ₹ 2,499
                </p>
                <div className="bg-[#e6efec] rounded-[16px] px-[12px] py-[2px]">
                    <p className="font-['Poppins'] font-medium text-[#25a777] text-[10px] leading-[normal]">
                        40% off
                    </p>
                </div>
            </div>

            <button className="mt-[12px] w-full bg-[#0e1629] rounded-[12px] px-[16px] py-[10px] font-['Poppins'] font-medium text-[16px] text-white">
                Book An Appointment
            </button>

            <p className="mt-[10px] text-center font-['Poppins'] font-medium text-[#6b7280] text-[14px] leading-[normal]">
                Free rescheduling • 100% satisfaction guarantee
            </p>
        </div>
    );
}

function Divider() {
    return <div className="h-[1px] w-full bg-[#efefef]" />;
}

export default function ProBuddyProfilePageFigma() {
    useParams();

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
                <div className="backdrop-blur-[2px] bg-white border-b border-[#f5f5f5] h-[48px] flex items-center px-[16px] md:px-[80px]">
                    <div className="flex items-center gap-[8px] font-['Poppins'] text-[16px] leading-[normal]">
                        <Link to="/probuddy" className="text-[#6b7280] font-normal hover:text-[#2f43f2]">
                            ProBuddy
                        </Link>
                        <ChevronRight className="w-[16px] h-[16px] text-[#6b7280]" />
                        <Link to="/probuddy/list" className="text-[#6b7280] font-medium hover:text-[#2f43f2]">
                            List of ProBuddy
                        </Link>
                        <ChevronRight className="w-[16px] h-[16px] text-[#6b7280]" />
                        <span className="text-[#0e1629] font-medium">Aditya Kumar Sharma</span>
                    </div>
                </div>

                {/* Profile + Booking */}
                <div className="px-[16px] md:px-[60px] pt-[40px] pb-[40px]">
                    <div className="grid grid-cols-1 xl:grid-cols-[716px_580px] gap-[24px] items-start">
                        {/* Left Card */}
                        <div className="bg-white rounded-[16px] p-[12px] w-full xl:w-[716px]">
                            <div className="flex gap-[12px]">
                                <div className="shrink-0 w-[119px] h-[119px] rounded-[8px] border border-[#efefef] overflow-hidden bg-[#d9d9d9]">
                                    <img
                                        src="/probuddies_aaditya.jpg"
                                        alt="Aditya Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1">
                                    <p className="font-['Poppins'] font-semibold text-[#0e1629] text-[24px] leading-[1.25]">
                                        Aditya Kumar Sharma
                                    </p>
                                    <p className="mt-[8px] font-['Poppins'] font-semibold text-[#2f43f2] text-[16px] leading-[1.25]">
                                        3rd Year B.Tech Student
                                    </p>
                                    <p className="mt-[8px] font-['Poppins'] font-medium text-[#6b7280] text-[14px] tracking-[0.28px]">
                                        IIT Delhi • Computer Science Engineering
                                    </p>

                                    <div className="mt-[12px] flex flex-col gap-[8px]">
                                        <div className="flex flex-wrap items-center gap-[16px]">
                                            <div className="flex items-center gap-[8px]">
                                                <FaStar className="text-[#FACC14] text-[20px]" />
                                                <p className="font-['Poppins'] text-[#6b7280] text-[14px] tracking-[0.32px]">
                                                    <span className="font-medium">4.0 </span>
                                                    <span className="font-normal">(128 reviews)</span>
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-[4px]">
                                                <Users className="w-[20px] h-[20px] text-[#6b7280]" />
                                                <p className="font-['Poppins'] font-medium text-[#6b7280] text-[14px] tracking-[0.28px]">
                                                    850+ students helped
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-[4px]">
                                                <MapPin className="w-[20px] h-[20px] text-[#6b7280]" />
                                                <p className="font-['Poppins'] font-medium text-[#6b7280] text-[14px] tracking-[0.28px]">
                                                    Delhi, India
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-[8px]">
                                            <div className="min-w-[80px] flex items-center justify-center bg-[#e6efec] rounded-[16px] px-[12px] py-[4px]">
                                                <p className="font-['Poppins'] font-medium text-[#25a777] text-[12px] leading-[normal]">
                                                    Hindi
                                                </p>
                                            </div>
                                            <div className="min-w-[80px] flex items-center justify-center bg-[#e6efec] rounded-[16px] px-[12px] py-[4px]">
                                                <p className="font-['Poppins'] font-medium text-[#25a777] text-[12px] leading-[normal]">
                                                    English
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-[12px]">
                                <Divider />
                            </div>

                            <div className="py-[8px] flex flex-wrap items-center gap-[20px]">
                                <a
                                    href="#"
                                    className="flex items-center gap-[8px] font-['Poppins'] font-medium text-[#6b7280] text-[14px] tracking-[0.28px]"
                                >
                                    <FaInstagram className="text-[20px] text-[#E4405F]" />
                                    instagramid
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center gap-[8px] font-['Poppins'] font-medium text-[#6b7280] text-[14px] tracking-[0.28px]"
                                >
                                    <FaLinkedin className="text-[20px] text-[#0A66C2]" />
                                    instagramid
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center gap-[8px] font-['Poppins'] font-medium text-[#6b7280] text-[14px] tracking-[0.28px]"
                                >
                                    <FaInstagram className="text-[20px] text-[#E4405F]" />
                                    instagramid
                                </a>
                            </div>

                            <Divider />

                            <div className="mt-[16px]">
                                <p className="font-['Poppins'] font-semibold text-[#0e1629] text-[20px] leading-[normal]">
                                    About me
                                </p>

                                    <div className="mt-[12px] bg-[#f3f7f6] rounded-[12px] p-[12px]">
                                    <div className="flex gap-[12px] items-start">
                                        <img
                                            src="/probuddies_career_icon.png"
                                            alt="Career Transition"
                                            className="w-[48px] h-[48px] shrink-0 rounded-[10.667px] object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="font-['Poppins'] font-semibold text-[#0e1629] text-[16px] leading-[normal]">
                                                Career Transition Strategy
                                            </p>
                                            <p className="mt-[4px] font-['Poppins'] font-normal text-[#6b7280] text-[12px] leading-[normal]">
                                                Specialized in tech &amp; management roles
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-[12px] font-['Poppins'] font-normal text-[#6b7280] text-[14px] leading-[normal]">
                                        I've helped 850+ aspiring students navigate their college journey at IIT Delhi.
                                        Passionate about making the admission process less stressful and sharing real
                                        college insights that matter. Currently in 3rd year, been through it all - exams,
                                        placements, hostel life, branch selection.
                                    </p>
                                </div>

                                <p className="mt-[20px] font-['Poppins'] font-semibold text-[#0e1629] text-[20px] leading-[normal]">
                                    Who Should Connect With Me?
                                </p>
                                <p className="mt-[12px] font-['Poppins'] font-medium text-[#6b7280] text-[16px] leading-[normal]">
                                    Connect with me if you want real, unfiltered advice about IIT admission, competitive
                                    exam preparation, and actual college life (not just the Instagram version!)
                                </p>
                            </div>
                        </div>

                        {/* Right Card */}
                        <BookingCard />
                    </div>
                </div>

                {/* How I Can Help You */}
                <div className="mt-[40px] px-[16px] md:px-[60px] pb-[40px]">
                    <p className="font-['Poppins'] font-semibold text-[#0e1629] text-[24px] leading-[normal]">
                        How I Can Help You
                    </p>

                    <div className="mt-[20px] grid grid-cols-1 xl:grid-cols-[656px_638px] gap-[24px] items-start">
                        
                            <div className="w-full h-[360px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                        <PolarGrid stroke="#E5E7EB" />
                                        <PolarAngleAxis
                                            dataKey="subject"
                                            tick={{
                                                fill: '#2f43f2',
                                                fontSize: 14,
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
                    

                        <div className="w-full">
                            <p className="font-['Poppins'] font-medium text-[#0e1629] text-[16px] leading-[normal]">
                                Overall Rating
                            </p>

                            <div className="mt-[12px] flex justify-between font-['Poppins'] font-medium text-[#0e1629] text-[14px] leading-[normal]">
                                <span>1</span>
                                <span>5</span>
                                <span>10</span>
                            </div>
                            <div
                                className="mt-[10px] h-[28px] rounded-[24px]"
                                style={{
                                    background:
                                        'linear-gradient(90deg, rgb(250, 102, 15) 0%, rgb(255, 214, 66) 36.01%, rgb(129, 192, 65) 64.368%, rgb(34, 197, 93) 100%)',
                                }}
                            />
                            <p className="mt-[10px] font-['Poppins'] font-normal text-[#6b7280] text-[14px] leading-[normal]">
                                Hover over the chart to see detailed scores
                            </p>

                            <div className="mt-[18px] bg-white rounded-[16px] border border-[#efefef] p-[16px]">
                                <p className="font-['Poppins'] font-semibold text-[#0e1629] text-[18px] leading-[normal]">
                                    Key Insights
                                </p>

                                <div className="mt-[16px] space-y-[16px]">
                                    <div className="flex gap-[12px] items-start">
                                        <FaCheckCircle className="text-[#2f43f2] text-[20px] mt-[2px]" />
                                        <div>
                                            <p className="font-['Poppins'] font-medium text-[#0e1629] text-[16px] leading-[normal]">
                                                Interview Prep
                                            </p>
                                            <p className="mt-[6px] font-['Poppins'] font-normal text-[#6b7280] text-[14px] leading-[normal]">
                                                Real prep strategies for internships and placements based on actual
                                                experiences
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-[12px] items-start">
                                        <FaCheckCircle className="text-[#2f43f2] text-[20px] mt-[2px]" />
                                        <div>
                                            <p className="font-['Poppins'] font-medium text-[#0e1629] text-[16px] leading-[normal]">
                                                Exam Strategy
                                            </p>
                                            <p className="mt-[6px] font-['Poppins'] font-normal text-[#6b7280] text-[14px] leading-[normal]">
                                                Effective study techniques that work - not just theoretical advice.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-[12px] items-start">
                                        <FaCheckCircle className="text-[#2f43f2] text-[20px] mt-[2px]" />
                                        <div>
                                            <p className="font-['Poppins'] font-medium text-[#0e1629] text-[16px] leading-[normal]">
                                                Placement Tips
                                            </p>
                                            <p className="mt-[6px] font-['Poppins'] font-normal text-[#6b7280] text-[14px] leading-[normal]">
                                                Insights on 98.6% percentile preparation strategies.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* College Life */}
                <div className="mt-[40px] px-[16px] md:px-[60px] pb-[40px]">
                    <p className="font-['Poppins'] font-semibold text-[#0e1629] text-[24px] leading-[normal]">
                        College Life @College Name
                    </p>

                    <div className="mt-[20px] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[24px]">
                        <div className="bg-white rounded-[16px] p-[12px] h-[170px]">
                            <img
                                src="/probuddies_campus_black.svg"
                                alt="Mess food icon"
                                className="w-[40px] h-[40px] object-contain"
                            />
                            <p className="mt-[18px] font-['Poppins'] font-semibold text-[#0e1629] text-[16px] leading-[normal]">
                                Mess Food
                            </p>
                            <p className="mt-[8px] font-['Poppins'] font-normal text-[#6b7280] text-[14px] leading-[normal]">
                                7/10 - Decent, but get yourself acquainted with local food joints
                            </p>
                        </div>

                        <div className="bg-[#0e1629] rounded-[16px] p-[12px] h-[170px]">
                            <img
                                src="/probuddies_campus_white.svg"
                                alt="Campus vibe icon"
                                className="w-[40px] h-[40px] object-contain"
                            />
                            <p className="mt-[18px] font-['Poppins'] font-semibold text-[#f5f5f5] text-[16px] leading-[normal]">
                                Campus Vibe
                            </p>
                            <p className="mt-[8px] font-['Poppins'] font-normal text-[#f5f5f5] text-[14px] leading-[normal] opacity-90">
                                Competitive yet collaborative. Strong peer learning culture
                            </p>
                        </div>

                        <div className="bg-white rounded-[16px] p-[12px] h-[170px]">
                            <img
                                src="/probuddies_campus_black.svg"
                                alt="Attendance icon"
                                className="w-[40px] h-[40px] object-contain"
                            />
                            <p className="mt-[18px] font-['Poppins'] font-semibold text-[#0e1629] text-[16px] leading-[normal]">
                                Attendance
                            </p>
                            <p className="mt-[8px] font-['Poppins'] font-normal text-[#6b7280] text-[14px] leading-[normal]">
                                Moderate enforcement. 75% mandatory, but professors are understanding.
                            </p>
                        </div>

                        <div className="bg-[rgba(159,168,184,0.5)] rounded-[16px] p-[12px] h-[170px]">
                            <img
                                src="/probuddies_campus_black.svg"
                                alt="Faculty quality icon"
                                className="w-[40px] h-[40px] object-contain"
                            />
                            <p className="mt-[18px] font-['Poppins'] font-semibold text-[#0e1629] text-[16px] leading-[normal]">
                                Faculty Quality
                            </p>
                            <p className="mt-[8px] font-['Poppins'] font-normal text-[#6b7280] text-[14px] leading-[normal]">
                                Excellent. Most are research-active with real-world experience.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews - full-width background */}
            <div className="bg-white">
                <div className="max-w-[1440px] mx-auto px-[16px] md:px-[60px] py-[40px] text-center">
                    <p className="font-['Poppins'] font-bold text-[#0e1629] text-[24px] leading-[normal]">
                        Reviews
                    </p>
                    <br />

                    <div className="mt-[24px] flex flex-col md:flex-row md:justify-between md:items-end gap-[55px]">
                        {/* Left card */}
                        <div className="bg-white rounded-[24px] p-[24px] text-left shadow-sm flex flex-col md:w-[503px] md:h-[317px]">
                            <div className="flex items-center gap-[12px]">
                                <img
                                    src="/probuddies_leo.png"
                                    alt="Leo"
                                    className="w-[70px] h-[70px] shrink-0 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-['Poppins'] font-semibold text-[#0e1629] text-[22.5px]">Leo</p>
                                    <p className="font-['Poppins'] font-normal text-[#6b7280] text-[15px]">
                                        Lead Designer
                                    </p>
                                </div>
                                <div className="ml-auto flex items-center gap-[4px] text-[#FFA033]">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaRegStar />
                                </div>
                            </div>
                            <p className="mt-[16px] font-['Poppins'] font-medium text-[#0e1629] text-[22.5px]">
                                It was a very good experience
                            </p>
                            <p className="mt-[10px] font-['Poppins'] font-normal text-[#6b7280] text-[14px] leading-[normal]">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis
                                orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam
                                lacus arcu.
                            </p>
                        </div>

                        {/* Center card */}
                        <div className="bg-[#0E1629] rounded-[24px] p-[24px] text-left shadow-2xl md:scale-105 flex flex-col md:w-[620px] md:h-[417px]">
                            <div className="flex items-center gap-[12px]">
                                <img
                                    src="/probuddies_leo.png"
                                    alt="Leo"
                                    className="w-[90px] h-[90px] shrink-0 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-['Poppins'] font-semibold text-white text-[30px]">Leo</p>
                                    <p className="font-['Poppins'] font-normal text-[#6b7280] text-[22px]">
                                        Lead Designer
                                    </p>
                                </div>
                                <div className="ml-auto flex items-center gap-[4px] text-[#FFA033]">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaRegStar />
                                </div>
                            </div>
                            <p className="mt-[18px] font-['Poppins'] font-medium text-white text-[30px] leading-[normal]">
                                It was a very good experience
                            </p>
                            <p className="mt-[12px] font-['Poppins'] font-normal text-[#f5f5f5] text-[18px] leading-[normal] opacity-90">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis
                                orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam
                                lacus arcu.
                            </p>
                        </div>

                        {/* Right card */}
                        <div className="bg-white rounded-[24px] p-[24px] text-left shadow-sm flex flex-col md:w-[460px] md:h-[317px]">
                            <div className="flex items-center gap-[12px]">
                                <img
                                    src="/probuddies_leo.png"
                                    alt="Leo"
                                    className="w-[70px] h-[70px] shrink-0 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-['Poppins'] font-semibold text-[#0e1629] text-[22.5px]">Leo</p>
                                    <p className="font-['Poppins'] font-normal text-[#6b7280] text-[15px]">
                                        Lead Designer
                                    </p>
                                </div>
                                <div className="ml-auto flex items-center gap-[4px] text-[#FFA033]">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaRegStar />
                                </div>
                            </div>
                            <p className="mt-[16px] font-['Poppins'] font-medium text-[#0e1629] text-[22.5px]">
                                It was a very good experience
                            </p>
                            <p className="mt-[10px] font-['Poppins'] font-normal text-[#6b7280] text-[14px] leading-[normal]">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis
                                orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam
                                lacus arcu.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer to show main background between sections */}
            <div className="h-[40px]" />

            {/* Footer CTA */}
            <div className="bg-white">
                <div className="max-w-[1440px] mx-auto border-t border-[#E5E7EB]">
                    <div className="py-[40px] md:py-[60px] text-center px-[16px]">
                        <p className="font-['Poppins'] font-semibold text-[#0e1629] text-[24px] leading-[1.25]">
                            Ready to Make Your College Decision?
                        </p>
                        <p className="mt-[12px] font-['Poppins'] font-normal text-[#6b7280] text-[16px] leading-[normal]">
                            Book a session with Aditya and get personalized guidance for your unique situation
                        </p>
                        <button className="mt-[24px] bg-[#2f43f2] rounded-[12px] px-[16px] py-[10px] w-[357px] max-w-full font-['Poppins'] font-medium text-[16px] text-white">
                            Book An Appointment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
