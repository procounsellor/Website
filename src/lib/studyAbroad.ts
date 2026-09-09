import type { SeoFaqItem, SeoSection } from "@/components/SEO/SeoArticle";

/**
 * All copy and data for /study-abroad.
 *
 * Kept in its own module (and only ever imported by the lazily-loaded page) so
 * none of it reaches the eager entry chunk — same rule as the counselling
 * category data. See src/lib/counsellingSlugs.ts for why that matters.
 *
 * The page is a lead-generation landing page and is the destination for paid
 * traffic, so everything here has to survive being read by a student who is
 * comparing us against five other consultants: real numbers, stated as ranges,
 * with the year they apply to. Nothing here is fetched at runtime, which is
 * also what lets the page prerender with its full content.
 */

export const STUDY_ABROAD_UPDATED = "2027 intakes";

export interface Destination {
  /** Stable key — also the value sent to the CRM in `interestedStates`. */
  slug: string;
  /** Full country name, used in headings and the lead payload. */
  name: string;
  /** Short label for chips and the form's selection list. */
  short: string;
  flag: string;
  /** One line on who this country actually suits. */
  headline: string;
  /**
   * Every comparison column is a loud primary and a quiet note under it, so a
   * reader scanning the board sees eight numbers, not eight sentences. Keep the
   * primary to a bare figure and put the caveat in the note.
   */
  tuition: string;
  tuitionNote: string;
  living: string;
  /** One chip each. */
  intakes: string[];
  stayBack: string;
  stayBackNote: string;
  /** The full rule, for the row's detail panel. */
  workRights: string;
  tests: string;
  popular: string[];
  /** The thing a student usually finds out too late. */
  watchOut: string;
}

/**
 * Costs are indicative annual ranges for Indian students, in local currency
 * with an approximate rupee figure, and they move every year — the page says
 * so next to the grid rather than pretending otherwise.
 */
export const DESTINATIONS: Destination[] = [
  {
    slug: "usa",
    name: "United States",
    short: "USA",
    flag: "\u{1F1FA}\u{1F1F8}",
    headline: "The widest choice of universities, and the most paperwork.",
    tuition: "$20,000–60,000",
    tuitionNote: "≈ ₹17–50 L",
    living: "$10,000–18,000",
    intakes: ["Aug–Sep", "Jan"],
    stayBack: "1 year",
    stayBackNote: "3 years with STEM",
    workRights: "Twelve months of OPT after you graduate, extended to 36 months for STEM degrees.",
    tests: "IELTS or TOEFL, plus GRE or GMAT for many master's programmes",
    popular: ["MS Computer Science", "Data Science", "MS Engineering", "MBA", "Business Analytics"],
    watchOut: "Applications close 8–11 months before the intake, and the F-1 visa interview is a real filter — funding documents have to be clean and consistent.",
  },
  {
    slug: "uk",
    name: "United Kingdom",
    short: "UK",
    flag: "\u{1F1EC}\u{1F1E7}",
    headline: "A one-year master's, so you re-enter the job market sooner.",
    tuition: "£12,000–38,000",
    tuitionNote: "≈ ₹13–40 L",
    living: "£10,000–15,000, more in London",
    intakes: ["Sep", "Jan"],
    stayBack: "2 years",
    stayBackNote: "3 years after a PhD",
    workRights: "The Graduate Route currently allows two years of work after your degree, three after a PhD.",
    tests: "IELTS Academic or UKVI; GMAT for some MBA programmes",
    popular: ["MSc Management", "MSc Finance", "MSc Computer Science", "Law (LLM)", "Public Health"],
    watchOut: "The one-year format is intense and gives you a short window to find a job — plan the internship search before you land, not after.",
  },
  {
    slug: "canada",
    name: "Canada",
    short: "Canada",
    flag: "\u{1F1E8}\u{1F1E6}",
    headline: "The clearest path from study to work to residency.",
    tuition: "CAD 15,000–35,000",
    tuitionNote: "≈ ₹9–22 L",
    living: "CAD 12,000–18,000",
    intakes: ["Sep", "Jan", "May"],
    stayBack: "Up to 3 years",
    stayBackNote: "Eligible programmes only",
    workRights: "A Post-Graduation Work Permit of up to three years — but only for programmes on the eligible list.",
    tests: "IELTS or PTE; some programmes accept Duolingo",
    popular: ["Business", "Computer Science", "Nursing", "Supply Chain", "Civil Engineering"],
    watchOut: "Since 2024 the study permit needs a provincial attestation letter, and college programmes only earn a work permit if the field of study is on the eligible list. Confirm both before you pay a deposit.",
  },
  {
    slug: "australia",
    name: "Australia",
    short: "Australia",
    flag: "\u{1F1E6}\u{1F1FA}",
    headline: "Strong on health, engineering and trades, with real part-time work.",
    tuition: "AUD 25,000–45,000",
    tuitionNote: "≈ ₹14–25 L",
    living: "AUD 22,000–28,000",
    intakes: ["Feb", "Jul"],
    stayBack: "2–3 years",
    stayBackNote: "By qualification",
    workRights: "A Temporary Graduate visa of two to three years, depending on your qualification and where you studied.",
    tests: "IELTS, PTE or TOEFL",
    popular: ["Nursing", "IT", "Accounting", "Construction Management", "Data Science"],
    watchOut: "The Genuine Student requirement means your statement of purpose is assessed as evidence — a generic one is the most common reason a good profile gets refused.",
  },
  {
    slug: "germany",
    name: "Germany",
    short: "Germany",
    flag: "\u{1F1E9}\u{1F1EA}",
    headline: "No tuition at public universities — the budget is living costs.",
    tuition: "No tuition fee",
    tuitionNote: "At public universities",
    living: "€11,900 in a blocked account, plus €150–400 a semester",
    intakes: ["Oct", "Apr"],
    stayBack: "18 months",
    stayBackNote: "To find a job",
    workRights: "An 18-month residence permit to look for work, which converts to an EU Blue Card once you are hired.",
    tests: "IELTS or TOEFL; German at B1–B2 for many courses and for most jobs",
    popular: ["Mechanical Engineering", "Automotive", "Computer Science", "Renewable Energy", "Data Engineering"],
    watchOut: "Admission is decided almost entirely on your bachelor's marks and subject match — Uni-Assist rejects on curriculum gaps, not on essays.",
  },
  {
    slug: "ireland",
    name: "Ireland",
    short: "Ireland",
    flag: "\u{1F1EE}\u{1F1EA}",
    headline: "An English-speaking EU base for tech, pharma and finance.",
    tuition: "€10,000–25,000",
    tuitionNote: "≈ ₹9–23 L",
    living: "€10,000–14,000",
    intakes: ["Sep", "Jan"],
    stayBack: "2 years",
    stayBackNote: "After a master's",
    workRights: "The Third Level Graduate Programme gives two years after a master's and one after a bachelor's.",
    tests: "IELTS or PTE",
    popular: ["MSc Data Analytics", "Computer Science", "Pharmaceutical Science", "International Business", "Fintech"],
    watchOut: "Dublin housing is the binding constraint. Accommodation has to be lined up alongside the offer, not after the visa.",
  },
  {
    slug: "new-zealand",
    name: "New Zealand",
    short: "New Zealand",
    flag: "\u{1F1F3}\u{1F1FF}",
    headline: "Australia's style of qualification at a lower cost.",
    tuition: "NZD 22,000–35,000",
    tuitionNote: "≈ ₹11–18 L",
    living: "NZD 15,000–20,000",
    intakes: ["Feb", "Jul"],
    stayBack: "Up to 3 years",
    stayBackNote: "By qualification",
    workRights: "A post-study work visa of up to three years, tied to the level and length of your qualification.",
    tests: "IELTS, PTE or TOEFL",
    popular: ["IT", "Agriculture", "Hospitality Management", "Engineering", "Construction"],
    watchOut: "The job market is small, so the post-study visa is only as useful as the sector you studied for. Pick the course around the skills shortage list.",
  },
  {
    slug: "dubai",
    name: "Dubai and the UAE",
    short: "Dubai / UAE",
    flag: "\u{1F1E6}\u{1F1EA}",
    headline: "Western branch campuses, two hours from home.",
    tuition: "AED 37,000–75,000",
    tuitionNote: "≈ ₹8–17 L",
    living: "AED 30,000–45,000",
    intakes: ["Sep", "Jan"],
    stayBack: "Employer sponsored",
    stayBackNote: "No automatic visa",
    workRights: "No automatic post-study visa: you move to an employer-sponsored residence visa, or a Green visa if you qualify.",
    tests: "IELTS often waived if your schooling was in English",
    popular: ["Business", "Engineering", "Hospitality", "Media", "Computer Science"],
    watchOut: "Check that the branch campus degree is the parent university's own award and is recognised in India — that is the difference between a degree and a certificate.",
  },
];

export function getDestination(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}

export interface ProcessStep {
  /** When this happens, relative to the first call. */
  when: string;
  title: string;
  body: string;
  /** What the counsellor actually does at this point. */
  works: string[];
}

/**
 * The engagement, as a sequence rather than a feature list — which is why the
 * stages are numbered and why what we do sits inside the stage it happens in.
 */
export const PROCESS: ProcessStep[] = [
  {
    when: "Day 1",
    title: "Free profile review",
    body: "A counsellor goes through your marks, backlogs, test scores, budget and target intake on a call, and tells you plainly which countries are realistic.",
    works: [
      "Your academics and budget read against real admission bars",
      "The countries worth your applications, and the ones that are not",
    ],
  },
  {
    when: "Week 1",
    title: "Shortlist locked",
    body: "Eight to twelve universities split into ambitious, matching and safe, with fees, deadlines and scholarship deadlines against each one.",
    works: [
      "Course and university shortlist built around what you want to be doing in five years",
      "Which language or aptitude test your shortlist actually needs, and the score to aim for",
    ],
  },
  {
    when: "Weeks 2 to 6",
    title: "Tests and documents",
    body: "Test slots booked, transcripts and certificates collected, and your application written rather than assembled.",
    works: [
      "IELTS, TOEFL, PTE, GRE or GMAT planned around the application deadline",
      "Statement of purpose and recommendation letters built from your own record",
    ],
  },
  {
    when: "Weeks 6 to 10",
    title: "Applications submitted",
    body: "Every application filed and tracked, and one offer accepted at the end of it.",
    works: [
      "Portals filled, deadlines tracked, universities followed up",
      "Scholarships and fee waivers applied for before the general deadline closes",
    ],
  },
  {
    when: "After the offer",
    title: "Funding and the visa file",
    body: "The part where applications are lost: money that does not add up, and a file prepared for the wrong test.",
    works: [
      "Education loan options compared, with and without collateral",
      "Blocked account or GIC, proof of funds, and a mock interview run the way the consulate runs it",
    ],
  },
  {
    when: "Before you fly",
    title: "Housing and departure",
    body: "The practical fortnight before departure, handled with a checklist instead of panic.",
    works: [
      "Accommodation near campus, forex, insurance and a pre-departure briefing",
      "Bank account, SIM and residence registration in your first week there",
    ],
  },
];

/**
 * The strip under the headline. Every line here has to be true and checkable on
 * this page or from the platform itself — no headcounts, no callback SLA and no
 * "students placed" number, because we cannot stand behind any of them.
 */
export const HIGHLIGHTS: { value: string; label: string }[] = [
  { value: "Free", label: "First counselling session" },
  { value: "8", label: "Study destinations covered" },
  { value: "1:1", label: "A counsellor calls you back" },
];

/** What the free call actually gives them — used next to the form. */
export const FORM_PROMISES = [
  "A counsellor calls you back on the number you give us",
  "An honest read on which countries fit your marks and budget",
  "A university shortlist and the deadlines you are already close to",
  "No charge, and no obligation to sign up for anything",
];

export const STUDY_LEVELS = [
  "Bachelor's (after 12th)",
  "Master's / MS",
  "MBA",
  "PhD / Research",
  "Diploma or certificate",
] as const;

/**
 * What the student has finished already. Sent verbatim as `qualification` on
 * the foreign-student record, so these strings are what the calling desk reads
 * in the admin list — keep them short.
 */
export const QUALIFICATIONS = [
  "12th",
  "Diploma",
  "Bachelor's",
  "Master's",
] as const;

/**
 * Real intakes, newest first. The year is parsed out of these for the lead's
 * `startYear`, so each label must either carry a four-digit year or be the
 * explicit "not decided" option.
 */
export const INTAKES = [
  "January 2027",
  "September 2027",
  "January 2028",
  "September 2028",
  "Not decided yet",
] as const;

/** The four-digit year inside an intake label, or "" when they have not decided. */
export function startYearOf(intake: string): string {
  return /\b(20\d{2})\b/.exec(intake)?.[1] ?? "";
}

export const TEST_STATUS = [
  "Not started yet",
  "Preparing now",
  "IELTS done",
  "TOEFL done",
  "PTE done",
  "GRE done",
  "GMAT done",
] as const;

export const BUDGETS = [
  "Under ₹15 lakh total",
  "₹15–25 lakh total",
  "₹25–40 lakh total",
  "Above ₹40 lakh total",
  "Depends on the loan",
] as const;

export const FIELDS_OF_STUDY = [
  "Computer Science / IT",
  "Data Science / AI",
  "Engineering (other)",
  "Business / Management",
  "Finance / Accounting",
  "Health and Nursing",
  "Medicine",
  "Law",
  "Design and Media",
  "Hospitality",
  "Other",
] as const;

export const STUDY_ABROAD_SECTIONS: SeoSection[] = [
  {
    heading: "What studying abroad actually costs an Indian student",
    paragraphs: [
      "The number that matters is not the tuition fee on a university website, it is the total for the whole degree: tuition, living costs, one-time expenses like the visa fee, health insurance and airfare, and the money you have to show a consulate before any of it is approved. A one-year master's in the UK typically lands between ₹28 and ₹45 lakh all in. A two-year master's in the United States runs from ₹35 lakh to well past ₹70 lakh. Canada and Australia sit in the middle. Germany is the outlier — public universities charge no tuition, so the total is mostly the ₹11–13 lakh you must park in a blocked account for living costs.",
      "Most families fund this with a mix: savings, an education loan, and a scholarship or fee waiver from the university itself. Loans up to ₹7.5 lakh generally need no collateral; above that, banks usually ask for property or a fixed deposit, while some non-banking lenders will lend against a strong admit and a co-applicant's income. The interest clock and the moratorium period differ enough between lenders that comparing two offers is worth a full conversation.",
    ],
    bullets: [
      "Tuition is between 50% and 70% of the total for most destinations",
      "Budget for one-time costs of ₹3–5 lakh: visa, insurance, tickets, deposits, forex",
      "University scholarships are usually awarded from the application itself, so applying early matters more than applying to more places",
      "Show funds for the first year plus tuition, in the format your destination specifies — a GIC in Canada, a blocked account in Germany, bank statements and loan sanction letters elsewhere",
    ],
  },
  {
    heading: "Choosing the country before you choose the university",
    paragraphs: [
      "Students often start with a university name and work backwards, which is how people end up with an expensive degree in a country whose job market they cannot enter. The more useful order is country, then course, then university. The country decides your visa rules, your right to work while studying, how long you can stay after you graduate, and whether your qualification is recognised by the employers you are targeting.",
      "A rough guide: pick the United States if you want research depth and are ready for a long, document-heavy application cycle. Pick the United Kingdom if a one-year master's and a fast return to work suits you. Pick Canada if the long-term plan includes residency and your programme is on the eligible list. Pick Australia or New Zealand for health, engineering and trades where the skills shortage is real. Pick Germany if your marks are strong, your subject is technical and cost is the constraint. Pick Ireland for tech in the EU, and Dubai if you want a Western-affiliated degree close to home.",
    ],
  },
  {
    heading: "Intakes and the deadlines that decide them",
    paragraphs: [
      "Every destination runs on a calendar you cannot negotiate with. The main intake is Fall or September in the US, UK, Canada and Ireland; February in Australia and New Zealand; and Winter, starting in October, in Germany. Applications open eight to twelve months ahead, and the good scholarship deadlines close first — often several months before the general application deadline.",
      "In practice that means the work starts a year before you fly. A student targeting September 2027 should have a test score by December 2026, applications in by January 2027, an offer accepted by April, and a visa filed by June. Miss that chain at one link and the realistic answer becomes the next intake, which is a full year, not a month.",
    ],
    bullets: [
      "Book the language test early — slots in metro cities fill weeks ahead",
      "Transcripts, degree certificates and bank documents take longer to collect than students expect",
      "Scholarship deadlines are usually earlier than admission deadlines",
      "A visa appointment is a queue, not a formality — leave eight to ten weeks for it",
    ],
  },
  {
    heading: "Tests: which ones you actually need",
    paragraphs: [
      "Almost every English-taught programme wants proof of English. IELTS is accepted everywhere; TOEFL and PTE are accepted almost as widely, and PTE results come back faster. Duolingo is accepted by a growing set of universities but not by every visa authority, so check the visa rule and not just the admission rule.",
      "Aptitude tests are narrower than the internet suggests. The GRE is expected for many US master's programmes in engineering and the sciences, though a growing number have made it optional. The GMAT is for MBA and some business master's. Neither is normally needed for the UK, Ireland, Australia, New Zealand or Germany. Before you spend three months on a GRE, confirm that your shortlist requires it.",
    ],
  },
  {
    heading: "The visa file is a document exercise, not a personality test",
    paragraphs: [
      "Refusals cluster around a small set of causes: funds that do not match the declared sponsor, a study plan that does not follow from your academic record, gaps in education that are unexplained, or a statement of purpose written for no country in particular. All four are fixable before you file.",
      "What each destination is testing differs. The US interview probes intent and funding. Australia assesses a Genuine Student statement. Canada wants the attestation letter, the GIC and a programme that fits its eligibility rules. Germany wants the blocked account and the subject match. Preparing for the wrong one of these is the most common avoidable mistake.",
    ],
  },
  {
    heading: "Working during and after your degree",
    paragraphs: [
      "Part-time work is capped in most destinations — commonly around twenty hours a week during term — and it covers a share of living costs, not tuition. Treat it as relief, not as a funding plan.",
      "Post-study work rights are the part worth optimising for. The US gives twelve months of OPT, extended to three years for STEM degrees. The UK's Graduate Route currently runs two years. Canada's post-graduation permit runs up to three years but only for eligible programmes. Australia and New Zealand offer two to three years. Germany gives an eighteen-month job-seeker permit. Ireland gives two years after a master's. These rules change with each government, which is exactly why the shortlist should be built on the rules in force for your intake.",
    ],
  },
  {
    heading: "How ProCounsel works",
    paragraphs: [
      "ProCounsel is a counselling platform, not an agency selling one university's seats. You are matched with a counsellor who has worked on your destination, and you can also talk to ProBuddies — students already studying at colleges abroad and in India, who answer the questions no brochure covers, from what the campus is like in February to whether the part-time work claim holds up.",
      "The first profile review call is free. If you go ahead, the counsellor stays with you through tests, applications, funding, the visa and departure, and you can see their profile, experience and reviews before you commit to anything.",
    ],
  },
];

export const STUDY_ABROAD_FAQS: SeoFaqItem[] = [
  {
    question: "Is the first counselling call really free?",
    answer:
      "Yes. The profile review call — your marks, budget, target intake and a realistic country shortlist — costs nothing and does not commit you to anything. Paid help starts only if you choose to work with a counsellor on the full application.",
  },
  {
    question: "How much does it cost to study abroad from India?",
    answer:
      "For a full degree, budget ₹28–45 lakh for a one-year UK master's, ₹35–70 lakh for a two-year US master's, ₹25–40 lakh in Canada or Australia, and ₹15–20 lakh in Germany where public universities charge no tuition. Those totals include tuition, living costs, insurance, travel and one-time expenses.",
  },
  {
    question: "Which country is cheapest for Indian students?",
    answer:
      "Germany, because public universities charge no tuition and you mainly fund living costs. After that, Dubai and the UAE for branch campuses, and New Zealand and Ireland for shorter, lower-fee master's programmes. The cheapest option is only the right one if its job market matches your field.",
  },
  {
    question: "Can I study abroad without IELTS?",
    answer:
      "Sometimes. Many universities waive the English test if your schooling and degree were taught in English and you can produce a medium-of-instruction letter, and several accept PTE, TOEFL or Duolingo instead. The visa authority may still ask for a score, so confirm the visa rule and not only the admission rule.",
  },
  {
    question: "How early should I start the process?",
    answer:
      "Twelve months before your intake is comfortable and eight is workable. For a September 2027 intake that means starting test preparation around late 2026, applying by January 2027, and filing the visa by June 2027.",
  },
  {
    question: "Do backlogs or a low percentage rule me out?",
    answer:
      "No, but they narrow the list. Universities in Canada, Australia, New Zealand and parts of Europe assess backlogs case by case, and a strong test score, relevant work experience or a well-argued statement of purpose can offset an average transcript. Germany is the strictest on marks and subject match.",
  },
  {
    question: "Can I get an education loan without collateral?",
    answer:
      "Up to around ₹7.5 lakh, most banks lend without security. Above that, public banks generally want collateral, while some private and non-banking lenders will lend against an admit letter and a co-applicant's income at a higher rate. Your counsellor compares the options against your admit and your family's profile.",
  },
  {
    question: "Can I work while studying abroad?",
    answer:
      "In most destinations you can work part time, commonly up to about twenty hours a week during term and full time in vacations. It helps with living costs. It does not fund tuition, and no honest counsellor will tell you otherwise.",
  },
  {
    question: "What happens after I submit this form?",
    answer:
      "Your details go to the study abroad desk and a counsellor calls you back. The call covers your profile, the countries that fit it and the deadlines you are closest to. You decide after that whether you want help with the applications.",
  },
  {
    question: "Do you help after I get the visa?",
    answer:
      "Yes. Accommodation, forex, insurance, a pre-departure briefing and the first weeks after you land — bank account, SIM, registration — are part of the same engagement, and your counsellor stays reachable once you are there.",
  },
];

export const STUDY_ABROAD_KEYWORDS = [
  "study abroad consultants",
  "study abroad from india",
  "overseas education consultants",
  "study in usa",
  "study in uk",
  "study in canada",
  "study in australia",
  "study in germany",
  "ms in usa consultants",
  "student visa guidance",
  "free study abroad counselling",
  "education loan for abroad studies",
].join(", ");
