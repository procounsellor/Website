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
import ExamDates from "@/components/Revamp/home/ExamDates";
import { examEventSchemas, freeToolsSchema, homeFaqSchema } from "@/components/Revamp/home/homeJsonLd";
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
        "name": "Admission deadlines",
        "description": "Application deadlines and important dates for colleges and entrance exams",
        "url": "https://procounsel.co.in/admissions/deadlines"
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

  // FAQ, exam Event and free-tools ItemList schemas are built from the same
  // data the page renders (homeJsonLd.ts), so they always match what is visible.
  const faqSchema = homeFaqSchema();
  const examEvents = examEventSchemas();
  const toolsSchema = freeToolsSchema();

  return (
    <>
      <PageSEO
        title="College Admission Counselling & Career Guidance for Students in India | ProCounsel"
        description="ProCounsel connects students with verified admission counsellors and college seniors for end-to-end support — from discovering colleges and choice filling to personalised admission and study abroad guidance."
        canonical="/"
        keywords="college admission counselling, admission counselling india, cat college predictor, mba admission counselling, career counselling services, neet counselling, jee counselling, admission form filling help, choice filling counselling, college admission guidance, education consultant in india, university admission support, career guidance for students, talk to college seniors, colleges in india, study abroad consultant india"
        jsonLd={[siteNavigationSchema, websiteSchema, organizationSchema, faqSchema, toolsSchema, ...examEvents]}
      />
    <div className="min-h-screen">
      <ExamSeasonStrip exam={exam} />

      {/* The hero holds the page's one visible H1, the search, upcoming exams and
          "explore by stream". It replaces the old desktop-only tile hero (and its
          logo intro animation); the counsellor cards now sit further down, so their
          first image no longer needs high fetch priority (priorityImage={false}). */}
      <HomeHero />
      
      <ExamTools exam={exam} onExamChange={changeExam} />
      {/* Below the first screen: .cv-auto (content-visibility: auto) lets the
          browser skip layout and paint for these until they come near the
          viewport. Everything stays in the HTML for search engines, anchors and
          find-in-page; on a mid-range phone this was seconds of layout work. */}
      <div className="cv-auto"><HomeColleges /></div>
      <Suspense fallback={<div className="min-h-[560px]" />}>
        <div className="cv-auto"><DailyBoost exam={exam} /></div>
      </Suspense>
      <div className="cv-auto"><CounsellorSection priorityImage={false} /></div>
      <Suspense fallback={<div className="min-h-[400px]" />}>
        <div className="cv-auto"><ConnectRow /></div>
        <div className="cv-auto"><RevampBannerSection /></div>
        <div className="cv-auto"><ExamDates /></div>
        <div className="cv-auto"><Deadlines /></div>
        <div className="cv-auto"><Stories stories={admissionsStories} /></div>
        <div className="cv-auto"><Blogs /></div>
        <div className="cv-auto"><SeoArticle {...homeContent} /></div>
        <div className="cv-auto"><Faq /></div>
      </Suspense>
    </div>
    </>
  );
}
