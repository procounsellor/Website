import { useState, useEffect, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CounsellorSection from "@/components/Revamp/admissions/counsellor/CounsellorSection";
import PageSEO from "@/components/SEO/PageSEO";
import SeoArticle from "@/components/SEO/SeoArticle";
import { homeContent } from "@/components/SEO/homeSeoContent";
import ExamSeasonStrip from "@/components/Revamp/home/ExamSeasonStrip";
import ExamTools from "@/components/Revamp/home/ExamTools";
import HomeHero from "@/components/Revamp/home/HomeHero";
import HomeColleges from "@/components/Revamp/home/HomeColleges";
import { loadSavedExam, saveExam, type ExamKey } from "@/data/homeExams";

// Below-the-fold sections: lazy-loaded so they don't bloat the initial JS that
// must hydrate before the above-the-fold counsellor section (the LCP) renders.
// react-snap still prerenders their HTML for SEO (chunks resolve during snapshot).
const DailyBoost = lazy(() => import("@/components/Revamp/home/DailyBoost"));
const ConnectRow = lazy(() => import("@/components/Revamp/home/ConnectRow"));
const RevampBannerSection = lazy(() => import("@/components/Revamp/banners/RevampBannerSection"));
const Deadlines = lazy(() => import("@/components/Revamp/admissions/Deadlines"));
const Stories = lazy(() => import("@/components/Revamp/probuddies/Stories"));
const Blogs = lazy(() => import("@/components/Revamp/admissions/Blogs"));
const Faq = lazy(() => import("@/components/Revamp/admissions/Faq"));

export default function Admissions() {
  const navigate = useNavigate();
  const location = useLocation();
  // Each card needs its own headline. All three used to share the hard-coded
  // line "It was a very good experience", which published the same sentence six
  // times on the home page — half of the duplicate content the AdSense review
  // flagged. Headlines summarise that student's own quote; nothing new is
  // claimed on their behalf.
  const admissionsStories = [
    {
      name: "Ashutosh",
      role: "Student",
      rating: 4,
      headline: "Weekly targets kept my prep on track",
      text: "The course planning was clear and easy to follow. Weekly targets and mock tests kept me focused and helped me prepare with confidence.",
      image: "/review1.webp",
    },
    {
      name: "Ananya",
      role: "Student",
      rating: 5,
      headline: "Doubt sessions made every topic click",
      text: "Topic-wise lessons and regular doubt sessions made preparation smooth. The structure helped me stay disciplined and improve consistently.",
      image: "/review2.webp",
    },
    {
      name: "Shubham",
      role: "Student",
      rating: 4.5,
      headline: "Better speed and accuracy in Maths",
      text: "Math and Chemistry sessions were practical and exam-focused. Shortcuts plus regular practice improved my speed, accuracy, and confidence.",
      image: "/review3.webp",
    },
  ];

  // The exam the student cares about. MBA first by default (CAT season); a
  // ?exam= link (header MBA/NEET/JEE) wins, then the last choice on this device.
  // Read after mount so the prerendered HTML is always the MBA view.
  const [exam, setExam] = useState<ExamKey>("mba");
  useEffect(() => {
    const fromUrl = new URLSearchParams(location.search).get("exam");
    if (fromUrl === "mba" || fromUrl === "neet" || fromUrl === "jee") {
      setExam(fromUrl);
      saveExam(fromUrl);
    } else {
      const saved = loadSavedExam();
      if (saved) setExam(saved);
    }
  }, [location.search]);
  const changeExam = (next: ExamKey) => {
    setExam(next);
    saveExam(next);
    // Keep the URL in step so the header's MBA/NEET/JEE highlight matches and a
    // reload shows the same exam. No hash, so the page doesn't jump.
    navigate({ search: `?exam=${next}` }, { replace: true, preventScrollReset: true });
  };

  // In-page links (#exam-tools, #daily-boost): react-router doesn't scroll to a
  // hash, and the target may be lazy, so retry briefly until it exists.
  // location.key is a dependency so tapping the same link again (same URL)
  // still scrolls back to the section.
  useEffect(() => {
    const id = location.hash.replace("#", "");
    if (!id) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let tries = 0;
    const timer = window.setInterval(() => {
      const el = document.getElementById(id);
      if (el || ++tries > 20) {
        window.clearInterval(timer);
        el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [location.key, location.hash, location.search]);


  // SiteNavigationElement tells Google which pages should appear as sitelinks
  const siteNavigationSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "ProCounsel Main Navigation",
    "description": "Explore ProCounsel's key sections for career counselling, admissions, and student guidance",
    "itemListElement": [
      {
        "@type": "SiteNavigationElement",
        "position": 1,
        "name": "Admissions",
        "description": "College admission guidance, blogs, deadlines, and expert counsellors",
        "url": "https://procounsel.co.in/admissions"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 2,
        "name": "Colleges",
        "description": "Browse verified college profiles and compare institutes for your admission goals",
        "url": "https://procounsel.co.in/colleges"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 3,
        "name": "ProBuddies",
        "description": "Connect with college seniors for peer mentorship and campus insights",
        "url": "https://procounsel.co.in/pro-buddies"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 4,
        "name": "Study Abroad",
        "description": "Get support with international university selection, applications, and visas",
        "url": "https://procounsel.co.in/study-abroad"
      }
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://procounsel.co.in/#website",
    "name": "ProCounsel",
    "url": "https://procounsel.co.in",
    "description": "India's leading platform for career counselling services, university admission support, study abroad consultant, and career guidance for students.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://procounsel.co.in/admissions/blogs?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ProCounsel",
    "url": "https://procounsel.co.in",
    "logo": "https://procounsel.co.in/favicon.png",
    "sameAs": [
      "https://www.linkedin.com/company/procounsel-by-catalystai/",
      "https://www.facebook.com/share/17GiZ34K46/",
      "https://www.instagram.com/procounsel.co.in",
      "https://x.com/procounsel2025"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "telephone": "+91-7004789484",
      "email": "support@procounsel.co.in",
      "url": "https://procounsel.co.in/contact"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What does an education consultant in India do?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An education consultant in India is like your personal navigator for school and job choices, zeroing in on what you love, what you're good at, and where you wanna end up. Over at ProCounsel, we hook you up with career counselling services, solid career guidance for students, and hands-on university admission support whether you're staying in India or heading overseas."
        }
      },
      {
        "@type": "Question",
        "name": "How do career counselling services help students?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Career counselling services are a lifesaver—they help kids figure out their real strengths, what fires them up, and careers that actually match. You do some structured assessments, chat with a certified career coach, and boom: no more head-scratching, just clear steps to nail your education and career picks with total confidence."
        }
      },
      {
        "@type": "Question",
        "name": "What are the benefits of career counselling?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The benefits of career counselling? You get crystal-clear thinking, a confidence boost, and a solid plan for the long game. Lean on experienced career coaching services, and you'll dodge those career mistakes that cost you big, save tons of time and cash, plus snag personalized career guidance for students that's spot-on for your dreams."
        }
      },
      {
        "@type": "Question",
        "name": "Is career counselling worth it in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oh yeah, career counselling is worth it in India hands down—think cutthroat competition and a million paths to pick from. With top career coaches and dependable career counselling services in your corner, you and other pros make choices that stick and charge into your future feeling unstoppable."
        }
      },
      {
        "@type": "Question",
        "name": "What is the scope of career counselling?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The scope of career counselling is exploding everywhere in India these days. Career coaching services tackle subject selection, skill assessment, plotting higher education, smooth career transitions, and even career counselling online, so top guidance hits students no matter where they are."
        }
      },
      {
        "@type": "Question",
        "name": "How does career counselling online work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Career counselling online? It's all about jumping on virtual calls for pro advice without leaving home. ProCounsel's setup includes quick assessments, real-talk one-on-ones, and custom tips from a certified career coach—quality stuff you can grab from any corner of India."
        }
      },
      {
        "@type": "Question",
        "name": "Who should take career guidance for students?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Anyone grabbing career guidance for students will love it post-10th, after 12th, once you're done with grad school, or if you're a pro in the workforce. Feeling stuck on your next move, college plans, or skills? Dive into professional career counselling services and sort it out."
        }
      },
      {
        "@type": "Question",
        "name": "How do study abroad consultants in India support students?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Study abroad consultants in India got your back on choosing countries, scouting unis, apps, and visas. As one of the best study abroad consultants in India, ProCounsel makes the whole international education journey a breeze with full support from start to finish."
        }
      },
      {
        "@type": "Question",
        "name": "What makes ProCounsel a trusted career consultant?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "What sets ProCounsel apart as a trusted career consultant? It's our custom-fit advice, straight-up ethical counselling, and pro-level planning. Certified career coaches and battle-tested education consultants in India dish out real-world pointers, solid assessments, and total backup for your school and job decisions."
        }
      },
      {
        "@type": "Question",
        "name": "How do I choose the best career coaching services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To snag the best career coaching services, hunt for certified pros, open-and-honest processes, and advice tailored just for you. The top career coaches who really get student goals and what's hot in industries? They're the ones who deliver career support that actually moves the needle."
        }
      },
      {
        "@type": "Question",
        "name": "Are career coaching services useful for working professionals?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For sure, career coaching services rock for working professionals chasing growth, a career switch, or fresh skills. Top career coaches link up your know-how with killer future gigs."
        }
      }
    ]
  };

  return (
    <>
      <PageSEO
        title="College Admission Counselling & Career Guidance for Students in India | ProCounsel"
        description="ProCounsel connects students with verified admission counsellors and college seniors for end-to-end support — from discovering colleges and choice filling to personalised admission and study abroad guidance."
        canonical="/"
        keywords="college admission counselling, admission counselling india, cat college predictor, mba admission counselling, career counselling services, neet counselling, jee counselling, admission form filling help, choice filling counselling, college admission guidance, education consultant in india, university admission support, career guidance for students, talk to college seniors, colleges in india, study abroad consultant india"
        jsonLd={[siteNavigationSchema, websiteSchema, organizationSchema, faqSchema]}
      />
    <div className="min-h-screen">
      <ExamSeasonStrip exam={exam} />

      {/* The hero holds the page's one visible H1, the search, upcoming exams and
          "explore by stream". It replaces the old desktop-only tile hero (and its
          logo intro animation); the counsellor cards now sit further down, so their
          first image no longer needs high fetch priority (priorityImage={false}). */}
      <HomeHero />
      
      <ExamTools exam={exam} onExamChange={changeExam} />
      <HomeColleges />
      <Suspense fallback={<div className="min-h-[560px]" />}>
        <DailyBoost exam={exam} />
      </Suspense>
      <CounsellorSection priorityImage={false} />
      <Suspense fallback={<div className="min-h-[400px]" />}>
        <ConnectRow />
        <RevampBannerSection />
        <Deadlines />
        <Stories stories={admissionsStories} />
        <Blogs />
        <SeoArticle {...homeContent} />
        <Faq />
      </Suspense>
    </div>
    </>
  );
}
