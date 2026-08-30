/**
 * The ProCounsel school-student icon set — both supplied packs.
 *
 * `SCHOOL_ICONS` is the coloured pack (ProCounsel_SVG_Assets); `NEUTRAL_ICONS`
 * is the grey pack from the quiz design kit. They overlap on the navigation
 * glyphs on purpose: grey reads as inactive, coloured as active, so the rail
 * gets a proper two-state nav out of the supplied art rather than a CSS filter.
 *
 * Every file is under 900 bytes, below Vite's 4KB inline threshold — so these
 * are emitted as data URIs inside the school shell's own lazy chunk. No extra
 * network requests, nothing to 404, and no layout shift while an illustration
 * loads. Importing (rather than pointing at /public) is what buys that.
 */
import badgeExplorer from '@/assets/school/badge_explorer.svg';
import badgeQuizMaster from '@/assets/school/badge_quiz_master.svg';
import badgeStreakStar from '@/assets/school/badge_streak_star.svg';
import bookingCalendar from '@/assets/school/booking_calendar.svg';
import coinPoints from '@/assets/school/coin_points.svg';
import flameStreak from '@/assets/school/flame_streak.svg';
import gamesController from '@/assets/school/games_controller.svg';
import levelShield from '@/assets/school/level_shield.svg';
import lock from '@/assets/school/lock.svg';
import navHome from '@/assets/school/nav_home.svg';
import navLeaderboard from '@/assets/school/nav_leaderboard.svg';
import navProfile from '@/assets/school/nav_profile.svg';
import navQuests from '@/assets/school/nav_quests.svg';
import progressRing from '@/assets/school/progress_ring.svg';
import psychometricBrain from '@/assets/school/psychometric_brain.svg';
import quarterQ1 from '@/assets/school/quarter_q1_sprout.svg';
import quarterQ2 from '@/assets/school/quarter_q2_telescope.svg';
import quarterQ3 from '@/assets/school/quarter_q3_backpack.svg';
import quarterQ4 from '@/assets/school/quarter_q4_trophy.svg';
import rewardGift from '@/assets/school/reward_gift.svg';
import starPoints from '@/assets/school/star_points.svg';
import studentAvatar from '@/assets/school/student_avatar.svg';
import trophyLeaderboard from '@/assets/school/trophy_leaderboard.svg';

export const SCHOOL_ICONS = {
  badgeExplorer,
  badgeQuizMaster,
  badgeStreakStar,
  bookingCalendar,
  coinPoints,
  flameStreak,
  gamesController,
  levelShield,
  lock,
  navHome,
  navLeaderboard,
  navProfile,
  navQuests,
  progressRing,
  psychometricBrain,
  quarterQ1,
  quarterQ2,
  quarterQ3,
  quarterQ4,
  rewardGift,
  starPoints,
  studentAvatar,
  trophyLeaderboard,
} as const;

export type SchoolIcon = keyof typeof SCHOOL_ICONS;

// The quiz design kit's neutral versions — used for the rail's resting state.
import nCalendar from '@/assets/school/neutral/calendar_day.svg';
import nCheck from '@/assets/school/neutral/completed_check.svg';
import nController from '@/assets/school/neutral/game_controller.svg';
import nGift from '@/assets/school/neutral/gift.svg';
import nHome from '@/assets/school/neutral/nav_home.svg';
import nLeaderboard from '@/assets/school/neutral/nav_leaderboard.svg';
import nProfile from '@/assets/school/neutral/nav_profile.svg';
import nQuests from '@/assets/school/neutral/nav_quests.svg';
import nClipboard from '@/assets/school/neutral/quiz_clipboard.svg';
import nBubble from '@/assets/school/neutral/quiz_question_bubble.svg';
import nChest from '@/assets/school/neutral/reward_chest.svg';
import nRing from '@/assets/school/neutral/progress_ring_33.svg';
import nShield from '@/assets/school/neutral/level_shield.svg';

export const NEUTRAL_ICONS = {
  navHome: nHome,
  navQuests: nQuests,
  navLeaderboard: nLeaderboard,
  navProfile: nProfile,
  bookingCalendar: nCalendar,
  rewardGift: nGift,
  progressRing: nRing,
  levelShield: nShield,
  gamesController: nController,
  rewardChest: nChest,
  quizClipboard: nClipboard,
  quizBubble: nBubble,
  completedCheck: nCheck,
} as const;

export type NeutralIcon = keyof typeof NEUTRAL_ICONS;
