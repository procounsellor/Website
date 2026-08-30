/**
 * The hue each game answers to.
 *
 * Separate from GameMark because it is imported by cards and panels that draw
 * no mark at all — and because a module that exports both a component and its
 * constants breaks fast refresh.
 *
 * `ink` is the only one strong enough for text; `tint` and `edge` are the
 * surface pair. A game keeps its hue everywhere it appears, so the rack, the
 * daily card and the "Today" ribbon are recognisably the same game.
 */

export type GameTone = 'purple' | 'blue' | 'green' | 'gold' | 'rose';

export const GAME_TONE: Record<string, GameTone> = {
  quiz: 'purple',
  sudoku: 'blue',
  word_guess: 'green',
  myth_fact: 'gold',
  flag_guess: 'rose',
};

export const TONE: Record<GameTone, { ink: string; tint: string; edge: string }> = {
  purple: { ink: '#5A38E8', tint: '#EFEAFF', edge: '#DCD2FF' },
  blue: { ink: '#2563EB', tint: '#E6F0FF', edge: '#CFE1FF' },
  green: { ink: '#16A34A', tint: '#E3FBEC', edge: '#C6F1D7' },
  gold: { ink: '#B45309', tint: '#FFF3D9', edge: '#FAE3B0' },
  rose: { ink: '#DB2777', tint: '#FFE8F3', edge: '#FBD0E4' },
};

/** A game the backend adds later still gets a hue rather than a blank. */
export const toneFor = (gameId: string): GameTone => GAME_TONE[gameId] ?? 'purple';
