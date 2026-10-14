import { evaluateGuess } from "./evaluate";
import {
  MAX_GUESSES,
  WORD_LENGTH,
  type GameRecord,
  type GameStatus,
  type PublicGame,
} from "./types";

export type GuessResult =
  | { ok: true; game: GameRecord }
  | { ok: false; reason: "invalid" | "finished" };

export function createGameRecord(options: {
  id: string;
  answer: string;
  now?: Date;
  userId?: string;
}): GameRecord {
  return {
    id: options.id,
    ...(options.userId ? { userId: options.userId } : {}),
    answer: options.answer,
    guesses: [],
    status: "playing",
    createdAt: (options.now ?? new Date()).toISOString(),
    completedAt: null,
    completionRecorded: false,
  };
}

export function applyGuess(
  game: GameRecord,
  rawGuess: string,
  allowed: ReadonlySet<string>,
  now = new Date(),
): GuessResult {
  if (game.status !== "playing") {
    return { ok: false, reason: "finished" };
  }

  const guess = rawGuess.trim().toLowerCase();
  if (
    !new RegExp(`^[a-z]{${WORD_LENGTH}}$`).test(guess) ||
    !allowed.has(guess)
  ) {
    return { ok: false, reason: "invalid" };
  }

  const tiles = evaluateGuess(guess, game.answer);
  const guesses = [...game.guesses, { word: guess, tiles }];
  const won = guess === game.answer;
  const failed = !won && guesses.length >= MAX_GUESSES;
  const status: GameStatus = won ? "won" : failed ? "failed" : "playing";

  return {
    ok: true,
    game: {
      ...game,
      guesses,
      status,
      completedAt: status === "playing" ? null : now.toISOString(),
      completionRecorded: status !== "playing",
    },
  };
}

export function toPublicGame(game: GameRecord): PublicGame {
  const projection: PublicGame = {
    id: game.id,
    status: game.status,
    guesses: game.guesses.map((guess) => ({
      word: guess.word,
      tiles: [...guess.tiles],
    })),
    attemptsRemaining:
      game.status === "playing" ? MAX_GUESSES - game.guesses.length : 0,
    createdAt: game.createdAt,
    completedAt: game.completedAt,
  };

  if (game.status === "won") {
    projection.score = game.guesses.length;
    projection.answer = game.answer;
  }

  if (game.status === "failed") {
    projection.answer = game.answer;
  }

  return projection;
}
