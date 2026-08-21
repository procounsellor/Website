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
      "Find and talk to an engineering admission counsellor about branch, college choice and choice filling",
    expertise: ["Engineering", "Diploma in Engineering", "Polytechnic"],
    supportKeywords: [
      "engineering admission counselling",
      "engineering career counselling",
      "counselling for b tech colleges",
      "career counselling for engineering students",
      "counselling for admission in engineering colleges",
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
    title: "Engineering Counselling & Admission Guidance | ProCounsel",
    description:
      "Get expert engineering counselling and admission guidance to choose the right BTech college, course and branch based on your rank, preferences and career goals.",
    h1: "Engineering Counselling & Admission Guidance",
    intro:
      "You finally got your entrance exam rank. For a few minutes, it feels like the stressful part is over. Then someone asks, “So, which college are you taking?” And suddenly, the confusion starts again. You have a rank, but now you have to figure out what to do with it.",
    sections: [
      {
        heading: "A rank is only the first step",
        paragraphs: [
          "Which colleges can you realistically get? Which branch should you choose? Should you put CSE above everything else? What if you get a better college but a branch you weren't planning to take? How many choices should you fill? Should you wait for another counselling round?",
          "And somewhere in the middle of all this, you may still be thinking: “What should I actually choose?”",
          "This is where engineering admission decisions can become difficult. Getting a rank is one thing. Turning that rank into a sensible college and branch choice is another.",
          "ProCounsel helps students and parents make these decisions with personalised engineering counselling, college exploration, admission guidance and career-related support. The aim isn't to tell every student, “Take this college.” It's to understand your situation first, then help you look at your options more clearly.",
        ],
      },
      {
        heading: "Education, admission & career counselling",
        paragraphs: [
          "Engineering admission isn't really one decision. There are at least three decisions sitting together: What should I study? Where should I study? What do I want to do after that?",
          "Students sometimes look at only one of these. They may choose a college because it has a strong reputation without checking whether the branch suits them. Or they may choose CSE simply because everyone around them is choosing it, without thinking about whether they actually enjoy the subjects involved. Neither approach is necessarily wrong for every student. But neither should be automatic.",
          "Your entrance rank matters. Your interests matter. Your preferred branch matters. Fees matter. Location matters. Your career plans matter. Sometimes the most useful counselling conversation starts with a very simple question: “What are you actually looking for from your engineering degree?” The answer can change the entire college search.",
        ],
      },
      {
        heading: "Education counselling services",
        paragraphs: [
          "For an engineering aspirant, education counselling is not about telling you that engineering is automatically the right choice. It starts with understanding whether the field, course and possible pathways make sense for you.",
          "Maybe you have always wanted to become an engineer. Maybe your parents suggested engineering because you are good at Maths and Physics. Maybe you are interested in technology but aren't sure which BTech program fits. Or maybe you are preparing for engineering entrance exams simply because you didn't know what else to do. These are very different situations.",
          "There is also no rule saying that every good engineering student has to choose the same branch. CSE may be right for one student. ECE may make more sense for another. Someone else may genuinely enjoy Mechanical, Civil, Electrical or Chemical. The point isn't to find the “most popular” option. It's to find an option that makes sense for you.",
        ],
        bullets: [
          "Your academic performance and entrance exam rank",
          "Subjects you enjoy and your strengths",
          "Career interests and preferred engineering branches",
          "Budget, preferred location and college expectations",
          "Plans for higher studies",
          "Alternative options if engineering turns out not to be the right fit",
        ],
      },
      {
        heading: "Admission counselling services",
        paragraphs: [
          "This is usually where things get serious. You have your rank. You have a list of colleges. You have heard what your friends are doing. Now comes the choice filling — and this is where many students start second-guessing themselves.",
          "“Should I put this college first?” “What if I don't get my first choice?” “Should I keep more backup options?” “If I get a lower branch in a better college, should I take it?” “What happens if I don't get anything in the first round?”",
          "One important thing to understand is that a predictor is a starting point, not a final answer. ProCounsel's MHT-CET predictor states that its predictions are based on previous counselling data and that actual allotment depends on factors such as current cut-offs, seat availability and the choices made by other candidates.",
          "That's an important distinction. No honest counsellor can promise, “You will definitely get this college.” What they can do is help you build a more sensible list of possibilities.",
        ],
        bullets: [
          "Understanding eligibility and realistic college options",
          "Application timelines and counselling rounds",
          "Seat allotment, preference order and upgrades",
          "Documents, deadlines and possible backup choices",
        ],
      },
      {
        heading: "Career counselling services",
        paragraphs: [
          "Getting into an engineering college is not the end of the decision. Then comes another question: which branch?",
          "This is where students often hear the same advice from everyone. “Take CSE.” “CSE has the most scope.” “Don't take Mechanical.” There may be some truth behind individual opinions, but none of these statements should automatically decide your future.",
          "So the better question isn't “Which branch is the best?” Try asking: “Which branch makes the most sense for me?” If you enjoy coding and problem-solving, computer-related programs may naturally interest you. If you're fascinated by circuits and communication systems, ECE could be worth exploring. If machines, manufacturing and design genuinely interest you, Mechanical deserves a proper look.",
          "The idea is not to predict exactly what job you will have at 25. Nobody can honestly do that. Instead, career counselling for engineering students can help you understand what different branches involve, what skills they typically require and what career directions are possible.",
        ],
        bullets: [
          "Computer Science Engineering and Information Technology",
          "Electronics & Communication Engineering and Electrical Engineering",
          "Mechanical, Civil and Chemical Engineering",
          "Aerospace Engineering and Biotechnology",
          "Artificial Intelligence, Machine Learning and Data Science",
        ],
      },
      {
        heading: "College & university selection",
        paragraphs: [
          "A famous college is not automatically the right college for every student. College reputation matters, but it isn't the only thing that matters.",
          "Suppose you have two options. College A has a stronger name, but the branch you would get there is not something you are interested in. College B may be less famous, but it offers the branch you genuinely want, fits your budget and is in a location that works for your family. Which one should you choose? There isn't a universal answer.",
          "And don't look at placement numbers without context. Ask what the placement situation looks like for your branch, not just the college as a whole. A college can have an impressive placement figure and still not be the best fit for your particular goals.",
        ],
        bullets: [
          "Accreditation, recognition and course curriculum",
          "Faculty and infrastructure",
          "Placement information for your branch specifically",
          "Internship opportunities and industry exposure",
          "Fees, location and campus environment",
          "Alumni network and opportunities for higher studies",
        ],
      },
      {
        heading: "Course selection guidance",
        paragraphs: [
          "Let's talk about CSE for a minute. A lot of students choose it because everyone around them is choosing it. You ask a friend what branch they're taking. “CSE.” Another friend? “CSE.” A relative? “Beta, CSE le lo.” After hearing it enough times, it can start feeling like there is no other sensible choice.",
          "But pause for a second. Do you actually enjoy the things you'll be studying? Do you like programming? Do you enjoy mathematics and logical problem-solving? Or are you choosing CSE mainly because you are afraid that another branch won't have enough opportunities?",
          "The point isn't to convince you to choose a less popular branch. It's to make sure popularity isn't making the decision for you. A sensible approach to BTech course selection usually balances four things: interest, ability, career direction and opportunity. You don't need to have everything figured out — but you should at least understand what you're choosing and why.",
        ],
      },
      {
        heading: "A personalised counselling process",
        paragraphs: [
          "There isn't one fixed formula that works for every engineering aspirant. A student with a very specific branch preference needs different guidance from a student who says, “I just want a good college.”",
          "Finally, the decision belongs to you and your family. Good counselling doesn't remove your responsibility. It removes some of the unnecessary confusion around it.",
        ],
        bullets: [
          "Understand the student — Class 12 background, entrance exam, rank, subjects, interests and current worries",
          "Understand the goal — a particular branch, college, city, fee range or career direction",
          "Explore college and branch options using predictors, college information and previous cut-off trends",
          "Compare options — college versus branch, fees versus location, dream versus realistic choices",
          "Plan preferences — don't fill randomly, don't copy a friend's list",
          "Make an informed decision",
        ],
      },
      {
        heading: "Why choose ProCounsel",
        paragraphs: [
          "Choosing a counsellor for something as important as engineering admission is a serious decision. You should be able to ask questions without feeling that someone is simply trying to push you towards a particular college.",
          "ProCounsel's platform focuses on personalised admission guidance, college exploration and practical tools that students can use while planning their choices — JEE rank and college predictors, MHT-CET college prediction, MHT-CET option-form support, college profiles, admission deadlines, college shortlisting and ProBuddies who connect students with college seniors.",
          "ProCounsel has guided 10,000+ students, has 15+ years of experience, and is trusted by 50,000+ families, with 300+ ProBuddies and 850+ mentee connections. Those numbers are useful context, but they shouldn't be the reason you choose a counselling platform. The more important question is whether the guidance actually helps you understand your options.",
          "Engineering admission doesn't stop when you get a seat. You still have a degree to complete, skills to build, internships to find and career choices to make. The college decision is important, but it is still one part of a much longer journey.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is engineering counselling?",
        answer:
          "Engineering counselling is guidance that helps students understand their engineering college, branch and admission options based on factors such as rank, interests, preferences, budget and career goals.",
      },
      {
        question: "What does engineering admission counselling include?",
        answer:
          "It can include understanding your entrance rank, exploring realistic colleges, comparing branches, checking admission requirements and timelines, planning preferences, understanding counselling rounds and thinking through backup options.",
      },
      {
        question: "When should I take engineering counselling?",
        answer:
          "Ideally, before you start finalising your college and branch choices. Counselling can also be useful after receiving your rank, when you have actual options to compare.",
      },
      {
        question: "Can counselling help me choose the right BTech college?",
        answer:
          "Yes. Good counselling can help you compare colleges using factors such as branch, fees, location, curriculum, placements, internships and your own career plans. It cannot guarantee a particular college.",
      },
      {
        question: "How do I choose between college and branch?",
        answer:
          "Start by asking what matters more to you and why. If you're considering a better-known college with a branch you don't want, compare the actual course, career possibilities and your willingness to study that branch before deciding.",
      },
      {
        question: "Is CSE always the best engineering branch?",
        answer:
          "No. CSE can be an excellent choice for students interested in computing and related fields, but it isn't automatically the right branch for everyone. Your interests, strengths and career direction should also be considered.",
      },
      {
        question: "Can engineering career counselling help me choose a branch?",
        answer:
          "Yes. Engineering career counselling can help you understand what different branches involve, the skills they develop, possible career directions and higher-study options. The final choice should still reflect your own interests and goals.",
      },
      {
        question: "What is counselling for BTech colleges?",
        answer:
          "Counselling for BTech colleges means getting guidance while comparing and shortlisting engineering colleges and programs. It may include looking at your rank, branch preference, college options, admission process and choice-filling strategy.",
      },
      {
        question: "Can ProCounsel help with engineering college choice filling?",
        answer:
          "ProCounsel provides choice-filling support, including MHT-CET option-form assistance, along with college predictors and admission guidance.",
      },
      {
        question: "How can I get counselling for admission in engineering colleges?",
        answer:
          "You can explore the admission counselling and engineering-related tools available on the ProCounsel website and connect with its counsellors for guidance relevant to your admission situation.",
      },
    ],
  },

  {
    slug: "medical-counselling",
    name: "Medical Counselling",
    primaryIntent:
      "Find and talk to a medical admission counsellor about NEET rank, MBBS college choice and choice filling",
    expertise: ["Medical", "Dental", "Nursing", "Pharmacy", "Veterinary Sciences"],
    supportKeywords: [
      "mbbs admission counselling",
      "neet counselling",
      "mbbs counselling",
      "medical admission counselling",
      "counselor for mbbs admission",
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
    title: "Medical Counselling & MBBS Admission Guidance | ProCounsel",
    description:
      "Get expert medical counselling and admission guidance for MBBS and other medical courses. Get help with NEET counselling, college selection, choice filling and admission.",
    h1: "Medical Counselling & MBBS Admission Guidance",
    intro:
      "You've spent months preparing for NEET. Classes. Mock tests. Revision. More revision. And probably quite a few days when you wondered whether your preparation was actually enough. Then the exam is over, the result comes out, and you finally know your score and rank. You might think, “Okay, now at least I know what happens next.” But that's often when a different kind of confusion starts.",
    sections: [
      {
        heading: "Where the real confusion begins",
        paragraphs: [
          "Which MBBS colleges can you get? Should you consider government colleges, private colleges or both? Which counselling should you register for? How should you arrange your choices? What if you don't get your first preference? Should you wait for another round?",
          "And if the score isn't what you hoped for, there's another question: “What are my options now?”",
          "These are not small decisions. For students and parents, choosing a medical college involves years of study, a significant financial commitment and a lot of expectations. Getting a NEET score is an achievement. Knowing how to use that score wisely is the next challenge.",
          "ProCounsel provides education and admission guidance to help students understand their medical college options, explore NEET-related resources and approach important admission decisions with more clarity. The idea isn't to tell every student the same thing. It's to first understand where you stand, what you want and what choices are realistically available.",
        ],
      },
      {
        heading: "Education, Admission & Career Counselling",
        paragraphs: [
          "Choosing medicine isn't just about getting an MBBS seat. There are three questions sitting behind the decision: What should I study? Where should I study? What kind of career do I want to build?",
          "It is easy to focus only on the first one. A student spends years preparing for NEET because they want to become a doctor. Once the result comes out, the entire focus shifts to getting a seat. College name, fees, location, hospital exposure and the actual learning environment can sometimes become secondary.",
          "But those things matter too. Imagine getting an MBBS seat in a college that is financially difficult for your family. Or choosing a college simply because someone recommended it without checking the course, facilities or clinical exposure properly. The admission decision deserves a little more thought than that.",
          "That doesn't mean planning your entire life at 18. It simply means asking better questions before making a very big decision.",
        ],
      },
      {
        heading: "Education counselling services",
        paragraphs: [
          "Medical education can look like one straightforward path from the outside. NEET → MBBS → doctor. But students soon discover that there are many details in between: different types of institutions, different admission routes, different costs and different education pathways.",
          "That is why medical counselling should begin with the student's situation rather than a standard recommendation. Your NEET score and rank matter, of course. But so do your preferences. Maybe you are only interested in MBBS. Maybe you're open to other healthcare courses. Maybe you have a strict budget. Maybe studying in your home state is important to your family.",
          "The purpose isn't to convince a student to choose medicine. It's to help them understand what choosing medicine actually means. And if MBBS doesn't work out, counselling shouldn't stop there.",
        ],
        bullets: [
          "Medical education pathways, and what each one actually involves",
          "MBBS and other healthcare courses",
          "Eligibility requirements and NEET-related admission routes",
          "Different types of medical colleges",
          "College and course options for your rank and category",
          "Higher education possibilities and alternative healthcare pathways",
        ],
      },
      {
        heading: "Admission counselling services",
        paragraphs: [
          "This is usually the stage where parents start asking a lot of questions. “Which college can we get?” “Should we register for this counselling?” “How many choices should we fill?” “If we don't get the first choice, what happens?”",
          "Honestly, the NEET admission process can be confusing when you're looking at it for the first time. There are registrations, eligibility requirements, counselling rounds, choice filling, seat allotment, reporting and, depending on the counselling route, further rounds or opportunities to upgrade. The exact process and rules can vary, so students should always check the current official counselling instructions for the relevant authority before making a final decision.",
          "A predictor can help you explore possibilities. It shouldn't replace careful counselling or official admission rules. That distinction is important — medical admission counselling is not about promising a seat. It is about helping students understand their choices before they submit them.",
        ],
        bullets: [
          "What colleges are realistic for this rank",
          "Which options fit the student's preferences and budget",
          "Which choices should be considered carefully, and what to keep as a backup",
          "How preferences should be arranged",
          "What happens after seat allotment, and which documents and deadlines need attention",
          "Whether it is worth considering another counselling round",
        ],
      },
      {
        heading: "Career counselling services",
        paragraphs: [
          "There is another conversation that often gets forgotten during NEET counselling: “Do I actually want to become a doctor?”",
          "For some students the answer is an immediate yes. For others it is more complicated. Maybe you've always liked Biology but aren't sure what life as a doctor actually looks like. Maybe you like healthcare but aren't certain that MBBS is the only path. Maybe your family has always expected you to become a doctor, and you've never really stopped to think about what you want.",
          "MBBS counselling should not be limited to getting a seat. It can also include understanding what comes after the degree and whether the path fits the student's expectations. The aim isn't to predict your salary or guarantee a particular career. It is to help you understand the road before you start walking down it.",
        ],
        bullets: [
          "MBBS and clinical practice",
          "Postgraduate medical education and clinical specialisations",
          "Medical research and public health",
          "Healthcare management and academic roles",
          "Medical technology and other healthcare professions",
        ],
      },
      {
        heading: "College & university selection",
        paragraphs: [
          "Let's say you have a few MBBS college options. The natural reaction is to ask, “Which one is more famous?” But that's not always the most useful question. A better question is: “Which one makes sense for me and my family?”",
          "Clinical exposure deserves particular attention in medical education. A student isn't only choosing classrooms. They are also choosing the environment in which they will gradually learn how medicine works in real situations.",
          "Fees matter too. A college may look attractive on paper, but if the financial commitment creates significant pressure for the family, that needs to be part of the discussion. The same applies to location — some students are comfortable moving across the country, others may prefer staying closer to home. Neither choice is automatically better.",
        ],
        bullets: [
          "Recognition and accreditation",
          "Academic environment and faculty",
          "Hospital facilities, clinical exposure and patient exposure",
          "Infrastructure, hostel facilities and campus environment",
          "Fees and the total financial commitment",
          "Location, internship opportunities and options for further study",
        ],
      },
      {
        heading: "Course selection guidance",
        paragraphs: [
          "What happens if MBBS doesn't work out? This is a question many students are afraid to ask. But asking it doesn't mean you've given up. It means you're thinking ahead.",
          "Students interested in healthcare may explore different educational pathways depending on their eligibility, interests and admission options. These courses are not interchangeable — they have different eligibility requirements, course structures, responsibilities and career directions.",
          "So the decision shouldn't be “I didn't get MBBS, so I'll take anything related to healthcare.” Instead, ask: what kind of healthcare work actually interests me? And if MBBS is still your first choice, that's completely fine too. The point of counselling is not to push you towards an alternative. It is to make sure you know what those alternatives actually mean before deciding.",
        ],
        bullets: [
          "MBBS",
          "BDS",
          "AYUSH-related courses",
          "Nursing",
          "Physiotherapy",
          "Pharmacy",
          "Allied health sciences",
        ],
      },
      {
        heading: "A personalised counselling process",
        paragraphs: [
          "There is no single formula for every NEET student. Someone with a very high rank and a very specific college preference will need a different conversation from a student who is unsure about both college and course. Still, the process can begin quite simply.",
          "At the end, the decision belongs to the student and family. Counselling isn't about taking that responsibility away. It's about making sure the decision isn't being made in panic, under family pressure or because of something someone said in a WhatsApp group.",
        ],
        bullets: [
          "Understand the student — NEET score or rank, academic background, preferred course, location, budget and family considerations",
          "Understand the options — realistic MBBS colleges and other relevant medical education routes",
          "Shortlist colleges — narrow a huge list down to the ones genuinely worth considering",
          "Compare choices — fees, location, academic environment, clinical exposure, facilities and internships",
          "Plan counselling preferences — think about what you would genuinely be comfortable accepting",
          "Make an informed decision, without panic or guesswork",
        ],
      },
      {
        heading: "Why choose ProCounsel",
        paragraphs: [
          "Medical admission is too important to approach with random advice. Your friend may have a different rank. Your cousin may have gone through a different counselling process. A YouTube video may be talking about last year's cut-offs. And a college list found online may not take your category, quota, state or personal preferences into account.",
          "ProCounsel brings admission resources and counselling support together so students can spend less time jumping between different sources and more time understanding their actual options. The platform includes a NEET Rank Predictor, NEET College Predictor, NEET cut-off resources, NEET counselling information, MBBS college information and access to admission counsellors, along with ProBuddies who connect students with college seniors.",
          "ProCounsel has guided 10,000+ students, has 15+ years of experience, and is trusted by 50,000+ families. Those numbers may give you some context, but they shouldn't be the only reason you choose a counsellor. What matters more is whether you get guidance that is relevant to your situation.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is medical counselling?",
        answer:
          "Medical counselling is guidance that helps students understand medical education and admission options based on their NEET performance, preferences, eligibility, budget and future plans.",
      },
      {
        question: "What is MBBS admission counselling?",
        answer:
          "MBBS admission counselling helps students understand the admission journey after NEET, including college options, eligibility, counselling rounds, choice filling, seat allotment, reporting and possible backup choices.",
      },
      {
        question: "How does NEET counselling work?",
        answer:
          "NEET counselling generally involves registration, verification or eligibility checks, choice filling, seat allotment and reporting, depending on the applicable counselling authority and admission route. The exact rules and schedule can change, so students should always check the current official information.",
      },
      {
        question: "When should I take NEET counselling?",
        answer:
          "It can be useful as soon as you have your NEET result, or when you start preparing for the counselling process. Getting guidance before filling choices can help you understand your options more carefully.",
      },
      {
        question: "Can counselling help me choose an MBBS college?",
        answer:
          "Yes. Counselling can help you compare realistic colleges based on factors such as rank, eligibility, fees, location, clinical exposure, academic environment and personal preferences. It cannot guarantee a particular college.",
      },
      {
        question: "What is MBBS counselling?",
        answer:
          "MBBS counselling refers to the guidance and admission process involved in selecting and securing an MBBS seat through the relevant counselling route. It can involve understanding college options, preferences, choice filling, allotment and reporting.",
      },
      {
        question: "How can a counselor for MBBS admission help students?",
        answer:
          "A counselor for MBBS admission can help students understand their available options, compare colleges, think through preferences and make sense of the admission process. Good guidance should be based on the student's actual situation rather than a standard college list.",
      },
      {
        question: "Can counselling help with NEET choice filling?",
        answer:
          "Yes. Counselling can help students think through their preference order and understand the options they are considering before submitting their choices. Students should still follow the current official counselling rules and deadlines.",
      },
      {
        question: "How do I choose between government and private medical colleges?",
        answer:
          "Start with more than the college label. Compare fees, location, academic environment, hospital and clinical exposure, facilities, future plans and what your family can realistically manage. The right choice depends on your individual circumstances.",
      },
      {
        question: "Can ProCounsel help me with medical admission guidance?",
        answer:
          "ProCounsel offers NEET-related tools including a NEET Rank Predictor and NEET College Predictor, along with NEET counselling and MBBS college resources and access to admission counsellors.",
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
    slug: "career-counselling",
    name: "Career Counselling",
    primaryIntent:
      "Find and talk to a counsellor about course, college and career direction after Class 10 or 12",
    expertise: ["HSC", "B.Sc", "B.A.", "B.Com", "M.Sc", "M.A.", "M.Com", "B.Ed", "M.Ed", "Psychology", "Others"],
    supportKeywords: [
      "education counselling services",
      "admission counselling",
      "college admissions counselor",
      "career guidance service",
      "higher education counseling",
    ],
    exams: [
      { name: "CUET", full: "Common University Entrance Test" },
      { name: "Board exams", full: "Class 10 and Class 12 board examinations" },
    ],
    leadOffer: "Free course and career-fit discussion",
    tools: [
      { label: "Mettle Career Test", to: "/mettle" },
      { label: "All Predictors", to: "/predictors" },
    ],
    cities: ["delhi", "mumbai", "pune", "bangalore"],
    priority: "core",
    title: "Education, Admission & Career Counselling Services | ProCounsel",
    description:
      "Get expert education, admission and career counselling to choose the right course, college and career path. Get personalised guidance from ProCounsel counsellors.",
    h1: "Education, Admission & Career Counselling",
    intro:
      "You finish Class 12, open Google, and search: “Which course should I choose?” Within minutes, you have hundreds of answers. One person says engineering has the best scope. Someone else says medicine is the safest option. Your friend is preparing for management. A relative recommends a particular college. Your parents have their own suggestions. And somehow, after all that research, you are even more confused.",
    sections: [
      {
        heading: "The problem isn't information — it's relevance",
        paragraphs: [
          "Students today usually don't lack information. There is plenty of it. The difficult part is figuring out which information actually makes sense for you.",
          "That is where personalised guidance can make a difference. ProCounsel brings together education, admission and career guidance to help students and parents make more informed decisions about courses, colleges, admissions and future plans.",
          "The idea is simple: before making a big education decision, take some time to understand your options properly.",
        ],
      },
      {
        heading: "Education counselling services",
        paragraphs: [
          "Education counselling services are not simply about giving a student a list of courses or colleges. Good education counselling starts with the student.",
          "What have you studied so far? Which subjects do you actually enjoy? What are your marks and entrance-exam plans? What kind of career are you considering? What is your budget? Do you want to study close to home or are you open to another city?",
          "These questions matter because two students with similar marks may need completely different advice. For example, a student interested in computers could consider engineering, computer applications, data-related programs or other technology-focused courses. Another student with the same academic background may be more interested in business, design or research.",
          "Sometimes, what a student needs is not another 50-college list. They need someone to ask the right questions first.",
        ],
        bullets: [
          "Understanding your academic background and interests",
          "Exploring suitable education pathways and comparing courses",
          "Identifying realistic college options",
          "Understanding what different courses can lead to",
          "Looking at alternatives instead of relying on one option",
          "Discussing concerns students and parents may not know how to evaluate alone",
        ],
      },
      {
        heading: "Admission",
        paragraphs: [
          "College admission can look straightforward from the outside. Then the forms open. Suddenly there are entrance exams, eligibility requirements, registration dates, cut-offs, counselling rounds, choice filling, document verification and seat allotment. Different colleges and states can follow different processes, which makes things harder to keep track of.",
          "A student may know which college they like but still be unsure about how realistic the option is. Another may have a good rank but not know how to arrange their choices. And sometimes the biggest mistake is simply missing an important deadline.",
          "Admission guidance can help students understand the bigger picture instead of treating every form, deadline or counselling round as a separate task. The goal isn't to make the decision for you. It is to help you understand your choices before you submit them.",
        ],
      },
      {
        heading: "Counselling services",
        paragraphs: [
          "Not every student needs the same kind of counselling. One student may need help deciding between two courses. Another may already know the course but have no idea which colleges to shortlist. Someone else may need help understanding admission rounds after receiving an entrance-exam result.",
          "The right recommendation can depend on several things — marks, interests, goals, budget, location, preferred course, entrance-exam performance and even what kind of work you see yourself doing later. There isn't one answer that works for everyone.",
          "A good counselling conversation gives you space to ask questions, challenge assumptions and understand why a particular option may or may not suit you.",
        ],
        bullets: [
          "Academic planning and course selection",
          "Career guidance and college selection",
          "Admission guidance and application planning",
          "Entrance-exam-related decisions",
          "Higher education planning and future study options",
        ],
      },
      {
        heading: "Career counselling services",
        paragraphs: [
          "Career decisions often become serious around Class 10 and Class 12. And this is also when students hear the most opinions. “Engineering kar lo, scope hai.” “Medical is better.” “B.Com ke baad CA kar lena.” “Law has a lot of opportunities.”",
          "The problem isn't that these suggestions are necessarily wrong. The problem is that they may not be right for you. Maybe you have good marks but don't know what you enjoy. Maybe you are interested in several fields. Maybe your parents and your own preferences don't match.",
          "Career counselling helps students step back and look at the bigger picture — their strengths, interests, possible career directions, suitable courses and the skills those paths may require. A useful career guidance service should not simply say, “Choose this career.” It should help you understand why a particular direction could fit, what the path looks like and what alternatives you have.",
          "Career counselling services are particularly useful when a student feels stuck between several possibilities. You don't need to have your entire future figured out before asking for guidance.",
        ],
      },
      {
        heading: "College & university selection",
        paragraphs: [
          "Choosing a college is about more than asking, “Which college has the highest ranking?” Rankings can be useful. But they are only one part of the decision.",
          "The “best college” on the internet may not be the best college for your particular situation. That can be especially useful to remember when you have a long list of colleges and need to narrow it down to choices that actually make sense.",
        ],
        bullets: [
          "Does the college offer the course or specialisation you want?",
          "What does the curriculum look like, and how are the faculty and learning environment?",
          "What are the fees and other costs, and is the location practical for you?",
          "What internship and industry exposure opportunities are available?",
          "What placement information is available?",
          "Is the institution appropriately recognised or accredited for the course?",
          "Does the college fit your longer-term plans?",
        ],
      },
      {
        heading: "Course selection guidance",
        paragraphs: [
          "Choosing a course because everyone else is choosing it can feel safe — until you realise a few months later that you don't enjoy the subject.",
          "These questions can prevent a very common mistake: choosing a course based only on popularity, marks, family pressure or what friends are doing. It doesn't mean there is one “perfect” course waiting to be discovered. Sometimes the better outcome is simply understanding your options well enough to choose one consciously.",
        ],
        bullets: [
          "Do I actually enjoy learning about this subject?",
          "What kind of careers can this course lead to?",
          "What skills will I develop, and what can I study afterwards?",
          "What does the day-to-day work in related careers look like?",
          "Does the course fit my strengths, and what alternatives do I have?",
        ],
      },
      {
        heading: "A personalised counselling process",
        paragraphs: [
          "Counselling should feel like a conversation, not like filling out a form and receiving a random recommendation. Every student's journey can be slightly different, but a useful process generally looks something like this.",
          "The final decision should still belong to the student and family. The purpose of counselling is to make that decision more informed and less driven by pressure or guesswork.",
        ],
        bullets: [
          "Understand the student — academic background, interests, goals and current concerns",
          "Identify suitable options — courses, colleges and career paths that could fit",
          "Compare choices — course content, college, fees, location, admission requirements and career direction",
          "Get expert guidance — ask the questions that are hard to answer through online searches",
          "Create an action plan — what to research, which deadlines to track, which colleges to shortlist",
          "Move forward with confidence",
        ],
      },
      {
        heading: "Why choose ProCounsel",
        paragraphs: [
          "There are plenty of websites where you can search for colleges. So why consider a counselling platform? One reason is that education decisions rarely happen in isolation. You may need to understand a course, compare colleges, check your admission possibilities, follow deadlines and decide how to arrange your choices — all around the same time.",
          "ProCounsel brings several of these pieces together: personalised admission guidance, experienced admission counsellors, college and course exploration, JEE and NEET rank and college predictors, MHT-CET college prediction and option-form support, admission deadlines, college profiles for shortlisting, and ProBuddies connecting students with college seniors.",
          "ProCounsel has guided 10,000+ students, has 15+ years of experience, and is trusted by 50,000+ families. The platform also supports later stages such as internships, placements and further studies — because getting into college is not the only decision students will make.",
          "The point of guidance is not to tell every student to follow the same path. It is to help each student understand their own options more clearly.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is education counselling?",
        answer:
          "Education counselling is guidance that helps students understand and compare education options based on their academic background, interests, goals and practical circumstances. It can include course selection, college selection, admission planning and higher education decisions.",
      },
      {
        question: "When should a student take career counselling?",
        answer:
          "There is no single “right” time. Students may benefit from career counselling after Class 10, after Class 12, during college or when they are considering a change in direction. It can be especially useful when there are several options but no clear preference.",
      },
      {
        question: "What does an admission counsellor do?",
        answer:
          "An admission counsellor helps students understand the admission process, including relevant colleges, courses, eligibility, applications, deadlines, entrance exams and counselling or choice-filling stages.",
      },
      {
        question: "How can a college admissions counselor help me?",
        answer:
          "A college admissions counselor can help you understand and compare college options, identify questions you should ask before applying and make sense of different parts of the admission process. The exact guidance depends on your course, exam, college and admission route.",
      },
      {
        question: "How does career counselling help students after Class 12?",
        answer:
          "It gives students a structured way to think about their interests, strengths, possible careers and education pathways. Instead of choosing a course only because it is popular, students can compare options based on what actually fits them.",
      },
      {
        question: "Can counselling help me choose the right course?",
        answer:
          "Yes, counselling can help you compare courses by looking at your interests, academic background, career goals, skills and future study options. It cannot predict your future, but it can help you make a more informed choice.",
      },
      {
        question: "Can ProCounsel help me shortlist colleges?",
        answer:
          "ProCounsel provides college profiles, college predictors and admission guidance to help students explore and shortlist options. The website also includes tools for JEE, NEET and MHT-CET-related college and rank planning.",
      },
      {
        question: "What is higher education counseling?",
        answer:
          "Higher education counseling refers to guidance around education choices after school or during later stages of study. It can involve selecting undergraduate or postgraduate courses, comparing institutions, planning admissions and understanding future study pathways.",
      },
      {
        question: "Is career counselling only for students who are confused?",
        answer:
          "No. Even students who have a fairly clear goal can use counselling to test their assumptions, understand alternatives and create a more practical education plan.",
      },
      {
        question: "How can I get expert counselling from ProCounsel?",
        answer:
          "You can explore the counselling and admission resources available through the ProCounsel website and choose the type of guidance relevant to your situation.",
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
