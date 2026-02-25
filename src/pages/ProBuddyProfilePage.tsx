import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Users } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaInstagram, FaLinkedin, FaStar, FaFacebook, FaXTwitter } from 'react-icons/fa6';
import { FaCheckCircle } from 'react-icons/fa';

const radarData = [
    { subject: 'Mess Food', A: 8, fullMark: 10 },
    { subject: 'Time Management', A: 8, fullMark: 10 },
    { subject: 'Exam Strategy', A: 9, fullMark: 10 },
    { subject: 'Career Guidance', A: 6, fullMark: 10 },
    { subject: 'Campus Navigation', A: 9, fullMark: 10 },
];

export default function ProBuddyProfilePage() {
    useParams(); // Just calling it if needed for future, or remove completely

    return (
        <div className="bg-[#F8F9FA] min-h-screen pb-20">
            {/* Breadcrumb Navigation */}
            <div className="bg-white py-3 px-4 md:px-10 border-b border-gray-100 mb-6">
                <div className="max-w-7xl mx-auto flex items-center text-sm text-gray-500">
                    <Link to="/probuddy" className="hover:text-blue-600 transition-colors">ProBuddy</Link>
                    <span className="mx-2">→</span>
                    <Link to="/probuddy/list" className="hover:text-blue-600 transition-colors">List of ProBuddy</Link>
                    <span className="mx-2">→</span>
                    <span className="text-gray-900 font-medium tracking-wide">Aditya Kumar Sharma</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column - Main Profile Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Profile Header Box */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                            {/* Profile Image */}
                            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                                <img
                                    src="/probuddies_aaditya.jpg"
                                    alt="Aditya Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-2xl md:text-[28px] font-bold text-gray-900 leading-tight">Aditya Kumar Sharma</h1>
                                        <p className="text-blue-600 font-semibold text-lg">3rd Year B.Tech Student</p>
                                        <p className="text-gray-500 text-sm mt-1 tracking-wide">IIT Delhi • Computer Science Engineering</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium pt-1">
                                    <div className="flex items-center gap-1.5">
                                        <FaStar className="text-yellow-400 text-lg" />
                                        <span className="text-gray-900 font-bold">4.0</span>
                                        <span className="text-gray-400 font-normal">(128 reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span>850+ students helped</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>Delhi, India</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-1">
                                    <span className="px-4 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full tracking-wide">Hindi</span>
                                    <span className="px-4 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full tracking-wide">English</span>
                                </div>
                            </div>
                        </div>

                        <hr className="my-6 border-gray-100" />

                        {/* Social Links */}
                        <div className="flex flex-wrap gap-6 pt-2">
                            
                            <a href="#" className="flex items-center gap-2 group text-gray-600 hover:text-blue-600 transition-colors tracking-wide text-sm font-medium">
                                <FaLinkedin className="text-blue-500 text-xl" />
                                <span>linkedinid</span>
                            </a>
                            <a href="#" className="flex items-center gap-2 group text-gray-600 hover:text-pink-600 transition-colors tracking-wide text-sm font-medium">
                                <FaFacebook className="text-blue-500 text-xl" />
                                <span>facebookid</span>
                            </a>
                            <a href="#" className="flex items-center gap-2 group text-gray-600 hover:text-pink-600 transition-colors tracking-wide text-sm font-medium">
                                <FaInstagram className="text-pink-500 text-xl" />
                                <span>instagramid</span>
                            </a>
                            <a href="#" className="flex items-center gap-2 group text-gray-600 hover:text-pink-600 transition-colors tracking-wide text-sm font-medium">
                                <FaXTwitter className="text-black-500 text-xl" />
                                <span>twitterid</span>
                            </a>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">About me</h2>

                        {/* Highlight Box */}
                        <div className="bg-[#F8F9FA] rounded-2xl p-5 mb-6 flex gap-4 items-start border border-gray-100">
                        
                                <img
                                    src="/probuddies_career_icon.png"
                                    alt="Aditya Profile"
                                    className="w-12 h-12 object-cover"
                                />
                           
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Career Transition Strategy</h3>
                                <p className="text-sm text-gray-500 font-medium">Specialized in tech & management roles</p>
                                <p className="mt-3 text-gray-600 text-sm leading-relaxed tracking-wide">
                                    I've helped 850+ aspiring students navigate their college journey at IIT Delhi. Passionate about making the admission process less stressful and sharing real college insights that matter. Currently in 3rd year, been through it all - exams, placements, hostel life, branch selection.
                                </p>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-3 mt-8">Who Should Connect With Me?</h3>
                        <p className="text-gray-600 leading-relaxed font-medium tracking-wide">
                            Connect with me if you want real, unfiltered advice about IIT admission, competitive exam preparation, and actual college life (not just the Instagram version!)
                        </p>
                    </div>

                </div>

                {/* Right Column - Booking Cards */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Booking Card 1 */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4 font-semibold text-sm">
                            <span className="text-gray-700">30-min Video call</span>
                            <div className="flex items-center gap-1.5 text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>Usually replies in 2 Hrs</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl font-bold text-gray-900">₹ 1,499</span>
                            <span className="text-gray-400 line-through text-lg font-medium">₹ 2,499</span>
                            <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded text-xs font-bold ml-1">40% off</span>
                        </div>

                        <button className="w-full bg-[#111827] hover:bg-black text-white py-4 rounded-xl font-bold text-lg transition-colors">
                            Book An Appointment
                        </button>

                        <p className="text-center text-xs text-gray-500 font-medium tracking-wide mt-4">
                            Free rescheduling • 100% satisfaction guarantee
                        </p>
                    </div>
                </div>
            </div>
            {/* Full Width Sections */}
            <div className="max-w-7xl mx-auto px-4 md:px-10 space-y-8 mt-8">
                    {/* How I Can Help You - Radar Chart */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">How I Can Help You</h2>
                        <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col md:flex-row gap-8 items-center">

                            <div className="w-full md:w-1/2 h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                        <PolarGrid stroke="#E5E7EB" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#3B82F6', fontSize: 13, fontWeight: 500 }} />
                                        <Radar name="Score" dataKey="A" stroke="#3B82F6" strokeWidth={2} fill="#3B82F6" fillOpacity={0.15} />
                                        <Tooltip cursor={false} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="w-full md:w-1/2 space-y-6">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">Overall Rating</h3>
                                    <div className="flex justify-between text-sm text-gray-500 font-bold mb-2">
                                        <span>1</span>
                                        <span>5</span>
                                        <span>10</span>
                                    </div>
                                    {/* Gradient Rating Bar */}
                                    <div className="h-4 w-full rounded-full bg-gradient-to-r from-orange-400 via-yellow-400 to-green-500 shadow-inner"></div>
                                    <p className="text-xs text-gray-400 mt-2 font-medium">Hover over the chart to see detailed scores</p>
                                </div>

                                <div className="bg-white border text-left border-gray-200 rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-900 text-lg mb-5">Key Insights</h3>
                                    <ul className="space-y-5 text-sm">
                                        <li className="flex gap-4 items-start">
                                            <FaCheckCircle className="text-blue-600 text-xl mt-0.5 flex-shrink-0" />
                                            <div>
                                                <span className="font-bold text-gray-900 block mb-1">Interview Prep</span>
                                                <span className="text-gray-500 leading-tight block">Real prep strategies for internships and placements based on actual experiences.</span>
                                            </div>
                                        </li>
                                        <li className="flex gap-4 items-start">
                                            <FaCheckCircle className="text-blue-600 text-xl mt-0.5 flex-shrink-0" />
                                            <div>
                                                <span className="font-bold text-gray-900 block mb-1">Exam Strategy</span>
                                                <span className="text-gray-500 leading-tight block">Effective study techniques that work - not just theoretical advice.</span>
                                            </div>
                                        </li>
                                        <li className="flex gap-4 items-start">
                                            <FaCheckCircle className="text-blue-600 text-xl mt-0.5 flex-shrink-0" />
                                            <div>
                                                <span className="font-bold text-gray-900 block mb-1">Placement Tips</span>
                                                <span className="text-gray-500 leading-tight block">Insights on 98.6% percentile preparation strategies.</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* College Life Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">College Life @College Name</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-48">
                                <div className="bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.6a2 2 0 011.41.59l4.4 4.4A2 2 0 0119 9.4V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Mess Food</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">7/10 - Decent, but get yourself acquainted with local food joints</p>
                                </div>
                            </div>

                            <div className="bg-[#111827] text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between h-48">
                                <div className="bg-gray-800 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.6a2 2 0 011.41.59l4.4 4.4A2 2 0 0119 9.4V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-2">Campus Vibe</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed font-medium">Competitive yet collaborative. Strong peer learning culture</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-48">
                                <div className="bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.6a2 2 0 011.41.59l4.4 4.4A2 2 0 0119 9.4V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Attendance</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">Moderate enforcement. 75% mandatory, but professors are understanding.</p>
                                </div>
                            </div>

                            <div className="bg-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between h-48">
                                <div className="bg-[#CBD5E1] w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-gray-700">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.6a2 2 0 011.41.59l4.4 4.4A2 2 0 0119 9.4V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Faculty Quality</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed font-medium">Excellent. Most are research-active with real-world experience.</p>
                                </div>
                            </div>

                        </div>
                    </div>

            </div>

            {/* Reviews Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-10 mt-24 text-center">
                <h2 className="text-[32px] font-bold text-gray-900 mb-12">Reviews</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

                    {/* Side Review (Faded/Smaller) */}
                    <div className="bg-white border text-left border-gray-100 rounded-[32px] p-8 shadow-sm opacity-100 transform scale-95 mx-auto w-full max-w-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <img src="/probuddies_leo.png" alt="Leo" className="w-14 h-14 rounded-full" />
                            <div>
                                <h4 className="font-bold text-xl text-gray-900">Leo</h4>
                                <p className="text-sm text-gray-500 font-medium">Lead Designer</p>
                            </div>
                            <div className="ml-auto flex text-yellow-400 gap-1 text-sm">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-gray-300" />
                            </div>
                        </div>
                        <h5 className="font-bold text-xl text-gray-900 mb-4">It was a very good experience</h5>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectur maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.
                        </p>
                    </div>

                    {/* Center Review (Focused/Dark) */}
                    <div className="bg-[#0B1528] text-left text-white rounded-[32px] p-10 shadow-2xl z-10 mx-auto w-full max-w-md transform scale-105">
                        <div className="flex items-center gap-4 mb-6">
                            <img src="/probuddies_leo.png" alt="Leo" className="w-16 h-16 rounded-full border-2 border-white/10" />
                            <div>
                                <h4 className="font-bold text-2xl">Leo</h4>
                                <p className="text-sm text-gray-400 font-medium mt-1">Lead Designer</p>
                            </div>
                            <div className="ml-auto flex text-yellow-400 gap-1.5 text-lg">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-gray-600" />
                            </div>
                        </div>
                        <h5 className="font-bold text-[26px] leading-tight text-white mb-5">It was a very good experience</h5>
                        <p className="text-[15px] text-gray-300 leading-relaxed font-medium">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectur maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.
                        </p>
                    </div>

                    {/* Side Review (Faded/Smaller) */}
                    <div className="bg-white border text-left border-gray-100 rounded-[32px] p-8 shadow-sm opacity-100 transform scale-95 mx-auto w-full max-w-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <img src="/probuddies_leo.png" alt="Leo" className="w-14 h-14 rounded-full" />
                            <div>
                                <h4 className="font-bold text-xl text-gray-900">Leo</h4>
                                <p className="text-sm text-gray-500 font-medium">Lead Designer</p>
                            </div>
                            <div className="ml-auto flex text-yellow-400 gap-1 text-sm">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-gray-300" />
                            </div>
                        </div>
                        <h5 className="font-bold text-xl text-gray-900 mb-4">It was a very good experience</h5>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectur maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.
                        </p>
                    </div>

                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-white py-20 mt-24 text-center px-4">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h2 className="text-[32px] md:text-[40px] font-bold text-gray-900 leading-tight">Ready to Make Your College Decision?</h2>
                    <p className="text-gray-600 text-lg md:text-xl font-medium tracking-wide">
                        Book a session with Aditya and get personalized guidance for your unique situation
                    </p>
                    <button className="mt-8 bg-[#2563EB] hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-blue-500/30">
                        Book An Appointment
                    </button>
                </div>
            </div>

        </div>
    );
}

