export const publisherOptions = [
  "Aswini Verma",
  "Ashutosh Kumar",
  "Kiran",
  "Ananya",
] as const;

export type PublisherName = (typeof publisherOptions)[number];

export type BlogAuthorProfile = {
  id: string;
  slug: string;
  name: string;
  firstName: string;
  role: string;
  description: string;
  categories: string[];
  imageUrl: string;
};

const DEFAULT_AUTHOR_IMAGE = "/round-profile.svg";

const createProfile = (
  id: PublisherName,
  name: string,
  role: string,
  description: string,
  categories: string[],
  imageUrl?: string
): BlogAuthorProfile => {
  const firstName = name.split(" ")[0]?.trim() || name;
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  return {
    id,
    slug,
    name,
    firstName,
    role,
    description,
    categories,
    imageUrl: imageUrl ?? DEFAULT_AUTHOR_IMAGE,
  };
};

const PREMADE_AUTHOR_PROFILES: BlogAuthorProfile[] = [
  createProfile(
    "Aswini Verma",
    "Aswini Verma",
    "Admissions Strategy Specialist",
    "Writes student-first guides for admissions planning, application strategy, and interview preparation.",
    ["Admissions", "Scholarships"],
    "/round-profile.svg"
  ),
  createProfile(
    "Ashutosh Kumar",
    "Ashutosh Kumar",
    "Study Abroad Specialist",
    "Specializes in study abroad guidance, university shortlisting, and application strategy for global admissions.",
    ["Study Abroad", "Admissions"]
  ),
  createProfile(
    "Kiran",
    "Kiran Kudke",
    "Career Counseling Specialist",
    "Provides practical career counseling support with clear decision frameworks for students and parents.",
    ["Career Counseling", "Admissions"]
  ),
  createProfile(
    "Ananya",
    "Ananya",
    "Exam Planning Specialist",
    "Creates clear explainers on timelines, application documents, and student decision-making.",
    ["Admissions", "Exams"]
  ),
];

export function getAuthorProfileByName(name: string | undefined | null): BlogAuthorProfile {
  const normalized = (name || "").trim().toLowerCase();
  const found = PREMADE_AUTHOR_PROFILES.find(
    (profile) =>
      profile.name.toLowerCase() === normalized ||
      profile.id.toLowerCase() === normalized
  );

  if (found) return found;

  const fallbackName = (name || "Author").trim() || "Author";
  const fallbackSlug = fallbackName.toLowerCase().replace(/\s+/g, "-");
  const fallbackFirstName = fallbackName.split(" ")[0] || "Author";

  return {
    id: fallbackName,
    slug: fallbackSlug,
    name: fallbackName,
    firstName: fallbackFirstName,
    role: "Guest Author",
    description: "Contributor to ProCounsel blog content.",
    categories: ["Others"],
    imageUrl: DEFAULT_AUTHOR_IMAGE,
  };
}

export function getAuthorProfileByIdOrSlug(authorKey: string | undefined | null): BlogAuthorProfile | null {
  if (!authorKey) return null;
  const normalized = authorKey.trim().toLowerCase();

  const found = PREMADE_AUTHOR_PROFILES.find(
    (profile) =>
      profile.id.toLowerCase() === normalized ||
      profile.slug.toLowerCase() === normalized
  );

  return found ?? null;
}

export function getAllPremadeAuthorProfiles(): BlogAuthorProfile[] {
  return PREMADE_AUTHOR_PROFILES;
}

export function doesBlogAuthorMatchProfile(
  blogAuthorName: string | undefined | null,
  profile: BlogAuthorProfile
): boolean {
  const normalized = (blogAuthorName || "").trim().toLowerCase();
  if (!normalized) return false;

  return (
    normalized === profile.name.toLowerCase() ||
    normalized === profile.id.toLowerCase() ||
    normalized === profile.slug.toLowerCase()
  );
}

export function getAuthorImageWithFallback(imageUrl: string | undefined | null): string {
  const value = (imageUrl || "").trim();
  return value || DEFAULT_AUTHOR_IMAGE;
}
