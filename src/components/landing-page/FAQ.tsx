import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "1. What is included in this Crash Course?",
      a:
        "You will get one-shot revision lectures, short notes, formula sheets, high-weightage topics, chapter-wise PYQs, mock tests, practice questions, doubt support, and complete strategy sessions for both Attempt 1 and Attempt 2."
    },
    {
      q: "2. Is this course enough to score high in MHT CET?",
      a:
        "Yes. The course is designed to cover the entire PCM syllabus with CET-focused teaching, high-weightage topics, and fast revision. If you follow the plan and practice regularly, you can significantly improve your percentile."
    },
    {
      q: "3. Will I get notes and PYQs?",
      a:
        "Yes. You will get: • Chapter-wise short notes • Formula sheets • Topic-wise PYQs • High-weightage question sets — All in downloadable PDF format."
    },
    {
      q: "4. Will classes be live or recorded?",
      a:
        "The course includes LIVE + Recorded Lectures + live strategy and doubt sessions as required during exam weeks."
    },
    {
      q: "5. How long will I have access to the course?",
      a:
        "You will get complete access till the end of MHT CET Attempt 2 (May 2026)."
    },
    {
      q: "6. Do you provide a timetable or study plan?",
      a:
        "Yes, a daily and weekly study plan is provided to help you revise all important chapters in the right sequence."
    },
    {
      q: "7. How many mock tests will be provided?",
      a:
        "You’ll get full-length mock tests + chapter-wise tests designed exactly like the CET pattern to improve speed and accuracy."
    },
    {
      q: "8. How will doubts be solved?",
      a:
        "You’ll get a dedicated WhatsApp/Telegram doubt support group where faculty or mentors will answer your doubts regularly."
    },
    {
      q: "9. Which faculty will teach in this crash course?",
      a:
        "A team of experienced CET educators who specialize in Physics, Chemistry, and Mathematics. They are known for simple explanations, one-shot revisions, and high-scoring strategies."
    },
    {
      q: "10. Is this crash course suitable for beginners?",
      a:
        "Yes. Even if you haven’t studied well earlier, the course will guide you through the entire syllabus in a structured and easy-to-understand manner."
    },
    {
      q: "11. Will there be coverage for both Attempt 1 and Attempt 2?",
      a:
        "Yes, the course includes detailed revision plans, strategy, and practice tests for both attempts."
    },
    {
      q: "12. Is this course valid for Maharashtra HSC board students?",
      a:
        "Yes. The course follows the MHT CET syllabus based on the Maharashtra Board pattern and is fully suitable for HSC students."
    },
    {
      q: "13. What if I join late? Will I miss anything?",
      a:
        "No. All videos, notes, and PYQs are available from Day 1. You can follow the suggested plan and catch up easily."
    },
    {
      q: "14. Can I access the course on phone and laptop?",
      a:
        "Yes. All lectures, notes, tests, and PDFs are accessible on mobile, tablet, and laptop."
    },
    {
      q: "15. What is the refund policy?",
      a:
        "Since this is a digital course with instant access to all materials, we do not offer refunds after enrollment."
    }
  ];

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section className="flex flex-col items-center justify-center w-full bg-[#F5F5F7] py-6">
      <h1 className="font-semibold text-[#13097D] text-[1rem] lg:text-[2.5rem] mb-6">
        Frequently Asked Questions
      </h1>

      <div className="w-full max-w-[1200px] px-4 md:px-0">
        {faqs.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="py-4">
              {/* entire row is a button (clickable) */}
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 text-left focus:outline-none"
              >
                <h2
                  className={`flex-1 text-[#262626] ${
                    // mobile: 18px, desktop (md): 24px
                    "text-[0.875rem] md:text-[24px] font-semibold"
                  }`}
                >
                  {item.q}
                </h2>

                {/* single icon that rotates to indicate open/closed */}
                <span
                  className={`ml-4 transform transition-transform duration-200 ${
                    isOpen ? "rotate-0" : "-rotate-90"
                  }`}
                  aria-hidden
                >
                  <ChevronDown className="w-5 h-5" />
                </span>
              </button>

              {/* answer: animated with max-height + opacity for smooth effect */}
              <div
                className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                  isOpen ? "max-h-[1200px] opacity-100 mt-3" : "max-h-0 opacity-0"
                }`}
                aria-hidden={!isOpen}
              >
                <p
                  className="leading-relaxed"
                  style={{ color: "#6C6969" }}
                >
                  <span className="md:text-[20px] text-xs font-medium">
                    {item.a}
                  </span>
                </p>
              </div>

              <hr className="border-t border-[#E5E5E5] mt-4" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
