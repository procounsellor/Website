import type { CousrseApiLogin } from '@/types';

/**
 * Which of the backend's own courses start the school-student journey.
 *
 * `/api/courseAndState/all-courses` already ships an SSC entry
 * (`courseId: "ssc_ththth"`, "SSC (8th/9th/10th)"), so the onboarding grid needs
 * no synthetic tile — picking the real course IS the fork. Matching on
 * `courseId` rather than on the display name means the backend can retitle the
 * course without silently breaking the branch.
 *
 * Adding another school course later — HSC, say — is one entry in this set.
 *
 * Lives in its own module rather than beside the card that uses it: a file that
 * exports both a component and a helper breaks React fast refresh.
 */
const SCHOOL_COURSE_IDS = new Set(['ssc_ththth']);

/**
 * True when picking this course should open the school-student signup instead
 * of the states step. Falls back to the name only when the id is missing, so a
 * malformed row still lands a school student in the right place.
 */
export const isSchoolCourse = (course: Pick<CousrseApiLogin, 'courseId' | 'name'>): boolean => {
  const id = course.courseId?.trim().toLowerCase();
  if (id) return SCHOOL_COURSE_IDS.has(id);
  return /^ssc\b/i.test(course.name?.trim() ?? '');
};
