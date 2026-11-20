/**
 * Directory colleges (/college-details/:id) that also have a verified MBA
 * profile (/mba-colleges/:slug). Both pages answered the same search
 * ("<college> admission, cut-off, fees"), so Google saw two ProCounsel pages
 * competing for one query. The MBA profile has the official cut-offs, fees and
 * placements, so it is the canonical page; the directory page stays live
 * (and prerendered) but points its canonical there and is left out of the
 * sitemap.
 *
 * Plain JS so scripts/site-routes.mjs (Node) can import it as well.
 * Only add an entry when every course on the directory page is an MBA/PGDM
 * course — otherwise the directory page covers more than the profile does.
 */
export const MBA_PROFILE_FOR_COLLEGE = Object.freeze({
  SJIMR_MUMBAI: "spjimr-mumbai",
  JBIMS_MUMBAI: "jbims-mumbai",
  SIBM_PUNE: "sibm-pune",
  SJMSM_MUMBAI: "sjmsom-iit-bombay",
  NMIMS_MUMBAI: "nmims-mumbai",
  SCFMHRD_PUNE: "scmhrd-pune",
  IIMN_MUMBAI: "iim-nagpur",
  KSIMSR_MUMBAI: "kjsim-mumbai",
  TISS_MUMBAI: "tiss-mumbai",
  WIMDR_MUMBAI: "welingkar-mumbai",
});

/** "/mba-colleges/<slug>" for a directory college with an MBA profile, else null. */
export function mbaProfilePathFor(collegeId) {
  const slug = collegeId ? MBA_PROFILE_FOR_COLLEGE[collegeId] : undefined;
  return slug ? `/mba-colleges/${slug}` : null;
}
