import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import PageSEO from '@/components/SEO/PageSEO';
import ErrorState from '@/components/common/ErrorState';
import SkyBanner from '@/components/school-student/SkyBanner';
import VerifiedBadge from '@/components/school-student/VerifiedBadge';
import { probuddiesApi } from '@/api/pro-buddies';
import type { ListingProBudddy } from '@/types/probuddies';

/**
 * ProBuddies, inside the school shell.
 *
 * The site's own /pro-buddies page cannot be reused: it lives under
 * RevampLayout, which carries the site header, breadcrumbs and footer a school
 * student never sees — and which redirects this role away anyway.
 *
 * Two decisions worth stating:
 *
 *  1. **Unverified accounts are not listed here.** The API returns them —
 *     4 of 29 today, including two obvious test accounts — and neither this
 *     page nor the site's own listing filtered them out. On a surface shown to
 *     13-to-16 year olds that is not a cosmetic problem, so this page shows
 *     verified profiles only.
 *  2. **Browse-only, on the public endpoint.** See the query below.
 */

/**
 * A calm colour per card, derived from the college name.
 *
 * Every card previously wore the same purple pills, which made a grid of them
 * read as one undifferentiated block of chips. Tinting the header by college
 * gives the eye something to sort by, and keeps the accent to one place instead
 * of scattering it through the text.
 */
const COVERS = [
  ['#EEF2FF', '#C7D2FE', '#4338CA'],
  ['#ECFDF5', '#A7F3D0', '#047857'],
  ['#FEF3F2', '#FECDD3', '#BE123C'],
  ['#FFFBEB', '#FDE68A', '#B45309'],
  ['#F0F9FF', '#BAE6FD', '#0369A1'],
  ['#FAF5FF', '#E9D5FF', '#7E22CE'],
] as const;

const coverFor = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 9973;
  return COVERS[hash % COVERS.length];
};

function Stars({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          aria-hidden
          className="text-[11px] leading-none"
          style={{ color: n <= Math.round(value) ? '#F59E0B' : '#E2E5EE' }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function BuddyCard({ buddy }: { buddy: ListingProBudddy }) {
  const name = [buddy.firstName, buddy.lastName].filter(Boolean).join(' ') || 'ProBuddy';
  const place = [buddy.city, buddy.state].filter(Boolean).join(', ');
  const rating = Number(buddy.rating ?? 0);
  const [soft, mid, ink] = coverFor(buddy.collegeName || name);

  return (
    <Link
      to={`/school-student/probuddies/${buddy.proBuddyId}`}
      className="ss-panel ss-lift group flex h-full flex-col overflow-hidden"
    >
      {/* The college leads, because that is what a student is actually looking
          for — not the buddy's name, which means nothing to them yet. */}
      {/* Fixed height so a one-line college and a three-line one produce the
          same card. Ragged headers made the grid look broken. */}
      <div
        className="flex min-h-[80px] items-start px-4 pt-4 pb-9"
        style={{ background: `linear-gradient(135deg, ${soft} 0%, ${mid} 160%)` }}
      >
        <p
          className="line-clamp-2 font-[Poppins] text-[12.5px] leading-snug font-semibold"
          style={{ color: ink }}
        >
          {buddy.collegeName || 'College'}
        </p>
      </div>

      <div className="-mt-7 flex flex-1 flex-col px-4 pb-4">
        <div className="flex items-end justify-between gap-3">
          <span className="relative shrink-0">
            <img
              loading="lazy"
              decoding="async"
              src={
                buddy.photoUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=EDE9FE&color=4C2FD3&size=200`
              }
              alt=""
              className="h-14 w-14 rounded-full border-[3px] border-white object-cover shadow-sm"
            />
            {buddy.verified && (
              <VerifiedBadge size={19} className="absolute -right-0.5 bottom-0.5 shadow-sm" />
            )}
          </span>
          {rating > 0 ? (
            <span className="mb-1 flex flex-col items-end">
              <Stars value={rating} />
              <span className="ss-eyebrow mt-0.5 text-[var(--neutral-400)]">
                {rating.toFixed(1)} · {buddy.noOfRatingsReceived ?? 0}
              </span>
            </span>
          ) : (
            <span className="ss-eyebrow mb-1.5 rounded-full bg-[#F1F3F8] px-2 py-1 text-[var(--neutral-400)]">
              New
            </span>
          )}
        </div>

        <p className="mt-2.5 truncate font-[Poppins] text-[15px] leading-tight font-bold text-[var(--ink)]">
          {name}
        </p>

        {/* Quiet type instead of a row of coloured pills. The information is the
            same; it just stops competing with itself. */}
        <p className="mt-1.5 line-clamp-1 font-[Poppins] text-[12.5px] text-[var(--neutral-600)]">
          {buddy.course || 'Student'}
          {buddy.currentYear ? ` · Year ${buddy.currentYear}` : ''}
        </p>
        {place && (
          <p className="mt-0.5 truncate font-[Poppins] text-[12px] text-[var(--neutral-400)]">
            {place}
          </p>
        )}

        <span className="ss-eyebrow mt-auto flex items-center gap-1.5 pt-3.5 text-[var(--brand-purple-700)]">
          View profile
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export default function SchoolProBuddies() {
  const [search, setSearch] = useState('');

  /*
   * The PUBLIC listing, deliberately.
   *
   * `probuddiesApi.listing(userId)` upgrades itself to
   * /api/user/getAllProBuddies whenever a token is present, and that route is
   * scoped to a `users` row — which school-student signup deletes. So this role
   * asks for the shared route explicitly. It is browse-only anyway: nothing
   * here books, calls or pays, so nothing needs a user-scoped response.
   */
  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['school-probuddies-public'],
    queryFn: () => probuddiesApi.listingPublic(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const verified = useMemo(() => data.filter((b) => b.verified !== false), [data]);

  const buddies = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return verified;
    return verified.filter((b) =>
      [b.firstName, b.lastName, b.collegeName, b.course, b.city, b.state]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [verified, search]);

  return (
    <>
      <PageSEO title="ProBuddies" description="Talk to students already in college." noIndex />

      <div className="mx-auto max-w-[1240px] space-y-6">
        <SkyBanner
          eyebrow="Ask someone who is already there"
          title="ProBuddies"
          lead="Students at the colleges you're curious about — what the course is really like, the hostel, the food, how they got in."
          aside={
            !isLoading && (
              <div
                className="rounded-2xl border border-white/25 px-4 py-3 backdrop-blur-md"
                style={{ background: 'rgba(16, 9, 44, 0.72)' }}
              >
                <p className="ss-eyebrow text-white/55">Verified</p>
                <p className="ss-data mt-1 text-[24px] leading-none text-white">
                  {verified.length}
                </p>
              </div>
            )
          }
        />

        <div className="relative">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[var(--neutral-400)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by college, course or city"
            className="h-12 w-full rounded-[14px] border border-[var(--card-border)] bg-white pr-4 pl-11 font-[Poppins] text-[14px] text-[var(--ink)] outline-none placeholder:text-[var(--neutral-400)] focus:border-[var(--brand-purple-400)]"
          />
        </div>

        {isError && data.length === 0 ? (
          <ErrorState
            variant="inline"
            title="Couldn't load ProBuddies"
            message="We couldn't reach the list right now. Please try again in a moment."
            onRetry={() => refetch()}
            showBack={false}
          />
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="ss-panel h-[230px] animate-pulse bg-[#F7F8FC]" />
            ))}
          </div>
        ) : buddies.length === 0 ? (
          <div className="ss-panel p-10 text-center">
            <p className="ss-display text-[17px] text-[var(--ink)]">
              {search ? 'Nobody matches that search' : 'No ProBuddies yet'}
            </p>
            <p className="mt-1.5 font-[Poppins] text-[13px] text-[var(--neutral-500)]">
              {search ? 'Try a different college or course.' : 'They will appear here as they join.'}
            </p>
          </div>
        ) : (
          <>
            <p className="ss-eyebrow text-[var(--neutral-400)]">
              {buddies.length} {buddies.length === 1 ? 'ProBuddy' : 'ProBuddies'}
            </p>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {buddies.map((b) => (
                <li key={b.proBuddyId ?? b.firstName}>
                  <BuddyCard buddy={b} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
