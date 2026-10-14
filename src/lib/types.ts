export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

export type TileState = "correct" | "present" | "absent";
export type GameStatus = "playing" | "won" | "failed";

export interface EvaluatedGuess {
  word: string;
  tiles: TileState[];
}

export interface GameRecord {
  id: string;
  answer: string;
  guesses: EvaluatedGuess[];
  status: GameStatus;
  createdAt: string;
  completedAt: string | null;
  completionRecorded: boolean;
}

export interface PublicGame {
  id: string;
  status: GameStatus;
  guesses: EvaluatedGuess[];
  attemptsRemaining: number;
  createdAt: string;
  completedAt: string | null;
  score?: number;
  answer?: string;
}

export interface HistoryEntry {
  id: string;
  completedAt: string;
  result: "won" | "failed";
  score: number | null;
  answer: string;
  guesses: string[];
}

export interface StoreData {
  games: GameRecord[];
}

export interface WordList {
  answers: string[];
  allowed: string[];
}
