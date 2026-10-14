import type { EvaluatedGuess, TileState } from "./types";

const RANK: Record<TileState, number> = {
  absent: 1,
  present: 2,
  correct: 3,
};

export function keyboardStates(
  guesses: EvaluatedGuess[],
): Partial<Record<string, TileState>> {
  const states: Partial<Record<string, TileState>> = {};
  for (const guess of guesses) {
    guess.word.split("").forEach((letter, index) => {
      const next = guess.tiles[index];
      const current = states[letter];
      if (!current || RANK[next] > RANK[current]) {
        states[letter] = next;
      }
    });
  }
  return states;
}
