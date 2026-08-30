import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageSEO from '@/components/SEO/PageSEO';
import ErrorState from '@/components/common/ErrorState';
import { Icon } from '@/components/school-student/assets';
import VerifiedBadge from '@/components/school-student/VerifiedBadge';
import { probuddiesApi } from '@/api/pro-buddies';

/**
 * One ProBuddy, read-only.
 *
 * Everything here comes from the two PUBLIC endpoints —
 * `/api/shared/getProBuddyByIdForUser` and
 * `/api/shared/getAllReviewsReceivedByAProBuddyForUser`. No user-scoped route is
 * touched, because a school student has no `users` row for one to be scoped to.
 *
 * And nothing on this page transacts. A school student browses: no call button,
 * no booking, no rate, no wallet. That is not a missing feature to fill in
 * later — showing a 14-year-old a "Call now — ₹X/min" control is the thing this
 * page is deliberately not doing.
 *
 * The public profile also returns `phoneNumber`, `email`, `walletAmount`,
 * `fcmToken` and `voipToken`. None of them are rendered. They should not be in
 * an unauthenticated response at all — see the note filed with the API gaps.
 */

const SAFE_LINK = /^https?:\/\//i;

export default function SchoolProBuddyProfile() {
  const { proBuddyId = '' } = useParams();

  const profile = useQuery({
    queryKey: ['school-probuddy', proBuddyId],
    queryFn: () => probuddiesApi.profileGuest(proBuddyId),
    enabled: Boolean(proBuddyId),
    staleTime: 5 * 60 * 1000,
  });

  const reviews = useQuery({
    queryKey: ['school-probuddy-reviews', proBuddyId],
    queryFn: () => probuddiesApi.reviewsForUser(proBuddyId),
    enabled: Boolean(proBuddyId),
    staleTime: 5 * 60 * 1000,
  });

  const buddy = profile.data;
  const name = [buddy?.firstName, buddy?.lastName].filter(Boolean).join(' ') || 'ProBuddy';
  const place = [buddy?.city, buddy?.state].filter(Boolean).join(', ');
  const rating = Number(buddy?.rating ?? 0);
  const reviewList = Array.isArray(reviews.data) ? reviews.data : [];

  if (profile.isError) {
    return (
      <div className="mx-auto max-w-[860px]">
        <ErrorState
          variant="inline"
          title="Couldn't load this ProBuddy"
          message="We couldn't reach their profile right now. Please try again in a moment."
          onRetry={() => profile.refetch()}
          showBack={false}
        />
      </div>
    );
  }

  return (
    <>
      <PageSEO title={name} description="A student already in college." noIndex />

      <div className="mx-auto w-full max-w-[860px] pb-16">
        {/* A real control, not a caption. As small mono caps in neutral grey
            this was almost invisible against the page — and it is the only way
            back, so it has to look like something you can press. */}
        <Link
          to="/school-student/probuddies"
          className="mb-4 inline-flex h-11 items-center gap-2 rounded-full border border-[var(--card-border)] bg-white pr-4 pl-3 font-[Poppins] text-[13.5px] font-semibold text-[var(--ink)] shadow-[var(--card-shadow)] transition-colors hover:border-[var(--brand-purple-300)] hover:text-[var(--brand-purple-700)]"
        >
          <span
            aria-hidden
            className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F1F3F8] text-[13px]"
          >
            ←
          </span>
          All ProBuddies
        </Link>

        {profile.isLoading || !buddy ? (
          <div className="ss-panel h-[260px] animate-pulse bg-[#F7F8FC]" aria-busy />
        ) : (
          <>
            <section className="ss-panel overflow-hidden">
              <div
                className="h-[86px] w-full"
                style={{ background: 'linear-gradient(120deg,#241858 0%,#5A38E8 60%,#8B6CF8 100%)' }}
              />
              <div className="-mt-10 px-5 pb-5 sm:px-6">
                <span className="relative inline-block">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={
                      buddy.photoUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=EDE9FE&color=4C2FD3&size=200`
                    }
                    alt=""
                    className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md"
                  />
                  {buddy.verified && (
                    <VerifiedBadge size={24} className="absolute right-0 bottom-1 shadow" />
                  )}
                </span>

                <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="ss-display text-[22px] leading-tight text-[var(--ink)] sm:text-[26px]">
                      {name}
                    </h1>
                    <p className="mt-1 font-[Poppins] text-[13px] text-[var(--neutral-500)]">
                      {buddy.collegeName || 'College'}
                    </p>
                  </div>

                  {rating > 0 && (
                    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#FFF3D9] px-3 py-1.5">
                      <Icon name="starPoints" className="h-4 w-4" />
                      <span className="ss-data text-[13px] text-[#B45309]">{rating.toFixed(1)}</span>
                      <span className="ss-eyebrow text-[#B45309]">
                        ({buddy.noOfRatingsReceived ?? 0})
                      </span>
                    </span>
                  )}
                </div>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {[
                    buddy.course,
                    buddy.currentYear && `Year ${buddy.currentYear}`,
                    place,
                    ...(Array.isArray(buddy.languagesKnow) ? buddy.languagesKnow : []),
                  ]
                    .filter(Boolean)
                    .map((tag) => (
                      <li
                        key={String(tag)}
                        className="rounded-full bg-[#F3F0FF] px-3 py-1.5 font-[Poppins] text-[11.5px] font-medium text-[#4C2FD3]"
                      >
                        {String(tag)}
                      </li>
                    ))}
                </ul>
              </div>
            </section>

            {/* `aboutMe` is an object — { heading, subHeading, aboutMe } — not a
                string. Rendering it directly throws; each part gets its own slot. */}
            {(buddy.aboutMe?.heading || buddy.aboutMe?.aboutMe) && (
              <section className="ss-panel mt-5 p-5 sm:p-6">
                <h2 className="ss-display text-[17px] text-[var(--ink)]">
                  {buddy.aboutMe.heading || 'About'}
                </h2>
                {buddy.aboutMe.subHeading && (
                  <p className="mt-1 font-[Poppins] text-[12.5px] text-[var(--neutral-400)]">
                    {buddy.aboutMe.subHeading}
                  </p>
                )}
                {buddy.aboutMe.aboutMe && (
                  <p className="mt-2 font-[Poppins] text-[13.5px] leading-relaxed whitespace-pre-line text-[var(--neutral-600)]">
                    {buddy.aboutMe.aboutMe}
                  </p>
                )}
              </section>
            )}

            {buddy.whoShouldConnect && (
              <section className="ss-panel mt-5 p-5 sm:p-6">
                <h2 className="ss-display text-[17px] text-[var(--ink)]">Who they can help</h2>
                <p className="mt-2 font-[Poppins] text-[13.5px] leading-relaxed whitespace-pre-line text-[var(--neutral-600)]">
                  {buddy.whoShouldConnect}
                </p>
              </section>
            )}

            {/* `offerings` is a map of topic → weight, e.g. { "Mess Food": 2 }.
                The weights are the buddy's own ranking, so the strongest topics
                lead; the numbers themselves mean nothing to a student. */}
            {buddy.offerings && Object.keys(buddy.offerings).length > 0 && (
              <section className="ss-panel mt-5 p-5 sm:p-6">
                <h2 className="ss-display text-[17px] text-[var(--ink)]">What they talk about</h2>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {Object.entries(buddy.offerings)
                    .sort((a, b) => Number(b[1]) - Number(a[1]))
                    .map(([topic]) => (
                      <li
                        key={topic}
                        className="flex items-start gap-2.5 rounded-[12px] border border-[var(--card-border)] px-3.5 py-3 font-[Poppins] text-[13px] text-[var(--neutral-600)]"
                      >
                        <Icon name="completedCheck" muted className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {topic}
                      </li>
                    ))}
                </ul>
              </section>
            )}

            {Array.isArray(buddy.links) && buddy.links.length > 0 && (
              <section className="ss-panel mt-5 p-5 sm:p-6">
                <h2 className="ss-display text-[17px] text-[var(--ink)]">Links</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {buddy.links
                    // Links come through as either a bare URL or { url, title }.
                    .map((entry) => (typeof entry === 'string' ? entry : entry?.url))
                    .filter((href): href is string => Boolean(href) && SAFE_LINK.test(String(href)))
                    .map((href) => (
                      <li key={String(href)}>
                        <a
                          href={String(href)}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="inline-flex rounded-full border border-[var(--card-border)] px-3.5 py-2 font-[Poppins] text-[12.5px] font-medium text-[var(--brand-purple-700)]"
                        >
                          {new URL(String(href)).hostname.replace(/^www\./, '')}
                        </a>
                      </li>
                    ))}
                </ul>
              </section>
            )}

            <section className="ss-panel mt-5 p-5 sm:p-6">
              <h2 className="ss-display text-[17px] text-[var(--ink)]">
                Reviews{reviewList.length ? ` (${reviewList.length})` : ''}
              </h2>
              {reviews.isLoading ? (
                <div className="mt-3 h-16 animate-pulse rounded-[12px] bg-[#F3F5F9]" />
              ) : reviewList.length === 0 ? (
                <p className="mt-2 font-[Poppins] text-[13px] text-[var(--neutral-500)]">
                  No reviews yet.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {reviewList.map((review, i) => (
                    <li
                      key={review.reviewId ?? i}
                      className="rounded-[12px] border border-[var(--card-border)] p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-[Poppins] text-[13px] font-semibold text-[var(--ink)]">
                          {review.userFullName || 'A student'}
                        </span>
                        {typeof review.rating === 'number' && (
                          <span className="ss-data text-[12px] text-[#B45309]">
                            {review.rating.toFixed(1)} ★
                          </span>
                        )}
                      </div>
                      {review.reviewText && (
                        <p className="mt-1.5 font-[Poppins] text-[13px] leading-relaxed text-[var(--neutral-600)]">
                          {review.reviewText}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/*
             * The same two actions the site's own ProBuddy page offers, shown
             * but locked.
             *
             * Locked rather than hidden on purpose: a student should be able to
             * see that talking to this person is a real thing that exists and
             * what it costs, which is most of the motivation. Hiding it would
             * make the page look like a dead end. Unlocking is out of scope for
             * now — nothing here can transact, and the buttons are inert rather
             * than merely styled to look disabled.
             */}
            <section className="ss-panel mt-5 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--card-border)] px-5 py-4">
                <div>
                  <p className="ss-eyebrow text-[var(--neutral-400)]">Talk to {buddy.firstName}</p>
                  <p className="ss-data mt-1 text-[20px] text-[var(--ink)]">
                    ₹{Number(buddy.ratePerMinute ?? 0).toFixed(0)}
                    <span className="ml-1 text-[12px] text-[var(--neutral-400)]">/ min</span>
                  </p>
                </div>
                <span className="ss-eyebrow flex items-center gap-1.5 rounded-full bg-[var(--slate-surface)] px-3 py-1.5 text-[var(--slate-ink)]">
                  <Icon name="lock" className="h-3 w-3 opacity-70" />
                  Locked
                </span>
              </div>

              <div className="relative p-5">
                <div className="pointer-events-none flex flex-col gap-2.5 opacity-45 select-none sm:flex-row">
                  <span className="ss-go h-12 flex-1 justify-center py-3 text-[14px]">
                    Get Instant Callback
                  </span>
                  <span className="flex h-12 flex-1 items-center justify-center rounded-[12px] border-2 border-[var(--card-border)] font-[Poppins] text-[14px] font-bold text-[var(--neutral-600)]">
                    Request a Call
                  </span>
                </div>

                <p className="mt-4 flex items-start gap-2.5 rounded-[12px] bg-[#F7F8FC] px-4 py-3 font-[Poppins] text-[12.5px] leading-relaxed text-[var(--neutral-600)]">
                  <Icon name="lock" className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-60" />
                  Calls are locked on a school account for now. You can read
                  everything about {buddy.firstName} here — booking opens later.
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
