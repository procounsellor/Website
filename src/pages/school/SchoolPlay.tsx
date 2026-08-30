import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageSEO from '@/components/SEO/PageSEO';
import ErrorState from '@/components/common/ErrorState';
import GameMark from '@/components/school-student/GameMark';
import { TONE, toneFor } from '@/components/school-student/gameTones';
import McqBoard from '@/components/school-student/boards/McqBoard';
import SudokuBoard from '@/components/school-student/boards/SudokuBoard';
import WordBoard from '@/components/school-student/boards/WordBoard';
import { getGame, getSet, getTodayGameByGrade, getSchedule, type Game, type GameSet } from '@/api/schoolGames';
import { parseGrade, today as isoToday } from '@/api/schoolStudentApi';
import { getItem, loadItems, noteOf, promptOf, type GameItem } from '@/lib/gameItems';
import { useSchoolShell } from '@/lib/schoolShellContext';
import { useAuthStore } from '@/store/AuthStore';

/**
 * Playing today's game.
 *
 * Today only, taken from the student's own device clock. An earlier version put
 * the date in the URL so any scheduled day could be opened directly, which is
 * how each engine got checked during development — but a daily game whose
 * future days are reachable is not a daily game. You play what is on today.
 *
 * The page resolves schedule → game → set → items, then hands off to the board
 * for that engine. Phone-first throughout: one column, big targets, and the
 * board sized to fit a screen without scrolling mid-question.
 */

type Loaded = {
  date: string;
  game: Game | null;
  set: GameSet | null;
  title: string | null;
  items: GameItem[];
  /** 'probe' means ids were walked because getItemsBySetId is down. */
  source: 'api' | 'probe' | 'none';
};

type Outcome =
  | { kind: 'sudoku'; solved: boolean; seconds: number; hints: number }
  | { kind: 'mcq'; answers: Record<string, string>; hintsUsed: number; seconds: number }
  | { kind: 'word'; guess: string; hintsUsed: number; seconds: number };

export default function SchoolPlay() {
  const navigate = useNavigate();
  const { schoolStudent } = useAuthStore();
  const { record } = useSchoolShell();

  const date = isoToday();
  const grade = parseGrade(record?.className ?? schoolStudent?.className);

  const [data, setData] = useState<Loaded | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    setOutcome(null);

    const load = async (): Promise<Loaded | null> => {
      const scheduled = grade
        ? await getTodayGameByGrade(date, grade)
        : await getSchedule(date);
      if (!scheduled?.gameId) return null;

      const setId =
        'setId' in scheduled
          ? scheduled.setId
          : (scheduled.byGrade && grade ? scheduled.byGrade[String(grade)]?.setId : null) ?? null;
      const itemId = 'itemId' in scheduled ? scheduled.itemId : null;

      const [game, set] = await Promise.all([
        getGame(scheduled.gameId).catch(() => null),
        setId ? getSet(setId).catch(() => null) : Promise.resolve(null),
      ]);

      // A schedule that names one item (sudoku, word) needs exactly that item;
      // a schedule that names only a set needs the whole pack.
      let items: GameItem[] = [];
      let source: Loaded['source'] = 'none';
      if (itemId) {
        const one = await getItem(itemId).catch(() => null);
        if (one) {
          items = [one];
          source = 'api';
        }
      } else if (setId) {
        const result = await loadItems(setId, scheduled.gameId, set?.itemCount ?? 12);
        items = result.items;
        source = result.source;
      }

      return { date, game, set, title: scheduled.title ?? null, items, source };
    };

    load()
      .then((next) => {
        if (ignore) return;
        setData(next);
        setLoading(false);
      })
      .catch((cause) => {
        if (ignore) return;
        console.error('Game load failed:', cause);
        setError("We couldn't load this game. Check your connection and try again.");
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [date, grade, nonce]);

  const finishMcq = useCallback(
    (r: { answers: Record<string, string>; hintsUsed: number; seconds: number }) =>
      setOutcome({ kind: 'mcq', ...r }),
    [],
  );
  const finishSudoku = useCallback(
    (r: { solved: boolean; seconds: number; hints: number }) =>
      setOutcome({ kind: 'sudoku', ...r }),
    [],
  );
  const finishWord = useCallback(
    (r: { guess: string; hintsUsed: number; seconds: number }) =>
      setOutcome({ kind: 'word', ...r }),
    [],
  );

  /*
   * One key per day and per set. Keyed on both so a resumed run can only ever
   * belong to the game it came from — if the schedule changes, the old scratch
   * copy is simply never read again.
   */
  const runKey = `procounsel:school-run:${date}:${data?.set?.setId ?? data?.game?.gameId ?? 'none'}`;

  const tone = TONE[toneFor(data?.game?.gameId ?? 'quiz')];
  const engine = data?.game?.engine ?? '';
  const heading = data?.set?.title || data?.title || data?.game?.name || 'Today’s game';

  const longDate = useMemo(() => {
    const parsed = new Date(`${date}T00:00:00`);
    return Number.isNaN(parsed.getTime())
      ? date
      : parsed.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  }, [date]);

  return (
    <>
      <PageSEO title="Play" description="Play today's game." noIndex />

      <div className="mx-auto w-full max-w-[620px] pb-24">
        {/* Bar: leave, what this is, which day. */}
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/school-student/games')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--card-border)] bg-white text-[18px] text-[var(--neutral-500)]"
            aria-label="Back to games"
          >
            ←
          </button>
          <div className="min-w-0 flex-1">
            <p className="ss-eyebrow truncate text-[var(--neutral-400)]">
              {data?.game?.name ?? 'Game'} · {longDate}
            </p>
            <h1 className="ss-display truncate text-[18px] text-[var(--ink)]">{heading}</h1>
          </div>
          {data?.game && <GameMark gameId={data.game.gameId} engine={engine} size={40} />}
        </div>

        {loading ? (
          <div className="ss-panel h-[420px] animate-pulse bg-[#F7F8FC]" aria-busy />
        ) : error ? (
          <ErrorState
            variant="inline"
            title="This game didn't load"
            message={error}
            onRetry={() => setNonce((n) => n + 1)}
            showBack={false}
          />
        ) : !data ? (
          <div className="ss-panel p-8 text-center">
            <p className="ss-display text-[18px] text-[var(--ink)]">Nothing scheduled</p>
            <p className="mt-1.5 font-[Poppins] text-[13px] text-[var(--neutral-500)]">
              There is no game for your class on {longDate}.
            </p>
            <Link to="/school-student/games" className="ss-go mt-4 px-5 py-2.5 text-[13.5px]">
              See every game
            </Link>
          </div>
        ) : outcome ? (
          <Summary outcome={outcome} data={data} tone={tone} />
        ) : data.items.length === 0 ? (
          <div className="ss-panel p-8 text-center">
            <p className="ss-display text-[18px] text-[var(--ink)]">
              The question pack isn&apos;t available
            </p>
            <p className="mt-1.5 font-[Poppins] text-[13px] leading-relaxed text-[var(--neutral-500)]">
              The game is scheduled, but its questions can&apos;t be fetched yet.
              {data.set?.itemCount ? ` This set has ${data.set.itemCount} of them.` : ''}
            </p>
          </div>
        ) : (
          <>
            {data.source === 'probe' && (
              <p className="mb-3 rounded-[10px] border border-[#F8E3A3] bg-[#FFFBEB] px-3 py-2 font-[Poppins] text-[11.5px] text-[#7A5A00]">
                Development: questions were fetched one id at a time because the
                set endpoint is down. Order may not match the real set.
              </p>
            )}

            {engine === 'sudoku_v1' ? (
              <SudokuBoard
                item={data.items[0]}
                hintPenalty={data.game?.hintPenalty ?? 0}
                sessionKey={runKey}
                onFinish={finishSudoku}
              />
            ) : engine === 'word_guess_v1' ? (
              <WordBoard item={data.items[0]} onFinish={finishWord} />
            ) : (
              <McqBoard
                items={data.items}
                game={data.game}
                timeLimitSecs={data.set?.timeLimitSecs ?? data.game?.defaultTimeLimitSecs}
                sessionKey={runKey}
                onFinish={finishMcq}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

/**
 * The end of a run.
 *
 * Sudoku gets a real verdict, because a Sudoku marks itself. The other engines
 * get an honest one: what you answered, how long you took, and a plain
 * statement that the marking is server-side and that endpoint is not live. No
 * invented score, no green ticks on a guess.
 */
function Summary({
  outcome,
  data,
  tone,
}: {
  outcome: Outcome;
  data: Loaded;
  tone: { ink: string; tint: string; edge: string };
}) {
  const mins = Math.floor(outcome.seconds / 60);
  const secs = outcome.seconds % 60;
  const clock = `${mins}m ${String(secs).padStart(2, '0')}s`;

  const solved = outcome.kind === 'sudoku' && outcome.solved;

  return (
    <div className="ss-panel overflow-hidden">
      <div className="p-6 text-center" style={{ background: solved ? '#DCFCE7' : tone.tint }}>
        <p className="text-[42px]" aria-hidden>
          {solved ? '🎉' : '✅'}
        </p>
        <h2 className="ss-display mt-2 text-[22px] text-[var(--ink)]">
          {solved ? 'Solved it!' : 'Run finished'}
        </h2>
        <p className="mt-1.5 font-[Poppins] text-[13px] text-[var(--neutral-600)]">
          {data.set?.title ?? data.game?.name} · {clock}
        </p>
      </div>

      <div className="p-5">
        {outcome.kind === 'sudoku' ? (
          <dl>
            <Row label="Result" value={outcome.solved ? 'Correct' : 'Incomplete'} />
            <Row label="Time" value={clock} />
            <Row label="Squares revealed" value={String(outcome.hints)} />
            <Row
              label="Points"
              value={`${Math.max(
                0,
                (data.game?.solvePoints ?? 0) - outcome.hints * (data.game?.hintPenalty ?? 0),
              )} (pending)`}
            />
          </dl>
        ) : outcome.kind === 'word' ? (
          <dl>
            <Row label="Your answer" value={outcome.guess || '—'} />
            <Row label="Hints used" value={String(outcome.hintsUsed)} />
            <Row label="Time" value={clock} />
          </dl>
        ) : (
          <dl>
            <Row label="Answered" value={`${Object.keys(outcome.answers).length} of ${data.items.length}`} />
            <Row label="Hints used" value={String(outcome.hintsUsed)} />
            <Row label="Time" value={clock} />
          </dl>
        )}

        <p className="mt-4 rounded-[12px] border border-[var(--card-border)] bg-[#F7F8FC] px-4 py-3 font-[Poppins] text-[12.5px] leading-relaxed text-[var(--neutral-600)]">
          {outcome.kind === 'sudoku'
            ? 'A grid marks itself, so this result is real. Your points land on the leaderboard once the scoring endpoint is live.'
            : 'Your answers are held here. Marking happens on the server — the endpoint that scores an attempt and awards points is not live yet, so no score is shown rather than a guessed one.'}
        </p>

        {outcome.kind === 'mcq' && <Review items={data.items} answers={outcome.answers} />}

        <div className="mt-4 flex flex-wrap gap-2.5">
          <Link to="/school-student/games" className="ss-go px-5 py-2.5 text-[13.5px]">
            Back to games
          </Link>
          <Link
            to="/school-student/dashboard"
            className="flex items-center rounded-[12px] border border-[var(--card-border)] bg-white px-5 py-2.5 font-[Poppins] text-[13.5px] font-semibold text-[var(--neutral-600)]"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Going back through the questions afterwards.
 *
 * This is what the item's `explanation` is for, and why it is not shown during
 * play: read at the moment of answering it hands over the answer without ever
 * marking it. Read here, next to what the student actually chose, it teaches.
 *
 * The right/wrong column is deliberately absent rather than guessed. The
 * correct option id lives on the server and comes back from the scoring
 * endpoint that is not live yet; when it is, `correctId` drops into this same
 * layout and each row gains a tick or a cross. Nothing else has to change.
 */
function Review({
  items,
  answers,
  correct,
}: {
  items: GameItem[];
  answers: Record<string, string>;
  /** itemId → correct option id, once the server can tell us. */
  correct?: Record<string, string>;
}) {
  return (
    <details className="group mt-4">
      <summary className="ss-eyebrow flex cursor-pointer list-none items-center justify-between rounded-[12px] border border-[var(--card-border)] bg-white px-4 py-3.5 text-[var(--neutral-600)]">
        Review your answers ({items.length})
        <span aria-hidden className="transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>

      <ol className="mt-3 space-y-3">
        {items.map((item, index) => {
          const chosenId = answers[item.itemId];
          const chosen = item.content.options?.find((o) => o.id === chosenId);
          const rightId = correct?.[item.itemId];
          const isRight = rightId ? rightId === chosenId : null;
          const note = noteOf(item);

          return (
            <li key={item.itemId} className="rounded-[12px] border border-[var(--card-border)] p-4">
              <div className="flex items-start gap-2.5">
                <span className="ss-data mt-0.5 shrink-0 text-[12px] text-[var(--neutral-400)]">
                  {index + 1}
                </span>
                <p className="font-[Poppins] text-[13.5px] leading-snug font-semibold text-[var(--ink)]">
                  {promptOf(item)}
                </p>
              </div>

              <p
                className="mt-2.5 flex items-center gap-2 rounded-[10px] px-3 py-2 font-[Poppins] text-[13px]"
                style={
                  isRight === null
                    ? { background: '#F5F6FA', color: 'var(--neutral-600)' }
                    : isRight
                      ? { background: '#DCFCE7', color: '#16A34A' }
                      : { background: '#FEE2E2', color: '#B91C1C' }
                }
              >
                {isRight !== null && <span aria-hidden>{isRight ? '✓' : '✗'}</span>}
                <span className="ss-eyebrow opacity-70">You chose</span>
                {chosen?.text ?? 'Nothing'}
              </p>

              {note && (
                <p className="mt-2 font-[Poppins] text-[12.5px] leading-relaxed text-[var(--neutral-600)]">
                  {note}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </details>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="ss-readout">
    <dt className="ss-eyebrow text-[var(--neutral-400)]">{label}</dt>
    <dd className="ss-data text-[13px] text-[var(--ink)]">{value}</dd>
  </div>
);
