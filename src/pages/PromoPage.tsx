import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  Clock,
  Users,
  Video,
  UserCheck,
  MessageCircleQuestion,
  FileText,
  BookOpen,
  Target,
  ChevronUp,
  Quote,
  CheckCheck,
  ChevronRight,
} from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { useAuthStore } from "@/store/AuthStore";
import { useAllCounselors } from "@/hooks/useCounselors";

export default function PromoPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showBottomBar, setShowBottomBar] = useState(true);
  const lastScrollY = useRef(0);
  const { toggleLogin } = useAuthStore();
  const { data: counselors = [] } = useAllCounselors(4);

  const handleFaqToggle = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleEnrollNow = () => {
    toggleLogin();
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show bar at top or when scrolling up
      if (currentScrollY < 100) {
        setShowBottomBar(true);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        setShowBottomBar(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setShowBottomBar(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Video,
      title: "Live training sessions that focus on clarity and mastery",
      description:
        "Get a combination of live strategy/doubt sessions and recorded detailed lectures for fast understanding. Learn anytime, anywhere.",
    },
    {
      icon: UserCheck,
      title: "Dedicated personal mentor to eliminate weaknesses",
      description:
        "Get a dedicated personal mentor to eliminate weaknesses and provide one-on-one guidance throughout your journey.",
    },
    {
      icon: MessageCircleQuestion,
      title: "Doubt-clearing access to ensure zero confusion",
      description:
        "Doubt-clearing access to ensure zero confusion. Get your questions answered quickly by experts.",
    },
    {
      icon: FileText,
      title: "Practical assignments and mock tests to build readiness",
      description:
        "Take CET-pattern full-length mock tests designed to match real exam difficulty, timing, and marking scheme.",
    },
    {
      icon: BookOpen,
      title: "Structured Chapter-wise PYQs for Students",
      description:
        "Access chapter-wise and topic-wise Previous Year Questions so you understand exactly which concepts repeat every year.",
    },
    {
      icon: Target,
      title: "Tailored College Selection Guidance",
      description:
        "Guided college shortlisting to avoid guesswork. We help you pick the right colleges based on your profile.",
    },
  ];

  const benefits = [
    "Trained 1000+ students to date",
    "More than 80% success rate for top-tier college admissions",
    "Focus on strategy, not rote memory",
    "Scholarship and interview preparation included",
  ];

  const colleges = [
    "IITs",
    "NITs",
    "SP Jain",
    "NMIMS",
    "MIT Pune",
    "Christ University",
    "Symbiosis",
    "SRCC",
    "Leading DU Colleges",
  ];

  // Use counselors from API or fallback to default instructors
  const defaultInstructors = [
    {
      name: "Shiv",
      role: "Mathematics Faculty",
      experience: "10+ years experience",
      description:
        "A highly experienced Mathematics faculty known for his clear explanations, smart shortcuts, and exam-oriented teaching. He specializes in simplifying tough concepts.",
      image: "/profile1.jpg",
    },
    {
      name: "Shiv",
      role: "Mathematics Faculty",
      experience: "10+ years experience",
      description:
        "A highly experienced Mathematics faculty known for his clear explanations, smart shortcuts, and exam-oriented teaching. He specializes in simplifying tough concepts.",
      image: "/profile1.jpg",
    },
    {
      name: "Aaditya Dahale",
      role: "Mathematics Faculty",
      experience: "10+ years experience",
      description:
        "Strategy Planner & Mentor, who has guided and mentored more than 75,000 MHT CET aspirants with clear planning, smart strategies, and result-oriented direction.",
      image: "/profile2.jpg",
    },
    {
      name: "Prathmesh Hatwar",
      role: "Mathematics Faculty",
      experience: "10+ years experience",
      description:
        "A highly experienced Mathematics faculty known for his clear explanations, smart shortcuts, and exam-oriented teaching. He specializes in simplifying tough concepts.",
      image: "/profile1.jpg",
    },
  ];

  const instructors =
    counselors.length >= 4
      ? counselors.slice(0, 4).map((counselor, index) => ({
          name: `${counselor.firstName} ${counselor.lastName}`,
          role: "Mathematics Faculty",
          experience: counselor.experience
            ? `${counselor.experience} years experience`
            : "10+ years experience",
          description:
            defaultInstructors[index]?.description ||
            "A highly experienced Mathematics faculty known for his clear explanations, smart shortcuts, and exam-oriented teaching.",
          image:
            counselor.photoUrlSmall ||
            defaultInstructors[index]?.image ||
            "/profile1.jpg",
        }))
      : defaultInstructors;

  const testimonials = [
    {
      name: "Shiv",
      role: "Mathematics Faculty",
      rating: 5,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna",
      image: "/profile1.jpg",
    },
    {
      name: "Shiv",
      role: "Mathematics Faculty",
      rating: 5,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna",
      image: "/profile1.jpg",
    },
    {
      name: "Shiv",
      role: "Mathematics Faculty",
      rating: 5,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna",
      image: "/profile1.jpg",
    },
  ];

  const faqs = [
    {
      question: "Are there any hidden fees?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      question: "Are there any hidden fees?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      question: "Are there any hidden fees?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      question: "Are there any hidden fees?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];

  return (
    <div className="min-h-screen bg-white ">
      {/* Hero Section */}
      <section
        className="pt-20 md:pt-28 pb-8 px-4 sm:px-6 lg:px-8 flex items-center overflow-hidden"
        style={{
          minHeight: "522px",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.5) 9.39%, #F5F6FF 83.91%)",
        }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left Content - 70% */}
            <div className="w-full lg:w-[70%] space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full gap-2">
                <div className="w-2 h-2 bg-[#FF660F] rounded-full"></div>
                <span className="text-[#FF660F] font-normal text-base leading-none tracking-normal">
                  Seats are filling fast. A new batch is starting soon.
                </span>
              </div>

              <h1 className="text-[#232323] font-semibold text-[40px] tracking-normal">
                Take Off to Top Universities{" "}
                <span className="text-[#2563EB]">
                  Faster Than Everyone Else
                </span>
              </h1>

              <p className="text-gray-600 max-w-2xl font-medium text-xl tracking-normal leading-[120%]">
                Crack admissions with a proven structure, expert mentorship, and
                confidence-boosting support.
              </p>

              {/* Stats - Single Line */}
              <div className="flex items-center gap-6 md:gap-8 flex-wrap">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#FF660F]" fill="#FF660F" />
                  <span className="text-base font-semibold text-[#232323]">
                    4.7 Course Rating
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FF660F]" />
                  <span className="text-base font-semibold text-[#232323]">
                    4 Months Course Duration
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#FF660F]" />
                  <span className="text-base font-semibold text-[#232323]">
                    1000+ Students
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-4 pt-4">
                <div className="text-3xl md:text-4xl font-bold text-[#232323]">
                  ₹2,999
                </div>
                <Button
                  onClick={handleEnrollNow}
                  className="bg-[#FF660F] hover:bg-[#e15500] text-white px-8 py-6 text-lg font-semibold rounded-xl"
                >
                  Enroll Now
                </Button>
              </div>
            </div>

            {/* Right Image - 30% */}
            <div className="w-full lg:w-[30%] flex justify-center lg:justify-end">
              <div className="relative w-full">
                <div
                  className="rounded-xl aspect-square"
                  style={{
                    background:
                      "linear-gradient(179.92deg, #E3D2C7 26.93%, #E6DAD3 99.93%)",
                  }}
                >
                  <SmartImage
                    src="src/assets/avatars/promophoto.png"
                    alt="Course Hero"
                    className="w-full h-full rounded-xl object-cover"
                    width={400}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What you'll get Section */}
      <section className="py-16 px-5 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-semibold text-[#232323] mb-4">
              What you'll get
            </h2>
            <p className="text-[18px] font-normal text-gray-600 leading-[120%]">
              Benefits listed as features that deliver real outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="bg-white border border-[#E8EAED] rounded-[24px]"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col">
                      <div className="flex-shrink-0 mb-4">
                        <div className="w-14 h-14 bg-[#ECEEFE] rounded-lg flex items-center justify-center">
                          <IconComponent className="w-7 h-7 text-[#2F43F2]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[20px] font-medium text-[#232323] mb-2 leading-normal">
                          {feature.title}
                        </h3>
                        <p className="text-[18px] font-normal text-[#232323] leading-[120%]">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Program Statistics */}
      <section className="p-5">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#F9FAFB] rounded-lg px-20 py-7 flex items-center justify-center gap-10">
            <div className="flex flex-col items-center">
              <p className="text-[24px] font-bold text-[#2F43F2] mb-2">6-8</p>
              <p className="text-[16px] font-normal text-gray-600 leading-[120%]">
                Hours per week
              </p>
            </div>
            <div className="w-[1px] bg-gray-200 self-stretch"></div>
            <div className="flex flex-col items-center">
              <p className="text-[24px] font-bold text-[#2F43F2] mb-2">16</p>
              <p className="text-[16px] font-normal text-gray-600 leading-[120%]">
                Weeks program
              </p>
            </div>
            <div className="w-[1px] bg-gray-200 self-stretch"></div>
            <div className="flex flex-col items-center">
              <p className="text-[24px] font-bold text-[#2F43F2] mb-2">100%</p>
              <p className="text-[16px] font-normal text-gray-600 leading-[120%]">
                Practical Focused
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        className="py-16 px-5 lg:px-20"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.5) -10.21%, #F5F6FF 53.33%)",
        }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#232323] mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-gray-600 leading-[120%]">
              Unique Strengths That Set Us Apart.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column - Benefits */}
            <div className="w-full lg:w-[40%] space-y-4 rounded-lg p-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCheck className="w-6 h-6 bg-green-100 rounded p-0.5 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-lg text-[#232323] leading-[120%]">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Column - Colleges */}
            <div className="w-full lg:w-[60%]">
              <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-[#232323] mb-4">
                    Dream Colleges Our Students Made It To
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {colleges.map((college, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[#ECEEFE] text-[#2F43F2] rounded-full text-[14px] font-medium border border-[#C0C4F1]"
                      >
                        {college}
                      </span>
                    ))}
                  </div>
                  <div
                    className="p-6 rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(90deg, #F0F1FE 5.27%, #FDF8F5 66.38%)",
                    }}
                  >
                    <p className="text-[#232323] text-[20px] font-medium mb-2 leading-[120%]">
                      "Our students made it to these colleges. You are next."
                    </p>
                    <p className="text-gray-600 text-[18px] leading-[120%]">
                      Build aspiration and credibility simultaneously.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* You Will Be Guided By Section */}
      <section className="py-16 px-5 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#232323] mb-4">
              You Will Be Guided By
            </h2>
            <p className="text-lg text-gray-600 leading-[120%]">
              Learn from industry experts with proven track records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {instructors.map((instructor, index) => (
              <Card
                key={index}
                style={{
                  borderRadius: "24px",
                  background:
                    "linear-gradient(101.59deg, #F0F1FE 0.68%, #FDF8F5 67.02%)",
                }}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-[#374151] rounded-xl flex items-center justify-center">
                        <SmartImage
                          src={instructor.image}
                          alt={instructor.name}
                          className="w-full h-full rounded-lg object-cover"
                          width={80}
                          height={80}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#232323] mb-1">
                        {instructor.name}
                      </h3>
                      <p className="text-[#2F43F2] mb-2 font-normal">
                        {instructor.role}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCheck className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-[#6B7280]">
                          {instructor.experience}
                        </span>
                      </div>
                      <p className="text-[#232323] leading-[120%] font-normal">
                        {instructor.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 px-5 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#232323] mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600 leading-[120%]">
              Real Students. Real Transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border border-gray-200 rounded-2xl relative"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <SmartImage
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-17 h-17 rounded-full object-cover"
                      width={48}
                      height={48}
                    />
                    <div>
                      <h4 className="font-semibold text-[#232323]">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm font-medium text-[#2F43F2] leading-[120%]">
                        {testimonial.role}
                      </p>
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400"
                            fill="#FCD34D"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-[120%]">
                    {testimonial.text}
                  </p>
                  <Quote className="absolute top-6 right-6 w-12 h-12 text-gray-300" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className="py-16 px-5 lg:px-20"
        style={{
          background:
            "linear-gradient(0deg, rgba(255, 255, 255, 0.5) -10.21%, #F5F6FF 53.33%)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#232323] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 leading-[120%]">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="w-full rounded-2xl p-2 transition-all duration-300"
              >
                <button
                  onClick={() => handleFaqToggle(index)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <h3 className="font-semibold text-lg text-[#232323] pr-4">
                    {faq.question}
                  </h3>
                  {openFaqIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-black flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-black flex-shrink-0" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div className="mt-4 transition-transform">
                    <p className="text-gray-600 font-normal text-base leading-[120%]">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-[88px] bg-white border-t border-r border-l border-[#D6D6D6] border-b-0 rounded-t-2xl px-[19px] py-4 z-50 transition-transform duration-300 shadow-[0px_-3px_10px_0px_#00000014] ${
          showBottomBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto h-full flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left Side - Message */}
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full gap-2">
            <div className="w-2 h-2 bg-[#FF660F] rounded-full"></div>
            <span className="text-[#FF660F] font-normal text-base leading-none tracking-normal">
              Seats are filling fast. A new batch is starting soon.
            </span>
          </div>

          {/* Right Side - Price and Button */}
          <div className="flex items-center gap-4">
            <div className="text-2xl sm:text-3xl font-bold text-[#232323]">
              ₹2,999
            </div>
            <Button
              onClick={handleEnrollNow}
              className="bg-[#FF660F] hover:bg-[#e15500] text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-xl whitespace-nowrap"
            >
              Enroll Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
