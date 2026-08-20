import type { SeoSection, SeoFaqItem } from "@/components/SEO/SeoArticle";

/**
 * Data + copy for the category counselling landing pages
 * (`/engineering-counselling`, `/mba-counselling`, ...).
 *
 * These are the site's commercial-intent pages: someone searching "MBA
 * counselling" wants to talk to a counsellor, not read a blog. Each page
 * therefore serves ONE primary search intent and covers its related keywords
 * inside that single page — deliberately not one thin page per keyword, which
 * is what got the site flagged for thin content in the first place.
 *
 * URL choice: top-level `/mba-counselling`, not `/counselling/mba`.
 * `/counselling/:city` already owns that namespace, exact-match keyword URLs
 * are what the category leaders (Shiksha, CollegeDunia) use, and it leaves
 * `/mba-counselling/pune` free for the city expansion once demand is validated.
 *
 * `expertise` is the contract with the counsellor listing: the values must
 * match the counsellor records' `expertise` array exactly, because the "Get
 * counselling" CTA deep-links to /counsellor-listing with that filter applied.
 *
 * Copy in `sections`/`faqs` is a working draft for the SEO team to replace.
 * Keep it specific and honest — no invented fees, cut-offs, rankings or
 * success-rate claims. Inaccurate content is punished harder than thin content.
 */

export interface CategoryExam {
  /** Short name people search for, e.g. "CAT". */
  name: string;
  /** Expanded name, used once for clarity. */
  full: string;
}

export interface CounsellingCategory {
  slug: string;
  /** Display name and the head keyword, e.g. "MBA Counselling". */
  name: string;
  /** The single search intent this page serves. One page, one intent. */
  primaryIntent: string;
  /**
   * Counsellor `expertise` values this category maps to. Drives the listing
   * filter — must match the values in the counsellor records.
   */
  expertise: string[];
  /** Commercial support keywords, covered naturally in the body copy. */
  supportKeywords: string[];
  /** Entrance exams covered as sections on this page, not as separate pages. */
  exams: CategoryExam[];
  /** Lead magnet offered alongside the primary CTA. */
  leadOffer: string;
  /** Existing tools on the site that serve this intent. */
  tools: { label: string; to: string }[];
  /** City slugs for the later `/x-counselling/:city` expansion. */
  cities: string[];
  /** Whether this category is validated enough to push hard. */
  priority: "core" | "growth";

  /* ---- SEO copy (SEO team owns everything below) ---- */
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: SeoSection[];
  faqs: SeoFaqItem[];
}

export const COUNSELLING_CATEGORIES: CounsellingCategory[] = [
  {
    slug: "engineering-counselling",
    name: "Engineering Counselling",
    primaryIntent:
      "Find and talk to an engineering admission counsellor about branch and college choice",
    expertise: ["Engineering", "Diploma in Engineering", "Polytechnic"],
    supportKeywords: [
      "engineering admission counselling",
      "engineering college selection",
      "branch selection guidance",
      "engineering choice filling help",
      "engineering admission guidance",
    ],
    exams: [
      { name: "JEE Main", full: "Joint Entrance Examination (Main)" },
      { name: "JEE Advanced", full: "Joint Entrance Examination (Advanced)" },
      { name: "MHT-CET", full: "Maharashtra Common Entrance Test" },
      { name: "KCET", full: "Karnataka Common Entrance Test" },
      { name: "AP EAPCET", full: "Andhra Pradesh Engineering, Agriculture and Pharmacy Common Entrance Test" },
      { name: "CUET", full: "Common University Entrance Test" },
    ],
    leadOffer: "Free branch-and-college shortlist based on your rank",
    tools: [
      { label: "JEE Rank Predictor", to: "/jee-rank-predictor" },
      { label: "JEE College Predictor", to: "/jee-college-predictor" },
      { label: "MHT-CET College Predictor", to: "/mhtcet-college-predictor" },
      { label: "MHT-CET Option Form Filling", to: "/mhtcet-option-form-filling" },
    ],
    cities: ["pune", "mumbai", "delhi", "bangalore", "hyderabad"],
    priority: "core",
    title: "Engineering Counselling — Branch & College Guidance | ProCounsel",
    description:
      "Talk to verified engineering admission counsellors about branch choice, college shortlisting and choice filling for JEE, MHT-CET, KCET and other state exams.",
    h1: "Engineering Counselling — Choose the Right Branch and College",
    intro:
      "Most engineering admission decisions are made in a two-week window between a result and a choice-filling deadline, with incomplete information about which colleges a rank can realistically reach. Engineering counselling is about narrowing that gap: understanding what your rank means in each counselling round, which branches at which colleges are genuinely within reach, and what order to fill them in.",
    sections: [
      {
        heading: "What engineering counselling actually covers",
        paragraphs: [
          "Engineering counselling is not a single conversation about \"which college is best\". It is a sequence of decisions, each with its own deadline and its own consequences.",
        ],
        bullets: [
          "Reading your rank in context — home state quota, all-India quota, category, and how each behaved in previous rounds",
          "Branch versus college — when a better branch at a lesser-known college beats a weaker branch at a bigger name, and when it does not",
          "Choice filling order, which decides your seat more than almost anything else you do",
          "Round strategy — when to hold a seat, when to float, and what you risk in each case",
          "Documents, fees and reporting deadlines that forfeit a seat if missed",
        ],
      },
      {
        heading: "Which entrance exams this covers",
        paragraphs: [
          "Counselling differs sharply by exam because each authority runs its own seat allotment. A counsellor who knows JoSAA rounds well may not know how Maharashtra's CAP rounds behave, which is why our counsellors list the exams and states they actually work with.",
        ],
      },
      {
        heading: "Choosing a branch you can live with",
        paragraphs: [
          "Branch choice tends to be made on placement figures alone. Those figures matter, but they describe the last four years, not the next four. A useful counselling conversation covers what the day-to-day coursework of a branch is like, what kind of work it leads to, and whether that matches how you actually prefer to work.",
        ],
      },
    ],
    faqs: [
      {
        question: "When should I start engineering counselling?",
        answer:
          "Ideally before results, while there is still time to research. In practice most students start the day results are announced. Either works, but starting earlier means the choice-filling decision is made calmly rather than in the last 48 hours before a deadline.",
      },
      {
        question: "Do I need counselling if I already know my rank?",
        answer:
          "A rank tells you where you stand; it does not tell you which colleges will actually admit you in which round, or what order to fill your choices in. That translation from rank to a filled choice list is what counselling is for.",
      },
      {
        question: "Can a counsellor guarantee me a particular college?",
        answer:
          "No, and you should be wary of anyone who says otherwise. Seat allotment is decided by the counselling authority based on ranks, categories and seat availability. What a counsellor can do is make sure your choice list is realistic, complete and correctly ordered.",
      },
    ],
  },

  {
    slug: "medical-counselling",
    name: "Medical Counselling",
    primaryIntent:
      "Find and talk to a medical admission counsellor about NEET rank, quota and college choice",
    expertise: ["Medical", "Dental", "Nursing", "Pharmacy", "Veterinary Sciences"],
    supportKeywords: [
      "NEET counselling",
      "MBBS admission counselling",
      "medical college selection",
      "NEET choice filling help",
      "medical admission guidance",
    ],
    exams: [
      { name: "NEET UG", full: "National Eligibility cum Entrance Test (Undergraduate)" },
      { name: "NEET PG", full: "National Eligibility cum Entrance Test (Postgraduate)" },
      { name: "INI CET", full: "Institute of National Importance Combined Entrance Test" },
    ],
    leadOffer: "Free NEET college shortlist for your score and category",
    tools: [
      { label: "NEET Rank Predictor", to: "/neet-rank-predictor" },
      { label: "NEET College Predictor", to: "/neet-college-predictor" },
      { label: "NEET Cutoffs (Round-wise)", to: "/neet-cutoffs" },
      { label: "State NEET Counselling", to: "/neet-counselling" },
      { label: "MBBS Colleges in India", to: "/mbbs-colleges" },
    ],
    cities: ["delhi", "mumbai", "bangalore", "pune", "lucknow"],
    priority: "core",
    title: "Medical Counselling — NEET Rank, Quota & College Guidance | ProCounsel",
    description:
      "Talk to verified medical admission counsellors about NEET rank, All India and state quota, category cut-offs, and MBBS/BDS college choice filling.",
    h1: "Medical Counselling — NEET Rank, Quota and College Choice",
    intro:
      "NEET counselling is run across several authorities at once: an All India Quota round, a separate round for each state, and further rounds for deemed and private universities. Each has its own registration window, its own cut-off behaviour and its own fee structure. Medical counselling is largely about not losing a seat to a missed window.",
    sections: [
      {
        heading: "Why NEET counselling is harder than the exam",
        paragraphs: [
          "A NEET score is a single number. Turning it into a seat means understanding several parallel processes that do not share deadlines and do not talk to each other.",
        ],
        bullets: [
          "All India Quota versus state quota — eligibility, domicile rules and how the 15/85 split changes what your score can reach",
          "Category and sub-category cut-offs, which move round to round rather than staying fixed",
          "Government, deemed and private colleges — fee ranges differing by an order of magnitude",
          "Security deposits and seat-leaving penalties, which make an unconsidered choice expensive",
          "Round timing — when to accept, when to upgrade, and what happens if you do neither",
        ],
      },
      {
        heading: "Reading last year's cut-offs correctly",
        paragraphs: [
          "Previous-year cut-offs are the most-used and most-misread data in medical admissions. They shift with the number of candidates, paper difficulty and seat matrix changes. They are a guide to relative ordering between colleges, not a promise about your score.",
          "Our round-wise NEET cut-off tool shows how a college's closing rank moved across rounds, which is usually more informative than a single headline number.",
        ],
      },
    ],
    faqs: [
      {
        question: "How does All India Quota differ from state quota?",
        answer:
          "All India Quota covers 15% of government college seats nationally and is open to candidates regardless of domicile. The remaining 85% is allotted by each state to its own domicile candidates under its own rules. Most students are eligible for both and should plan for both.",
      },
      {
        question: "Should I take a private or deemed college seat?",
        answer:
          "That is a financial decision as much as an academic one. Fees vary enormously between government, deemed and private institutions, and bonds or deposits may apply. It is worth working out the full multi-year cost before filling those choices, not after an allotment.",
      },
      {
        question: "What happens if I miss a counselling round?",
        answer:
          "You wait for the next one, with fewer seats left. Missed registration windows are the most common avoidable reason students end up with a worse seat than their rank allowed.",
      },
    ],
  },

  {
    slug: "mba-counselling",
    name: "MBA Counselling",
    primaryIntent:
      "Find and talk to an MBA admission counsellor about profile, percentile and B-school shortlist",
    expertise: ["MBA", "BBA", "Banking and Finance"],
    supportKeywords: [
      "MBA admission counselling",
      "MBA college selection",
      "MBA admission guidance",
      "MBA college comparison",
      "B-school shortlisting",
    ],
    exams: [
      { name: "CAT", full: "Common Admission Test" },
      { name: "XAT", full: "Xavier Aptitude Test" },
      { name: "MAT", full: "Management Aptitude Test" },
      { name: "SNAP", full: "Symbiosis National Aptitude Test" },
      { name: "NMAT", full: "NMAT by GMAC" },
      { name: "GMAT", full: "Graduate Management Admission Test" },
    ],
    leadOffer: "Free MBA profile evaluation and personalised college shortlist",
    tools: [],
    cities: ["pune", "mumbai"],
    priority: "growth",
    title: "MBA Counselling — Profile Evaluation & B-School Shortlist | ProCounsel",
    description:
      "Talk to verified MBA admission counsellors about your CAT, XAT, MAT, SNAP, NMAT or GMAT profile, realistic B-school shortlists, and the interview stage.",
    h1: "MBA Counselling — Profile Evaluation and College Shortlisting",
    intro:
      "An MBA application is judged on more than a percentile. Academic consistency, work experience, the story behind a career switch and interview performance all feed into a call. MBA counselling is about reading your profile the way an admissions committee will, then building a shortlist that has ambitious, realistic and safe options in it rather than only the first.",
    sections: [
      {
        heading: "What a profile evaluation looks at",
        paragraphs: [
          "A percentile decides which calls you are eligible for. Your profile decides what happens after that. Most B-schools weight academics, work experience, diversity and the final interview alongside the test score.",
        ],
        bullets: [
          "Percentile and sectional cut-offs, which are separate hurdles",
          "Academic record across class 10, 12 and graduation, where consistency matters more than any single number",
          "Work experience — how long, in what, and whether it supports the story you are telling",
          "Diversity factors that some schools weight explicitly in their selection criteria",
          "Where your profile is genuinely weak, and what can still be done about it this cycle",
        ],
      },
      {
        heading: "Building a shortlist instead of a wishlist",
        paragraphs: [
          "The most common MBA shortlisting mistake is a list made entirely of ambitious calls, with nothing to fall back on. A workable shortlist has a spread: schools where your profile is above the typical admit, schools where it is around the middle, and schools where it is comfortably above the bar.",
          "Comparing schools sensibly means looking past the headline ranking — at specialisation strength, fees against likely outcomes, location, and which recruiters actually visit the campus for the role you want.",
        ],
      },
      {
        heading: "Which exams this covers",
        paragraphs: [
          "CAT is the largest but far from the only route. XAT, SNAP, NMAT and MAT open different sets of schools, and GMAT opens both Indian and international options. Taking more than one is often the difference between a call and no call, and the calendar for these overlaps in ways worth planning around early.",
        ],
      },
      {
        heading: "After the call: WAT, GD and personal interview",
        paragraphs: [
          "For many candidates the interview stage, not the written test, is where the outcome is decided. Preparation here is specific and practisable: knowing your own CV well enough to defend every line of it, having a coherent answer for why an MBA and why now, and being current on the sectors you claim to care about.",
        ],
      },
    ],
    faqs: [
      {
        question: "What percentile do I need for a good MBA college?",
        answer:
          "It depends entirely on the school and your category, and sectional cut-offs matter as much as the overall figure. Rather than a single target number, it is more useful to work backwards from a specific shortlist and see what each school on it has historically called.",
      },
      {
        question: "Does work experience matter for an MBA in India?",
        answer:
          "It varies by school. Some weight it explicitly in their selection criteria, others admit large fresher cohorts. What matters more than the length is whether it is consistent with the reason you give for wanting the degree.",
      },
      {
        question: "Should I take CAT only, or other exams too?",
        answer:
          "Most candidates benefit from more than one. XAT, SNAP, NMAT and MAT open different schools, and one weak test day does not then end the cycle. The trade-off is preparation time, which is why the decision is worth making early.",
      },
      {
        question: "Is it worth taking a drop year to improve my percentile?",
        answer:
          "Sometimes, but it should be a considered decision rather than a default reaction to one result. It is worth comparing what a realistically improved percentile would change about your shortlist against the cost of another year.",
      },
    ],
  },

  {
    slug: "law-counselling",
    name: "Law Counselling",
    primaryIntent:
      "Find and talk to a law admission counsellor about CLAT, NLU choice and law college selection",
    expertise: ["Law"],
    supportKeywords: [
      "CLAT counselling",
      "law admission counselling",
      "NLU admission guidance",
      "law college selection",
      "law admission guidance",
    ],
    exams: [
      { name: "CLAT", full: "Common Law Admission Test" },
      { name: "AILET", full: "All India Law Entrance Test" },
      { name: "LSAT India", full: "Law School Admission Test — India" },
      { name: "MH CET Law", full: "Maharashtra Common Entrance Test for Law" },
    ],
    leadOffer: "Free law college shortlist based on your rank and category",
    tools: [],
    cities: ["delhi", "mumbai", "bangalore", "pune"],
    priority: "growth",
    title: "Law Counselling — CLAT, NLU & Law College Guidance | ProCounsel",
    description:
      "Talk to verified law admission counsellors about CLAT and AILET ranks, NLU preferences, five-year versus three-year LLB, and law college choice filling.",
    h1: "Law Counselling — CLAT Rank, NLU Choice and Law College Selection",
    intro:
      "Law admissions in India run through a small number of competitive entrance tests feeding a very wide range of institutions, from the National Law Universities to private and state colleges. The decisions that matter are which test to target, whether a five-year integrated course or a three-year LLB fits your situation, and how to order NLU preferences in the common counselling process.",
    sections: [
      {
        heading: "Five-year integrated LLB or three-year LLB",
        paragraphs: [
          "The five-year integrated route is taken directly after class 12 and combines a bachelor's degree with law. The three-year LLB is taken after graduation. Neither is inherently better — they suit different starting points, and the choice mostly follows from where you are now rather than from any ranking of the two.",
        ],
      },
      {
        heading: "How CLAT counselling preferences work",
        paragraphs: [
          "CLAT feeds a common counselling process across participating NLUs, where your preference order interacts with your rank and category to decide allotment. As with engineering, the order you submit matters as much as the rank itself, and the same discipline applies: fill genuinely, fill completely, and understand what each round can and cannot change.",
        ],
      },
      {
        heading: "Beyond the NLUs",
        paragraphs: [
          "A CLAT rank outside NLU range is not the end of a law career. Several private universities and state law colleges have strong practice-oriented programmes and their own admission routes, some through LSAT India or state-level tests. A counsellor who knows the landscape can point out options that a rank-first view of the process misses entirely.",
        ],
      },
    ],
    faqs: [
      {
        question: "What rank do I need for an NLU?",
        answer:
          "It varies widely between the NLUs and by category, and shifts each year with the candidate pool. Previous-year closing ranks per university and category are the right reference point, read as a guide to relative ordering rather than as a fixed threshold.",
      },
      {
        question: "Is CLAT the only way into law?",
        answer:
          "No. AILET is a separate test for NLU Delhi, LSAT India is accepted by a number of private universities, and several states run their own law entrance tests. Which ones are worth taking depends on where you are willing to study.",
      },
      {
        question: "Should I take a five-year course or graduate first?",
        answer:
          "If you are certain about law at the end of class 12, the five-year integrated route gets you there sooner. If you are not certain, or want a different bachelor's subject first, the three-year LLB after graduation is a perfectly normal path into the profession.",
      },
    ],
  },

  {
    slug: "academic-counselling",
    name: "Academic Counselling",
    primaryIntent:
      "Find and talk to an academic counsellor about stream, subject and degree choice",
    expertise: ["HSC", "B.Sc", "B.A.", "B.Com", "M.Sc", "M.A.", "M.Com", "B.Ed", "M.Ed", "Psychology"],
    supportKeywords: [
      "stream selection after 10th",
      "subject choice after 12th",
      "career counselling for students",
      "degree course selection",
      "academic guidance for students",
    ],
    exams: [
      { name: "CUET", full: "Common University Entrance Test" },
      { name: "Board exams", full: "Class 10 and Class 12 board examinations" },
    ],
    leadOffer: "Free stream and subject-fit discussion",
    tools: [{ label: "Mettle Career Test", to: "/mettle" }],
    cities: ["delhi", "mumbai", "pune", "bangalore"],
    priority: "core",
    title: "Academic Counselling — Stream, Subject & Degree Guidance | ProCounsel",
    description:
      "Talk to verified academic counsellors about stream selection after class 10, subject and degree choice after class 12, CUET planning and course fit.",
    h1: "Academic Counselling — Stream, Subject and Degree Choice",
    intro:
      "The decisions that shape a career are usually made earlier than people expect — a stream chosen at 15, a subject combination at 17 — and often on the basis of what a student is currently good at rather than what they would want to do for a decade. Academic counselling is about widening that decision before it narrows the options.",
    sections: [
      {
        heading: "Choosing a stream after class 10",
        paragraphs: [
          "Science, commerce and humanities are still discussed as a hierarchy, which is the single least useful way to think about the choice. Each opens a wide range of degrees and careers; what matters is the fit between the subjects a student will actually study for two years and the way they prefer to work.",
        ],
        bullets: [
          "What each stream involves day to day, not just where it can lead",
          "Which streams keep the most doors open for a student who is genuinely undecided",
          "How stream choice interacts with entrance exams taken two years later",
          "What can and cannot be changed later, and at what cost",
        ],
      },
      {
        heading: "Subject and degree choice after class 12",
        paragraphs: [
          "After class 12 the choice broadens sharply, and the well-known routes — engineering, medicine, commerce — are a small fraction of what exists. Design, psychology, agriculture, hotel management, journalism and pure sciences all have established paths that rarely come up in a school corridor conversation.",
          "CUET has also changed how many central university admissions work, which makes subject choice and exam planning a single decision rather than two separate ones.",
        ],
      },
      {
        heading: "When an aptitude assessment helps",
        paragraphs: [
          "A structured assessment is most useful for a student who is genuinely undecided rather than one who already has a direction and wants confirmation. It gives a counselling conversation something concrete to work from instead of starting at \"what do you enjoy\", which most 17-year-olds reasonably cannot answer on the spot.",
        ],
      },
    ],
    faqs: [
      {
        question: "My child is confused about which stream to take. Where do we start?",
        answer:
          "Start with what the streams actually involve rather than where they lead. Most confusion at this stage comes from comparing career outcomes that are a decade away instead of comparing two years of subjects that begin in a month.",
      },
      {
        question: "Can a stream be changed after class 11?",
        answer:
          "Often yes, but it varies by board and school and usually needs to happen early in the year. It is much easier to make a considered choice up front than to correct one mid-course.",
      },
      {
        question: "Is an aptitude test worth taking?",
        answer:
          "It is most useful when a student is genuinely undecided. It is not a verdict on what someone should do — it is a starting point for a conversation, and it works best when discussed with a counsellor rather than read alone as a result.",
      },
    ],
  },
];

export const COUNSELLING_CATEGORY_SLUGS = COUNSELLING_CATEGORIES.map((c) => c.slug);

export function getCategoryBySlug(slug?: string): CounsellingCategory | undefined {
  if (!slug) return undefined;
  const s = slug.toLowerCase();
  return COUNSELLING_CATEGORIES.find((c) => c.slug === s);
}

/**
 * The listing URL the "Get counselling" CTA sends people to: the counsellor
 * list pre-filtered to this category's expertise, with the originating page
 * recorded so the lead captured at login knows where it came from.
 */
export function categoryListingUrl(category: CounsellingCategory): string {
  const params = new URLSearchParams({
    expertise: category.expertise.join(","),
    from: category.slug,
  });
  return `/counsellor-listing?${params.toString()}`;
}
