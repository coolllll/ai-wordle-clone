import { applyGuess, createGameRecord, toPublicGame } from "./game";
import { toHistory } from "./history";
import { readStore, StorageError, updateStore } from "./storage";
import type { HistoryEntry, PublicGame } from "./types";
import { loadWordList, wordsFile } from "./words";

export class GameRequestError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "GameRequestError";
    this.status = status;
  }
}

export async function createGame(): Promise<PublicGame> {
  const words = await loadWordList(wordsFile());
  const answer =
    words.answers[Math.floor(Math.random() * words.answers.length)];
  const record = createGameRecord({
    id: crypto.randomUUID(),
    answer,
  });

  await updateStore((store) => {
    store.games.push(record);
    return store;
  });

  return toPublicGame(record);
}

export async function getPublicGame(id: string): Promise<PublicGame> {
  const store = await readStore();
  const game = store.games.find((item) => item.id === id);
  if (!game) {
    throw new GameRequestError(404, "Game not found.");
  }
  return toPublicGame(game);
}

export async function submitGuess(
  id: string,
  guess: unknown,
): Promise<PublicGame> {
  if (typeof guess !== "string") {
    throw new GameRequestError(
      400,
      "Guess must be an allowed five-letter word.",
    );
  }

  const words = await loadWordList(wordsFile());
  const allowed = new Set(words.allowed);
  const store = await updateStore((current) => {
    const index = current.games.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new GameRequestError(404, "Game not found.");
    }

    const result = applyGuess(current.games[index], guess, allowed);
    if (!result.ok && result.reason === "invalid") {
      throw new GameRequestError(
        400,
        "Guess must be an allowed five-letter word.",
      );
    }
    if (!result.ok) {
      throw new GameRequestError(409, "This game is already finished.");
    }

    current.games[index] = result.game;
    return current;
  });

  const game = store.games.find((item) => item.id === id);
  if (!game) {
    throw new GameRequestError(404, "Game not found.");
  }
  return toPublicGame(game);
}

export async function getHistory(): Promise<HistoryEntry[]> {
  const store = await readStore();
  return toHistory(store.games);
}

export function isStorageError(error: unknown): error is StorageError {
  return error instanceof StorageError;
}
