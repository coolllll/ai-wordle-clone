import { WORD_LENGTH, type TileState } from "./types";

export function evaluateGuess(guess: string, answer: string): TileState[] {
  const tiles: TileState[] = Array.from(
    { length: WORD_LENGTH },
    () => "absent",
  );
  const remaining = new Map<string, number>();

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    if (guess[index] === answer[index]) {
      tiles[index] = "correct";
    } else {
      const letter = answer[index];
      remaining.set(letter, (remaining.get(letter) ?? 0) + 1);
    }
  }

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    if (tiles[index] === "correct") {
      continue;
    }
    const letter = guess[index];
    const count = remaining.get(letter) ?? 0;
    if (count > 0) {
      tiles[index] = "present";
      remaining.set(letter, count - 1);
    }
  }

  return tiles;
}
