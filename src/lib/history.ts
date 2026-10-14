import type { GameRecord, HistoryEntry } from "./types";

export function toHistory(games: GameRecord[]): HistoryEntry[] {
  return games
    .filter(
      (
        game,
      ): game is GameRecord & {
        status: "won" | "failed";
        completedAt: string;
      } =>
        (game.status === "won" || game.status === "failed") &&
        game.completedAt !== null,
    )
    .sort((left, right) => right.completedAt.localeCompare(left.completedAt))
    .map((game) => ({
      id: game.id,
      completedAt: game.completedAt,
      result: game.status,
      score: game.status === "won" ? game.guesses.length : null,
      answer: game.answer,
      guesses: game.guesses.map((guess) => guess.word),
    }));
}

export function formatCompletedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
