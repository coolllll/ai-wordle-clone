import {
  MAX_GUESSES,
  WORD_LENGTH,
  type EvaluatedGuess,
  type GameStatus,
  type TileState,
} from "./types";

export type BoardTileState = TileState | "filled" | "empty";

export interface BoardCell {
  letter: string;
  state: BoardTileState;
}

export function buildBoard(
  guesses: EvaluatedGuess[],
  draft: string,
  status: GameStatus,
): BoardCell[][] {
  const rows: BoardCell[][] = [];

  for (let row = 0; row < MAX_GUESSES; row += 1) {
    const guess = guesses[row];
    if (guess) {
      rows.push(
        guess.word.split("").map((letter, index) => ({
          letter,
          state: guess.tiles[index],
        })),
      );
      continue;
    }

    if (row === guesses.length && status === "playing") {
      const letters = draft.slice(0, WORD_LENGTH).split("");
      rows.push(
        Array.from({ length: WORD_LENGTH }, (_, index) => ({
          letter: letters[index] ?? "",
          state: letters[index] ? "filled" : "empty",
        })),
      );
      continue;
    }

    rows.push(
      Array.from({ length: WORD_LENGTH }, () => ({
        letter: "",
        state: "empty" as const,
      })),
    );
  }

  return rows;
}
