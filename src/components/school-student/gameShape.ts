/**
 * How many things a game actually asks you to do.
 *
 * Separate from TodaysDrop for the same reason gameTones is: a module that
 * exports both a component and a plain function breaks fast refresh, and this
 * one is imported by the play page and the daily card alike.
 *
 * The distinction it draws is not cosmetic. A quiz set's `itemCount` is its
 * number of questions and reads correctly as "10 questions". A Sudoku's is 81
 * cells and a Career Word's is a letter budget, and printing either as a
 * question count told a student the Number Grid had eighty-one questions. Those
 * two engines are one activity each, however many boxes they contain.
 */
export const gameActivityCount = (
  engine: string | null | undefined,
  itemCount: number | null | undefined,
  fetchedCount = 0,
) => (engine === 'sudoku_v1' || engine === 'word_guess_v1'
  ? 1
  : itemCount || fetchedCount || null);
