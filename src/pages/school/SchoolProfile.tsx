import { useEffect, useState } from 'react';
import PageSEO from '@/components/SEO/PageSEO';
import ErrorState from '@/components/common/ErrorState';
import SkyBanner from '@/components/school-student/SkyBanner';
import { Icon } from '@/components/school-student/assets';
import { useSchoolShell } from '@/lib/schoolShellContext';
import { useAuthStore } from '@/store/AuthStore';
import { updateSchoolStudent } from '@/api/schoolStudentApi';
import type { Stamp } from '@/api/schoolStudentApi';

/**
 * The student's profile.
 *
 * Reads `getSchoolStudentById` (through the shell, which already holds it) and
 * writes `updateSchoolStudentFields`. Three decisions worth stating:
 *
 *   1. **Only what changed is sent.** The PATCH writes every key it receives,
 *      so posting the whole form back would overwrite fields this page does not
 *      own with whatever it happened to render.
 *   2. **The phone number is not editable.** It is the account's identity — it
 *      is the `schoolStudentId` the whole API is keyed by — so it is shown as a
 *      fact, not a field.
 *   3. **The record is re-read after a save,** rather than the form trusting
 *      its own optimistic copy. The service may normalise what it stores, and
 *      the version on screen should be the version on the server.
 */

/** Firestore stamps arrive as `{ seconds, nanos }`, not ISO strings. */
const stampToDate = (stamp: Stamp): string => {
  if (!stamp?.seconds) return '—';
  return new Date(stamp.seconds * 1000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const Field = ({
  label,
  value,
  onChange,
  autoComplete,
  maxLength = 60,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  autoComplete?: string;
  maxLength?: number;
}) => (
  <label className="block">
    <span className="ss-eyebrow text-[var(--neutral-400)]">{label}</span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      autoComplete={autoComplete}
      maxLength={maxLength}
      className="mt-1.5 w-full rounded-[12px] border border-[var(--card-border)] bg-white px-3.5 py-2.5 font-[Poppins] text-[14px] text-[var(--ink)] outline-none focus:border-[var(--brand-purple-400)]"
    />
  </label>
);

const Fact = ({ label, value }: { label: string; value: string }) => (
  <div className="ss-readout">
    <span className="ss-eyebrow text-[var(--neutral-400)]">{label}</span>
    <span className="ss-data text-[12.5px] text-[var(--ink)]">{value}</span>
  </div>
);

export default function SchoolProfile() {
  const { record, refreshRecord, view } = useSchoolShell();
  const { schoolStudent, userId } = useAuthStore();
  const id = record?.schoolStudentId ?? schoolStudent?.phoneNumber ?? userId ?? null;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [className, setClassName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Seeded from the record and re-seeded whenever it is re-read, so a save
  // followed by a refresh never leaves the form showing the old values.
  useEffect(() => {
    setFirstName(record?.firstName ?? schoolStudent?.firstName ?? '');
    setLastName(record?.lastName ?? schoolStudent?.lastName ?? '');
    setClassName(record?.className ?? schoolStudent?.className ?? '');
  }, [record, schoolStudent]);

  const changed = {
    ...(firstName.trim() && firstName.trim() !== record?.firstName
      ? { firstName: firstName.trim() }
      : {}),
    ...(lastName.trim() && lastName.trim() !== record?.lastName
      ? { lastName: lastName.trim() }
      : {}),
    ...(className.trim() && className.trim() !== record?.className
      ? { className: className.trim() }
      : {}),
  };
  const hasChanges = Object.keys(changed).length > 0;

  const save = async () => {
    if (!id || !hasChanges) return;
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      await updateSchoolStudent(id, changed);
      refreshRecord();
      setSaved(true);
    } catch (cause) {
      console.error('Profile save failed:', cause);
      setSaveError(cause instanceof Error ? cause.message : "We couldn't save that.");
    } finally {
      setSaving(false);
    }
  };

  const report = record?.pyschometricReportPdfLink ?? null;

  return (
    <>
      <PageSEO title="Your profile" description="Your ProCounsel profile." noIndex />

      <div className="mx-auto max-w-[1240px] space-y-6">
        <SkyBanner
          eyebrow="Your climber"
          title={[record?.firstName, record?.lastName].filter(Boolean).join(' ') || 'Your profile'}
          lead={
            record?.schoolName
              ? `${record.schoolName}${record.className ? ` · Class ${record.className}` : ''}`
              : 'Keep your details up to date so your class gets the right daily set.'
          }
          aside={
            <div
              className="flex gap-5 rounded-2xl border border-white/25 px-4 py-3 backdrop-blur-md"
              style={{ background: 'rgba(16, 9, 44, 0.72)' }}
            >
              <span>
                <p className="ss-eyebrow text-white/55">Points</p>
                <p className="ss-data mt-1 text-[22px] leading-none text-white">
                  {view.points.toLocaleString('en-IN')}
                </p>
              </span>
              <span>
                <p className="ss-eyebrow text-white/55">Streak</p>
                <p className="ss-data mt-1 text-[22px] leading-none text-white">
                  {view.streakDays}
                </p>
              </span>
            </div>
          }
        />

        {!record && (
          <ErrorState
            variant="inline"
            title="We couldn't load your profile"
            message="Your details are showing from what we saved when you signed up. Reload to try the server again."
            onRetry={refreshRecord}
            showBack={false}
          />
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_356px]">
          <section className="ss-panel p-5 sm:p-6">
            <h2 className="ss-display text-[18px] text-[var(--ink)]">Your details</h2>
            <p className="mt-1 font-[Poppins] text-[12.5px] text-[var(--neutral-500)]">
              Your class decides which set of questions you get each day, so keep it current.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First name" value={firstName} onChange={setFirstName} autoComplete="given-name" />
              <Field label="Last name" value={lastName} onChange={setLastName} autoComplete="family-name" />
              <Field label="Class" value={className} onChange={setClassName} maxLength={12} />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={save}
                disabled={!hasChanges || saving || !id}
                className="ss-go px-5 py-2.5 text-[13.5px]"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              {!hasChanges && !saving && (
                <span className="font-[Poppins] text-[12px] text-[var(--neutral-400)]">
                  Nothing to save yet.
                </span>
              )}
              {saved && !hasChanges && (
                <span className="ss-eyebrow rounded-full bg-[#DCFCE7] px-3 py-1.5 text-[#16A34A]">
                  Saved
                </span>
              )}
            </div>

            {saveError && (
              <p role="alert" className="mt-3 font-[Poppins] text-[12.5px] text-[var(--red-500)]">
                {saveError}
              </p>
            )}
          </section>

          <div className="space-y-6">
            <section className="ss-panel p-5">
              <h2 className="ss-display text-[17px] text-[var(--ink)]">Account</h2>
              <dl className="mt-3">
                <Fact label="Phone" value={record?.phoneNumber ?? id ?? '—'} />
                <Fact label="School" value={record?.schoolName ?? '—'} />
                <Fact label="Joined" value={stampToDate(record?.dateCreated ?? null)} />
                <Fact label="Last active" value={record?.lastActiveDate ?? '—'} />
                <Fact label="Level" value={`${view.level.level} · ${view.level.name}`} />
              </dl>
              <p className="mt-3 font-[Poppins] text-[11.5px] leading-relaxed text-[var(--neutral-400)]">
                Your phone number identifies your account, so it can&apos;t be changed here.
              </p>
            </section>

            <section className="ss-panel p-5">
              <h2 className="ss-display text-[17px] text-[var(--ink)]">Psychometric report</h2>
              {report ? (
                <>
                  <p className="mt-1.5 font-[Poppins] text-[12.5px] leading-relaxed text-[var(--neutral-500)]">
                    Your report is ready. It maps your strengths to the paths that fit them.
                  </p>
                  <a
                    href={report}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ss-go mt-4 px-4 py-2.5 text-[13px]"
                  >
                    <Icon name="psychometricBrain" className="h-4 w-4" />
                    Open report
                  </a>
                </>
              ) : (
                <p className="mt-1.5 font-[Poppins] text-[12.5px] leading-relaxed text-[var(--neutral-500)]">
                  You haven&apos;t taken the test yet. It&apos;s the first quest on your route, and
                  your report appears here the moment it&apos;s ready.
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
