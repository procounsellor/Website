/**
 * The admission cycle students are searching for right now.
 *
 * Indian entrance exams (JEE Main, NEET, CAT results) run Dec–Jun, so from
 * July onwards students are already planning for next year's cycle. Page
 * titles use this instead of a hard-coded year so they never go stale.
 * Prerendered pages pick up the value at build time.
 */
export function admissionYear(now: Date = new Date()): number {
  return now.getMonth() >= 6 ? now.getFullYear() + 1 : now.getFullYear();
}

export const ADMISSION_YEAR = admissionYear();
