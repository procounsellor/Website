import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, Users, ChevronUp, ChevronRight } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { useAuthStore } from "@/store/AuthStore";

export default function PromoPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showBottomBar, setShowBottomBar] = useState(false);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const { toggleLogin } = useAuthStore();

  const handleFaqToggle = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleEnrollNow = () => {
    toggleLogin();
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Get hero section height
      const heroHeight = heroSectionRef.current?.offsetHeight || 600;

      // Show bar only if scrolled past hero section
      if (currentScrollY > heroHeight) {
        setShowBottomBar(true);
      } else {
        // Still in hero section, hide the bar
        setShowBottomBar(false);
      }
    };

    // Initial check on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: "/what1.svg",
      title: "Live training sessions that focus on clarity and mastery",
      description:
        "Get a combination of live strategy/doubt sessions and recorded detailed lectures for fast understanding. Learn anytime, anywhere.",
    },
    {
      icon: "/what2.svg",
      title: "Dedicated personal mentor to eliminate weaknesses",
      description:
        "Get a dedicated personal mentor to eliminate weaknesses and provide one-on-one guidance throughout your journey.",
    },
    {
      icon: "/what3.svg",
      title: "Doubt-clearing access to ensure zero confusion",
      description:
        "Doubt-clearing access to ensure zero confusion. Get your questions answered quickly by experts.",
    },
    {
      icon: "/what4.svg",
      title: "Practical assignments and mock tests to build readiness",
      description:
        "Take CET-pattern full-length mock tests designed to match real exam difficulty, timing, and marking scheme.",
    },
    {
      icon: "/what5.svg",
      title: "Structured Chapter-wise PYQs for Students",
      description:
        "Access chapter-wise and topic-wise Previous Year Questions so you understand exactly which concepts repeat every year.",
    },
    {
      icon: "/what6.svg",
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

  const defaultInstructors = [
    {
      name: "Shiv",
      role: "Mathematics Faculty",
      experience: "10+ years experience",
      description:
        "Shiv Sir is a highly experienced Mathematics faculty known for his clear explanations, smart shortcuts, and exam-oriented teaching. He specialises in simplifying tough concepts and helping students improve their solving speed and accuracy for MHT CET.",
      image: "/guide_shiv.png",
    },
    {
      name: "Soham Bingewar",
      role: "Chemistry Faculty",
      experience: "10+ years experience",
      description:
        "Soham Sir is an expert Chemistry faculty known for his NCERT-focused teaching, quick revision techniques, and exam-oriented approach. He simplifies Organic, Inorganic, and Physical Chemistry through smart tricks, memory cues, and high-weightage focus.",
      image: "/guide_soham.png",
    },
    {
      name: "Aaditya Dahale",
      role: "Strategy Planner & Mentor",
      experience: "10+ years experience",
      description:
        "Strategy Planner & Mentor, who has guided and mentored more than 75,000 MHT CET aspirants with clear planning, smart strategies, and result-oriented direction.",
      image: "/guide_aaditya.jpg",
    },
    {
      name: "Prathmesh Hatwar",
      role: "Physics Faculty",
      experience: "10+ years experience",
      description:
        "Prathmesh Sir makes Physics feel simple, logical, and fully exam-oriented. He focuses on conceptual understanding, derivation shortcuts, and high-weightage chapter coverage. His one-shot lectures and problem-solving sessions help students master theory + numericals in minimum time.",
      image: "/guide_prathmesh.jpg",
    },
  ];

  // Always use default instructors (do not fetch from API for this page)
  const instructors = defaultInstructors;

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
      question: "What is included in this Crash Course?",
      answer:
        "You will get one-shot revision lectures, short notes, formula sheets, high-weightage topics, chapter-wise PYQs, mock tests, practice questions, doubt support, and complete strategy sessions for both Attempt 1 and Attempt 2.",
    },
    {
      question: "Is this course enough to score high in MHT CET?",
      answer:
        "Yes. The course is designed to cover the entire PCM syllabus with CET-focused teaching, high-weightage topics, and fast revision. If you follow the plan and practice regularly, you can significantly improve your percentile.",
    },
    {
      question: "Will I get notes and PYQs?",
      answer:
        "Yes. You will get: • Chapter-wise short notes • Formula sheets • Topic-wise PYQs • High-weightage question sets — All in downloadable PDF format.",
    },
    {
      question: "Will classes be live or recorded?",
      answer:
        "The course includes LIVE + Recorded Lectures + live strategy and doubt sessions as required during exam weeks.",
    },
    {
      question: "What is the refund policy?",
      answer:
        "Since this is a digital course with instant access to all materials, we do not offer refunds after enrollment.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-poppins">
      {/* Hero Section */}
      <section
        ref={heroSectionRef}
        className="pt-18 sm:pt-22 md:pt-30 pb-10 px-4 sm:px-6 lg:px-8 flex items-center overflow-hidden"
        style={{
          minHeight: "auto",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.5) 9.39%, #F5F6FF 83.91%)",
        }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12">
            {/* Left Content - 70% */}
            <div className="w-full lg:w-[60%] xl:w-[70%] space-y-4 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-[#FEECE199] rounded-full gap-2">
                <div className="w-2 h-2 bg-[#FA660F] rounded-full"></div>
                <span
                  className="text-[#FA660F] font-normal text-xs sm:text-base leading-none tracking-normal"
                  style={{ color: "#FA660F", fontWeight: 400 }}
                >
                  Seats are filling fast. A new batch is starting soon.
                </span>
              </div>

              <h1 className="text-[#232323] font-semibold text-2xl sm:text-3xl md:text-[36px] tracking-normal">
                Take Off to Top Universities{" "}
                <span className="text-[#2F43F2]">
                  Faster Than Everyone Else
                </span>
              </h1>

              <p
                className="max-w-2xl text-sm sm:text-lg md:text-xl tracking-normal text-left"
                style={{ color: "#6B7280", fontWeight: 500 }}
              >
                Crack admissions with a proven structure, expert mentorship, and
                confidence-boosting support.
              </p>

              {/* Stats - Two Rows Layout */}
              <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-6 md:gap-8 flex-wrap">
                <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1 lg:gap-2">
                  <div className="flex items-center gap-2">
                    <Star
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      style={{ color: "#FA7415" }}
                      fill="#FA7415"
                    />
                    <span
                      className="text-sm sm:text-lg md:text-xl"
                      style={{ fontWeight: 600, color: "#232323" }}
                    >
                      4.7
                    </span>
                  </div>
                  <span
                    className="text-xs sm:text-base lg:mt-0 mt-1"
                    style={{ fontWeight: 400, color: "#6B7280" }}
                  >
                    Course Rating
                  </span>
                </div>
                <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1 lg:gap-2">
                  <div className="flex items-center gap-2">
                    <Clock
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      style={{ color: "#2137F2" }}
                    />
                    <span
                      className="text-sm sm:text-lg md:text-xl"
                      style={{ fontWeight: 600, color: "#232323" }}
                    >
                      4 Months
                    </span>
                  </div>
                  <span
                    className="text-xs sm:text-base lg:mt-0 mt-1"
                    style={{ fontWeight: 400, color: "#6B7280" }}
                  >
                    Course Duration
                  </span>
                </div>
                <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1 lg:gap-2">
                  <div className="flex items-center gap-2">
                    <Users
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      style={{ color: "#22C55D" }}
                    />
                    <span
                      className="text-sm sm:text-lg md:text-xl"
                      style={{ fontWeight: 600, color: "#232323" }}
                    >
                      1000+
                    </span>
                  </div>
                  <span
                    className="text-xs sm:text-base lg:mt-0 mt-1"
                    style={{ fontWeight: 400, color: "#6B7280" }}
                  >
                    Students
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                <div className="text-lg sm:text-xl md:text-2xl font-semibold text-[#232323]">
                  ₹2,999
                </div>
                <Button
                  onClick={handleEnrollNow}
                  className="bg-[#FF660F] hover:bg-[#e15500] text-white px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-lg font-medium rounded-xl"
                >
                  Enroll Now
                </Button>
              </div>
            </div>

            {/* Right Image - 30% */}
            <div className="w-full lg:w-[30%] flex justify-center lg:justify-end">
              <div className="relative flex justify-center lg:max-w-none">
                <div
                  className="rounded-xl relative mx-auto w-[335px] h-[286px] lg:w-[442px] lg:h-[442px]"
                  style={{
                    background:
                      "linear-gradient(179.92deg, #E3D2C7 26.93%, #E6DAD3 99.93%)",
                  }}
                >
                  <SmartImage
                    src="/promophoto.png"
                    alt="Course Hero"
                    className="rounded-xl object-cover w-full h-full"
                    width={442}
                    height={442}
                  />
                  {/* Card Overlay */}
                  <div
                    className="absolute bottom-[-5%] left-[-1%] lg:left-[-10%] bg-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 shadow-lg"
                    style={{
                      borderRadius: "16px",
                    }}
                  >
                    <p
                      className="font-medium text-base mb-1"
                      style={{ color: "#232323" }}
                    >
                      Lead Instructor
                    </p>
                    <p
                      className="text-xs font-normal"
                      style={{ color: "#6B7280" }}
                    >
                      10+ years experience
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What you'll get Section */}
      <section className="pt-12 sm:pt-16 pb-10 px-4 sm:px-5 lg:px-20">
        <div className="mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2
              className="mb-3 sm:mb-4 text-[18px] sm:text-3xl md:text-[32px]"
              style={{ fontWeight: 600, color: "#0E1629" }}
            >
              What you'll get
            </h2>
            <p
              className="leading-[120%] text-[12px] sm:text-lg"
              style={{ fontWeight: 400, color: "#6B7280" }}
            >
              Benefits listed as features that deliver real outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {features.map((feature, index) => {
              return (
                <Card
                  key={index}
                  className="group transition-all duration-300 w-full shadow-none py-0"
                  style={{
                    borderRadius: "24px",
                    border: "1px solid #E8EAED",
                    backgroundColor: "#FFFFFF",
                    borderWidth: "1px",
                    minHeight: "190px",
                    boxShadow: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2F43F2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#E8EAED";
                  }}
                >
                  <CardContent className="px-3 sm:px-6 h-full py-3 sm:py-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-shrink-0 mb-4">
                        <div className="rounded-lg flex items-center justify-center transition-all duration-300 bg-[#ECEEFE] group-hover:bg-[#2F43F2] w-7 h-7 sm:w-[56px] sm:h-[56px]">
                          <img
                            src={feature.icon}
                            alt=""
                            className="icon-hover-white transition-all duration-300 w-4 h-4 sm:w-8 sm:h-8"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3
                          className="mb-1"
                          style={{
                            fontWeight: 500,
                            fontSize: "16px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#0E1629",
                          }}
                        >
                          <span className="sm:text-lg md:text-[20px]">
                            {feature.title}
                          </span>
                        </h3>
                        <p
                          className="text-[#6B7280] leading-[120%]"
                          style={{ fontSize: "14px" }}
                        >
                          <span className="sm:text-base md:text-[18px]">
                            {feature.description}
                          </span>
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
      <section className="pt-0 pb-4 sm:pb-5 px-4 sm:px-5 lg:px-20">
        <div className="max-w-full mx-auto">
          <div className="bg-[#F9FAFB] rounded-lg px-4 sm:px-8 md:px-20 py-5 sm:py-7 flex flex-row items-center justify-center gap-4 sm:gap-6 md:gap-10">
            <div className="flex flex-col items-center">
              <p
                className="font-semibold text-[#2F43F2] mb-1 sm:mb-2"
                style={{ fontSize: "18px" }}
              >
                <span className="sm:text-2xl md:text-[24px]">6-8</span>
              </p>
              <p
                className="font-normal text-[#6B7280] leading-[120%] text-center"
                style={{ fontSize: "11px" }}
              >
                <span className="sm:text-base text-[11px] ">
                  Hours per week
                </span>
              </p>
            </div>
            <div className="w-[1px] h-auto bg-gray-200 self-stretch"></div>
            <div className="flex flex-col items-center">
              <p
                className="font-semibold text-[#2F43F2] mb-1 sm:mb-2"
                style={{ fontSize: "18px" }}
              >
                <span className="sm:text-2xl md:text-[24px]">16</span>
              </p>
              <p
                className="font-normal text-[#6B7280] leading-[120%] text-center"
                style={{ fontSize: "11px" }}
              >
                <span className="sm:text-base text-[11px]">Weeks program</span>
              </p>
            </div>
            <div className="w-[1px] h-auto bg-gray-200 self-stretch"></div>
            <div className="flex flex-col items-center">
              <p
                className="font-semibold text-[#2F43F2] mb-1 sm:mb-2"
                style={{ fontSize: "18px" }}
              >
                <span className="sm:text-2xl md:text-[24px]">100%</span>
              </p>
              <p
                className="font-normal text-[#6B7280] leading-[120%] text-center"
                style={{ fontSize: "11px" }}
              >
                <span className="sm:text-base text-[11px]">
                  Practical Focused{" "}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        className="py-12 sm:py-16 px-4 sm:px-5 lg:px-20"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.5) -10.21%, #F5F6FF 53.33%)",
        }}
      >
        <div className="mx-auto w-full">
          <div className="text-center mb-8 sm:mb-12">
            <h2
              className="mb-3 sm:mb-4 text-[18px] sm:text-3xl md:text-[32px]"
              style={{ fontWeight: 600, color: "#0E1629" }}
            >
              Why Choose Us
            </h2>
            <p
              className="leading-[120%] text-[12px] sm:text-lg"
              style={{ fontWeight: 400, color: "#6B7280" }}
            >
              Unique Strengths That Set Us Apart.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:items-center">
            {/* Left Column - Benefits */}
            <div className="w-full lg:w-[40%] space-y-4 sm:space-y-5 rounded-lg p-4 sm:p-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-3">
                  <div
                    className="flex-shrink-0 self-start rounded w-6 h-6 sm:w-8 sm:h-8 p-[3px] sm:p-1"
                    style={{
                      backgroundColor: "#E9FBF0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src="/checkcheck.svg"
                      alt="check"
                      className="w-[18px] h-[18px] sm:w-6 sm:h-6"
                    />
                  </div>
                  <p
                    className="leading-[120%]"
                    style={{
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#0E1629",
                    }}
                  >
                    <span className="sm:text-lg">{benefit}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Right Column - Colleges */}
            <div className="w-full lg:w-[60%]">
              <Card
                className="bg-white border border-gray-200 rounded-2xl py-0"
                style={{
                  boxShadow: "0px 0px 4px 0px #18003326",
                }}
              >
                <CardContent style={{ padding: "20px" }}>
                  <h3 className="text-sm sm:text-lg font-semibold text-[#232323] mb-3 sm:mb-4">
                    Dream Colleges Our Students Made It To
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3.5 mb-4 sm:mb-6">
                    {colleges.map((college, index) => (
                      <span
                        key={index}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#ECEEFE] text-[#2F43F2] rounded-full text-xs sm:text-sm md:text-[14px] font-medium border border-[#C0C4F1]"
                      >
                        {college}
                      </span>
                    ))}
                  </div>
                  <div
                    className="p-4 sm:p-6 rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(90deg, #F0F1FE 5.27%, #FDF8F5 66.38%)",
                    }}
                  >
                    <p className="text-[#232323] font-medium mb-2 leading-[120%] text-xs sm:text-lg md:text-[20px]">
                      "Our students made it to these colleges. You are next."
                    </p>
                    <p
                      className="leading-[120%] text-xs sm:text-base md:text-[18px]"
                      style={{ color: "#6B7280" }}
                    >
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
      <section className="py-12 sm:py-16 px-4 sm:px-5 lg:px-20">
        <div className="mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2
              className="mb-3 sm:mb-4 text-[18px] sm:text-3xl md:text-[32px]"
              style={{ fontWeight: 600, color: "#0E1629" }}
            >
              You Will Be Guided By
            </h2>
            <p
              className="leading-[120%] text-[12px] sm:text-lg"
              style={{ fontWeight: 400, color: "#6B7280" }}
            >
              Learn from industry experts with proven track records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {instructors.map((instructor, index) => (
              <Card
                key={index}
                className="py-0"
                style={{
                  borderRadius: "24px",
                  background:
                    "linear-gradient(101.59deg, #F0F1FE 0.68%, #FDF8F5 67.02%)",
                  boxShadow: "none",
                  border: "none",
                }}
              >
                <CardContent style={{ padding: "20px" }}>
                  <div className="flex flex-col gap-3">
                    {/* Row 1: Image + Details */}
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="rounded-xl overflow-hidden w-20 h-20 sm:w-24 sm:h-24 md:w-[114px] md:h-[114px]">
                          <SmartImage
                            src={instructor.image}
                            alt={instructor.name}
                            className="rounded-xl w-full h-full"
                            style={{
                              objectFit: "cover",
                              display: "block",
                            }}
                            width={114}
                            height={114}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3
                          className="mb-1"
                          style={{
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "#232323",
                          }}
                        >
                          <span className="sm:text-lg md:text-[20px]">
                            {instructor.name}
                          </span>
                        </h3>
                        <p
                          className="mb-2"
                          style={{
                            fontWeight: 500,
                            fontSize: "12px",
                            color: "#2F43F2",
                          }}
                        >
                          <span className="sm:text-base md:text-[18px]">
                            {instructor.role}
                          </span>
                        </p>
                        <div className="flex items-center gap-2">
                          <img
                            src="/checkcheck.svg"
                            alt="check"
                            className="w-5 h-5 sm:w-6 sm:h-6"
                          />
                          <span
                            style={{
                              fontWeight: 400,
                              fontSize: "12px",
                              color: "#6B7280",
                            }}
                          >
                            <span className="sm:text-sm md:text-[16px]">
                              {instructor.experience}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Row 2: Description */}
                    <div>
                      <p
                        className="leading-[120%] font-normal"
                        style={{ fontSize: "14px", color: "#6B7280" }}
                      >
                        <span className="sm:text-base">
                          {instructor.description}
                        </span>
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
      <section className="py-12 sm:py-16 px-4 sm:px-5 lg:px-20 bg-white">
        <div className="mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2
              className="mb-3 sm:mb-4 text-[18px] sm:text-3xl md:text-[32px]"
              style={{ fontWeight: 600, color: "#0E1629" }}
            >
              Success Stories
            </h2>
            <p
              className="leading-[120%] text-[12px] sm:text-lg"
              style={{ fontWeight: 400, color: "#6B7280" }}
            >
              Real Students. Real Transformation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="rounded-2xl relative py-0 lg:min-w-[400px] lg:flex-1"
                style={{
                  border: "1px solid #E8EAED",
                  boxShadow: "0px 0px 4px 0px #BDC2FD26",
                }}
              >
                <CardContent style={{ padding: "20px" }}>
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
                        <span className="sm:text-xl">{testimonial.name}</span>
                      </h4>
                      <p
                        className="font-medium text-[#2F43F2] leading-[120%]"
                        style={{ fontSize: "14px" }}
                      >
                        <span className="sm:text-sm">{testimonial.role}</span>
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

                  <p className="text-[#6B7280] leading-[120%] text-sm sm:text-lg">
                    {testimonial.text}
                  </p>
                  <img
                    src="/quotes.svg"
                    alt="quotes"
                    className="text-[#ECEEFE] absolute top-6 right-6 w-12 h-12 sm:w-[61px] sm:h-[61px]"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className="py-12 sm:py-16 px-4 sm:px-5 lg:px-20"
        style={{
          background:
            "linear-gradient(0deg, rgba(255, 255, 255, 0.5) -10.21%, #F5F6FF 53.33%)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2
              className="mb-3 sm:mb-4 text-[18px] sm:text-3xl md:text-[32px]"
              style={{ fontWeight: 600, color: "#0E1629" }}
            >
              Frequently Asked Questions
            </h2>
            <p
              className="leading-[120%] text-[12px] sm:text-lg"
              style={{ fontWeight: 400, color: "#6B7280" }}
            >
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="w-full rounded-2xl p-2 transition-all duration-300"
                style={{ borderBottom: "1px solid #EFEFEF" }}
              >
                <button
                  onClick={() => handleFaqToggle(index)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <h3 className="font-medium text-sm sm:text-xl text-[#232323] pr-4">
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
                    <p
                      className="leading-[120%] text-xs sm:text-base"
                      style={{ color: "#6C6969", fontWeight: 400 }}
                    >
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
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-r border-l border-[#D6D6D6] border-b-0 rounded-t-2xl px-3 sm:px-4 md:px-[19px] py-3 sm:py-4 z-50 transition-transform duration-300 shadow-[0px_-3px_10px_0px_#00000014] ${
          showBottomBar ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ minHeight: "auto", height: "auto" }}
      >
        <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-2 sm:gap-4">
          {/* Left Side - Message */}
          <div className="flex items-center px-2 sm:px-4 py-1.5 sm:py-2 bg-[#FEECE199] rounded-full gap-1.5 sm:gap-2 min-w-0 w-fit">
            <div className="w-2 h-2 bg-[#FA660F] rounded-full flex-shrink-0"></div>
            <span
              className="font-normal text-[10px] sm:text-sm md:text-base leading-tight tracking-normal"
              style={{ color: "#FA660F", fontWeight: 400 }}
            >
              Seats are filling fast. A new batch is starting soon.
            </span>
          </div>

          {/* Middle - Price */}
          <div className="flex items-center gap-2">
            <div className="text-base sm:text-2xl md:text-3xl font-semibold text-[#232323] flex-shrink-0 px-2">
              ₹2,999
            </div>

            {/* Right Side - Button */}
            <Button
              onClick={handleEnrollNow}
              className="bg-[#FF660F] hover:bg-[#e15500] text-white px-3 sm:px-6 md:px-8 py-2 sm:py-5 md:py-6 text-xs sm:text-base md:text-lg font-medium rounded-xl whitespace-nowrap flex-shrink-0"
            >
              Enroll Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
