import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Camera, CameraOff, Mic, Keyboard, Volume2, VolumeX, RotateCcw, Users } from 'lucide-react';
import SkyBanner from '@/components/school-student/SkyBanner';
import { Skeleton, StateBlock } from '@/components/mba/ui';
import { Pill, ScoreBars } from '@/components/mba/GdpiFeedback';
import { DeliveryCard, VoiceAnswer } from '@/components/mba/VoiceAnswer';
import { mbaStatus } from '@/api/mba';
import { BACKGROUNDS, wordCount, type Background } from '@/api/mbaGdpi';
import {
  LIVE_MAX_CHARS,
  LIVE_MIN_CHARS,
  liveErrorMessage,
  useCreateLiveInterview,
  useFinishLiveInterview,
  useLiveAnswer,
  useLiveInterview,
  useLiveVoiceAnswer,
  type LiveBand,
  type LiveInterview,
} from '@/api/mbaLiveInterview';

/* ------------------------------------------------------------------ */
/* Preferences (read aloud / camera), remembered for this browser tab */
/* ------------------------------------------------------------------ */

interface Prefs {
  readAloud: boolean;
  camera: boolean;
}
const PREFS_KEY = 'mba-live-interview-prefs';

function loadPrefs(): Prefs {
  try {
    const raw = window.sessionStorage.getItem(PREFS_KEY);
    if (raw) return { readAloud: true, camera: false, ...(JSON.parse(raw) as Partial<Prefs>) };
  } catch {
    // storage blocked: defaults
  }
  return { readAloud: true, camera: false };
}

function savePrefs(prefs: Prefs) {
  try {
    window.sessionStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

/* ------------------------------------------------------------------ */
/* Text to speech: the panel reads each question aloud                */
/* ------------------------------------------------------------------ */

const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === 'en-IN') ??
    voices.find((v) => v.lang.startsWith('en-GB')) ??
    voices.find((v) => v.lang.startsWith('en'))
  );
}

function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const speak = useCallback((text: string) => {
    if (!canSpeak()) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) u.voice = voice;
    u.rate = 0.98;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }, []);
  const stop = useCallback(() => {
    if (canSpeak()) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);
  useEffect(() => stop, [stop]);
  return { speaking, speak, stop };
}

/* ------------------------------------------------------------------ */
/* Camera self-view (local only, never recorded or sent)              */
/* ------------------------------------------------------------------ */

function SelfView({ on }: { on: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!on) return;
    let stream: MediaStream | null = null;
    let cancelled = false;
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Your browser cannot show the camera.');
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' }, audio: false })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        setError('');
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setError('Camera blocked. You can still do the interview without it.'));
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [on]);

  if (!on) return null;
  return (
    <div className="relative overflow-hidden rounded-2xl bg-black/40 ring-1 ring-white/15">
      {error ? (
        <p className="p-3 font-[Poppins] text-[12px] text-white/80">{error}</p>
      ) : (
        <video ref={videoRef} autoPlay muted playsInline className="aspect-[4/3] w-full -scale-x-100 object-cover" aria-label="Your camera (only you can see it)" />
      )}
      <span className="absolute bottom-1.5 left-2 rounded-full bg-black/55 px-2 py-0.5 font-[Poppins] text-[10px] text-white">You · not recorded</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Setup                                                              */
/* ------------------------------------------------------------------ */

const WORK_OPTIONS = [
  { months: 0, label: 'Fresher' },
  { months: 6, label: 'Under 1 year' },
  { months: 18, label: '1–2 years' },
  { months: 36, label: '2–5 years' },
  { months: 72, label: '5+ years' },
];
const LENGTHS = [
  { n: 5, label: 'Quick · 5 questions' },
  { n: 7, label: 'Standard · 7 questions' },
  { n: 10, label: 'Full · 10 questions' },
];

function Setup({ onStarted }: { onStarted: (id: string, prefs: Prefs) => void }) {
  const [background, setBackground] = useState<Background | undefined>();
  const [workMonths, setWorkMonths] = useState(0);
  const [target, setTarget] = useState('');
  const [about, setAbout] = useState('');
  const [questions, setQuestions] = useState(7);
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);
  const create = useCreateLiveInterview();

  const start = () =>
    create.mutate(
      {
        background,
        workMonths,
        target: target.trim() || undefined,
        about: about.trim() || undefined,
        questions,
      },
      {
        onSuccess: (iv) => {
          savePrefs(prefs);
          onStarted(iv.id, prefs);
        },
      },
    );

  return (
    <section className="ss-panel space-y-5 p-4 md:p-6">
      <div>
        <h2 className="ss-display text-[18px] text-[var(--ink)]">Before you walk in</h2>
        <p className="mt-1 font-[Poppins] text-[13px] leading-relaxed text-[var(--neutral-500)]">
          Like a real panel, the AI asks one question at a time and follows up on what you say — so it helps to tell it a
          little about you. You'll get no feedback during the interview, just a full report at the end.
        </p>
      </div>

      <fieldset>
        <legend className="font-[Poppins] text-[12px] font-semibold text-[var(--neutral-600)]">Your undergraduate background</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          <Pill active={!background} onClick={() => setBackground(undefined)}>
            Prefer not to say
          </Pill>
          {BACKGROUNDS.map((b) => (
            <Pill key={b.id} active={background === b.id} onClick={() => setBackground(b.id)}>
              {b.label}
            </Pill>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-[Poppins] text-[12px] font-semibold text-[var(--neutral-600)]">Work experience</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {WORK_OPTIONS.map((w) => (
            <Pill key={w.months} active={workMonths === w.months} onClick={() => setWorkMonths(w.months)}>
              {w.label}
            </Pill>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="font-[Poppins] text-[12px] font-semibold text-[var(--neutral-600)]">What are you aiming for? (optional)</span>
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value.slice(0, 120))}
          placeholder="e.g. IIMs, finance or marketing"
          className="mt-1.5 w-full rounded-xl border border-[var(--borders-default)] px-3.5 py-2.5 font-[Poppins] text-[14px] outline-none focus:border-[var(--brand-purple-600)]"
        />
      </label>

      <label className="block">
        <span className="font-[Poppins] text-[12px] font-semibold text-[var(--neutral-600)]">
          A few lines about you (optional) — the panel uses this, like your application form
        </span>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value.slice(0, 1500))}
          rows={3}
          placeholder="e.g. B.Com from Nagpur, two years in an audit firm, play state-level chess, want to move into corporate finance."
          className="mt-1.5 w-full rounded-xl border border-[var(--borders-default)] px-3.5 py-2.5 font-[Poppins] text-[14px] outline-none focus:border-[var(--brand-purple-600)]"
        />
      </label>

      <fieldset>
        <legend className="font-[Poppins] text-[12px] font-semibold text-[var(--neutral-600)]">Length</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {LENGTHS.map((l) => (
            <Pill key={l.n} active={questions === l.n} onClick={() => setQuestions(l.n)}>
              {l.label}
            </Pill>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-4 rounded-xl bg-[var(--neutral-50)] p-3.5">
        <label className="inline-flex cursor-pointer items-center gap-2 font-[Poppins] text-[13px] text-[var(--ink)]">
          <input type="checkbox" checked={prefs.readAloud} onChange={(e) => setPrefs((p) => ({ ...p, readAloud: e.target.checked }))} className="h-4 w-4" />
          Read questions aloud
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 font-[Poppins] text-[13px] text-[var(--ink)]">
          <input type="checkbox" checked={prefs.camera} onChange={(e) => setPrefs((p) => ({ ...p, camera: e.target.checked }))} className="h-4 w-4" />
          Show my camera (only to me, never recorded)
        </label>
      </div>

      {create.isError && (
        <p role="alert" className="font-[Poppins] text-[13px] text-[var(--red-500)]">
          {liveErrorMessage(create.error, "Couldn't start the interview. Please try again.")}
        </p>
      )}

      <button
        type="button"
        onClick={start}
        disabled={create.isPending}
        className="btn-primary cursor-pointer px-6 py-3 font-[Poppins] text-[14px] font-semibold disabled:opacity-60"
      >
        {create.isPending ? 'Setting up the room…' : 'Start the interview'}
      </button>
      <p className="font-[Poppins] text-[11px] leading-relaxed text-[var(--neutral-500)]">
        Each answer uses one of your daily AI credits (shared with practice hints and feedback). Voice recordings are
        turned into text and deleted; only the transcript is kept. This is practice: it never predicts admission.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Interview room                                                     */
/* ------------------------------------------------------------------ */

function clock(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function Room({ interview, prefs, onPrefs }: { interview: LiveInterview; prefs: Prefs; onPrefs: (p: Prefs) => void }) {
  const current = interview.turns[interview.turns.length - 1];
  const answered = interview.turns.filter((t) => t.answerText !== null).length;
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [text, setText] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const { speaking, speak, stop } = useSpeech();
  const answer = useLiveAnswer();
  const voice = useLiveVoiceAnswer();
  const finish = useFinishLiveInterview();
  const pending = answer.isPending || voice.isPending || finish.isPending;
  const error = answer.error ?? voice.error ?? finish.error;
  const questionRef = useRef<HTMLHeadingElement>(null);

  // New question: read it aloud (if on), reset the answer clock and the text box, move focus to it.
  useEffect(() => {
    setElapsed(0);
    setText('');
    questionRef.current?.focus();
    if (prefs.readAloud) speak(current.question);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the question changes
  }, [current.number]);

  useEffect(() => {
    if (pending) return;
    const t = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [pending, current.number]);

  const words = wordCount(text);
  const canSendText = text.trim().length >= LIVE_MIN_CHARS && !pending;

  return (
    <section className="overflow-hidden rounded-[24px] bg-[#0E1629] text-white shadow-[0_24px_60px_-24px_rgba(14,22,41,0.6)]">
      {/* Room header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-6">
        <div className="flex items-center gap-2 font-[Poppins] text-[13px]">
          <span className="relative flex h-2.5 w-2.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#FA660F] opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FA660F]" />
          </span>
          Interview in progress · Question {current.number} of {interview.totalQuestions}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const next = { ...prefs, readAloud: !prefs.readAloud };
              if (!next.readAloud) stop();
              onPrefs(next);
            }}
            aria-pressed={prefs.readAloud}
            className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full bg-white/10 px-3 font-[Poppins] text-[12px] hover:bg-white/15"
          >
            {prefs.readAloud ? <Volume2 className="h-4 w-4" aria-hidden /> : <VolumeX className="h-4 w-4" aria-hidden />}
            {prefs.readAloud ? 'Voice on' : 'Voice off'}
          </button>
          <button
            type="button"
            onClick={() => onPrefs({ ...prefs, camera: !prefs.camera })}
            aria-pressed={prefs.camera}
            className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full bg-white/10 px-3 font-[Poppins] text-[12px] hover:bg-white/15"
          >
            {prefs.camera ? <Camera className="h-4 w-4" aria-hidden /> : <CameraOff className="h-4 w-4" aria-hidden />}
            Camera
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1 w-full bg-white/10" aria-hidden>
        <div className="h-1 bg-gradient-to-r from-[#2F43F2] to-[#FA660F] transition-all" style={{ width: `${(answered / interview.totalQuestions) * 100}%` }} />
      </div>

      <div className="grid gap-5 p-4 md:grid-cols-[1fr_200px] md:p-6">
        <div className="space-y-5">
          {/* The panel */}
          <div className="flex items-start gap-3">
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2F43F2] to-[#6D28D9]">
              <Users className="h-6 w-6" aria-hidden />
              {(speaking || pending) && (
                <span className="absolute -inset-1 rounded-full ring-2 ring-[#FDBA74]/70 motion-safe:animate-pulse" aria-hidden />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-[Poppins] text-[12px] font-semibold uppercase tracking-wider text-[#AFC2FF]">
                The panel {speaking ? '· speaking' : pending ? '· noting your answer…' : ''}
              </p>
              <div aria-live="polite">
                {pending ? (
                  <p className="mt-2 font-[Poppins] text-[17px] text-white/70">Thank you. One moment…</p>
                ) : (
                  <h2 ref={questionRef} tabIndex={-1} className="mt-1.5 font-[Poppins] text-[19px] font-semibold leading-snug outline-none md:text-[22px]">
                    {current.question}
                  </h2>
                )}
              </div>
              {!pending && canSpeak() && (
                <button
                  type="button"
                  onClick={() => speak(current.question)}
                  className="mt-2 inline-flex min-h-9 cursor-pointer items-center gap-1.5 font-[Poppins] text-[12px] text-[#FDBA74] hover:underline"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Hear it again
                </button>
              )}
            </div>
          </div>

          {/* Answer */}
          {!pending && (
            <div className="rounded-2xl bg-white p-3.5 text-[var(--ink)] md:p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-2" role="group" aria-label="How you answer">
                  <Pill active={mode === 'voice'} onClick={() => setMode('voice')}>
                    <span className="inline-flex items-center gap-1.5"><Mic className="h-3.5 w-3.5" aria-hidden /> Speak</span>
                  </Pill>
                  <Pill active={mode === 'text'} onClick={() => setMode('text')}>
                    <span className="inline-flex items-center gap-1.5"><Keyboard className="h-3.5 w-3.5" aria-hidden /> Type</span>
                  </Pill>
                </div>
                <span className={`font-[Poppins] text-[12px] ${elapsed > 150 ? 'text-[var(--red-500)]' : 'text-[var(--neutral-500)]'}`}>
                  Thinking + answering: {clock(elapsed)} {elapsed > 150 ? '· panels often cut in around now' : '· aim for 1–2 minutes'}
                </span>
              </div>
              {mode === 'voice' ? (
                <VoiceAnswer
                  pending={voice.isPending}
                  disabled={mbaStatus(voice.error) === 429}
                  onSend={(audio, seconds) => {
                    stop();
                    voice.mutate({ id: interview.id, audio, durationSeconds: seconds });
                  }}
                  sendLabel="Send answer"
                  pendingLabel="The panel is listening…"
                  note="Speak as you would in the room, up to 3 minutes. Your recording is turned into text and then deleted."
                />
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value.slice(0, LIVE_MAX_CHARS))}
                    rows={5}
                    aria-label="Your answer"
                    placeholder="Type your answer the way you would say it to the panel."
                    className="w-full rounded-xl border border-[var(--borders-default)] px-3.5 py-2.5 font-[Poppins] text-[14px] outline-none focus:border-[var(--brand-purple-600)]"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-[Poppins] text-[12px] text-[var(--neutral-500)]">{words} words</span>
                    <button
                      type="button"
                      disabled={!canSendText}
                      onClick={() => {
                        stop();
                        answer.mutate({ id: interview.id, answerText: text.trim() });
                      }}
                      className="btn-primary cursor-pointer px-5 py-2.5 font-[Poppins] text-[13px] font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Send answer
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && !pending && (
            <p role="alert" className="font-[Poppins] text-[13px] text-[#FDBA74]">
              {liveErrorMessage(error, "Couldn't send that. Please try again.")}
            </p>
          )}
        </div>

        <aside className="space-y-3">
          <SelfView on={prefs.camera} />
          <div className="rounded-2xl bg-white/5 p-3 font-[Poppins] text-[12px] leading-relaxed text-white/75">
            <p className="font-semibold text-white">Tips from real panels</p>
            <ul className="mt-1.5 list-disc space-y-1 pl-4">
              <li>Pause for 3 seconds before you start.</li>
              <li>Lead with your point, then one specific example.</li>
              <li>It's fine to say "I don't know" — then show how you'd think about it.</li>
            </ul>
          </div>
          {answered >= 2 && (
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                stop();
                finish.mutate(interview.id);
              }}
              className="w-full cursor-pointer rounded-xl border border-white/25 px-3 py-2.5 font-[Poppins] text-[13px] font-semibold text-white hover:bg-white/10 disabled:opacity-50"
            >
              End interview &amp; get report
            </button>
          )}
        </aside>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Report                                                             */
/* ------------------------------------------------------------------ */

const BAND: Record<LiveBand, { label: string; tone: string }> = {
  ready: { label: 'Interview-ready', tone: 'bg-[#E8F7EE] text-[#146C43]' },
  almost: { label: 'Almost there', tone: 'bg-[#EEF0FE] text-[#2F43F2]' },
  needs_work: { label: 'Needs work', tone: 'bg-[#FFF1E6] text-[#C2410C]' },
};

function Report({ interview, onRestart }: { interview: LiveInterview; onRestart: () => void }) {
  const report = interview.report;
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);
  return (
    <div className="space-y-5">
      <section className="ss-panel space-y-4 p-4 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-[Poppins] text-[12px] font-semibold uppercase tracking-wider text-[var(--neutral-500)]">Your interview report</p>
            <h2 ref={headingRef} tabIndex={-1} className="ss-display mt-1 text-[22px] text-[var(--ink)] outline-none">
              {report?.overall != null ? `${report.overall.toFixed(1)} / 5 overall` : 'Interview complete'}
            </h2>
          </div>
          {report?.band && <span className={`rounded-full px-3 py-1 font-[Poppins] text-[13px] font-semibold ${BAND[report.band].tone}`}>{BAND[report.band].label}</span>}
        </div>
        {report?.summary && <p className="font-[Poppins] text-[14px] leading-relaxed text-[var(--ink)]">{report.summary}</p>}
        {report?.scores && <ScoreBars scores={report.scores} />}
        <div className="grid gap-4 md:grid-cols-2">
          {report && report.strengths.length > 0 && (
            <div>
              <h3 className="font-[Poppins] text-[13px] font-bold text-[#146C43]">What went well</h3>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 font-[Poppins] text-[13px] text-[var(--ink)]">
                {report.strengths.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          )}
          {report && report.improvements.length > 0 && (
            <div>
              <h3 className="font-[Poppins] text-[13px] font-bold text-[#C2410C]">Work on next</h3>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 font-[Poppins] text-[13px] text-[var(--ink)]">
                {report.improvements.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <button type="button" onClick={onRestart} className="btn-primary cursor-pointer px-5 py-2.5 font-[Poppins] text-[13px] font-semibold">
            Take another interview
          </button>
          <Link to="/mba/shortlist?request=mock_interview#counsellor" className="btn-secondary px-5 py-2.5 font-[Poppins] text-[13px] font-semibold">
            Practise with a real counsellor
          </Link>
        </div>
        <p className="font-[Poppins] text-[11px] text-[var(--neutral-500)]">
          Practice feedback from AI, based only on what you said. It does not predict shortlisting or admission.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="ss-display text-[16px] text-[var(--ink)]">Your interview, question by question</h3>
        {interview.turns
          .filter((t) => t.answerText !== null)
          .map((t) => (
            <details key={t.number} className="ss-panel p-4 md:p-5">
              <summary className="cursor-pointer list-none">
                <span className="font-[Poppins] text-[12px] font-semibold text-[var(--neutral-500)]">Q{t.number}</span>
                <span className="mt-0.5 block font-[Poppins] text-[15px] font-semibold text-[var(--ink)]">{t.question}</span>
                {t.note && <span className="mt-1 block font-[Poppins] text-[13px] text-[#2F43F2]">{t.note}</span>}
              </summary>
              <div className="mt-3 space-y-3">
                <p className="whitespace-pre-wrap rounded-xl bg-[var(--neutral-50)] p-3 font-[Poppins] text-[13px] leading-relaxed text-[var(--ink)]">
                  {t.answerText}
                </p>
                {t.scores && <ScoreBars scores={t.scores} />}
                {t.delivery && <DeliveryCard delivery={t.delivery} />}
              </div>
            </details>
          ))}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function MbaLiveInterview() {
  const [params, setParams] = useSearchParams();
  const id = params.get('interview');
  const query = useLiveInterview(id);
  const [prefs, setPrefsState] = useState<Prefs>(loadPrefs);
  const setPrefs = (p: Prefs) => {
    setPrefsState(p);
    savePrefs(p);
  };

  let body;
  if (!id)
    body = (
      <Setup
        onStarted={(newId, p) => {
          setPrefsState(p);
          setParams({ interview: newId }, { replace: true });
        }}
      />
    );
  else if (query.isPending) body = <Skeleton rows={3} />;
  else if (query.isError)
    body = (
      <StateBlock
        tone="error"
        title={mbaStatus(query.error) === 404 ? 'Interview not found' : "Couldn't load this interview"}
        detail={
          mbaStatus(query.error) === 404
            ? 'This interview link is no longer valid. Start a new one.'
            : liveErrorMessage(query.error, 'Please try again.')
        }
        action={{ label: 'Start a new interview', onClick: () => setParams({}) }}
      />
    );
  else if (query.data.status === 'completed') body = <Report interview={query.data} onRestart={() => setParams({})} />;
  else body = <Room key={query.data.id} interview={query.data} prefs={prefs} onPrefs={setPrefs} />;

  return (
    <div className="mx-auto max-w-[920px] space-y-5">
      <Link to="/mba/gdpi" className="inline-flex items-center gap-1 font-[Poppins] text-[13px] font-semibold text-[var(--brand-purple-600)]">
        <ArrowLeft className="h-4 w-4" /> Interview prep
      </Link>
      <SkyBanner
        eyebrow="Live AI interview"
        title="Face a panel that listens and follows up"
        lead="The AI asks one question at a time, digs into what you say, and gives you a full report at the end — like the real thing."
      />
      {body}
    </div>
  );
}
