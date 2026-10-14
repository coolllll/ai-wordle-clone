import * as fs from "node:fs/promises";
import path from "node:path";
import { WORD_LENGTH, type WordList } from "./types";

export class WordListError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WordListError";
  }
}

export function wordsFile(): string {
  return (
    process.env.WORDLE_WORDS_PATH ??
    path.join(process.cwd(), "data", "words.json")
  );
}

export async function loadWordList(filePath = wordsFile()): Promise<WordList> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    if (error instanceof WordListError) {
      throw error;
    }
    throw new WordListError("Word list JSON is invalid.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new WordListError("Word list JSON is invalid.");
  }

  const record = parsed as { answers?: unknown; allowed?: unknown };
  const answers = normalizeList(record.answers, "answers");
  const allowed = normalizeList(record.allowed, "allowed");
  const allowedSet = new Set(allowed);

  for (const answer of answers) {
    if (!allowedSet.has(answer)) {
      throw new WordListError(`Answer "${answer}" is not in the allowed list.`);
    }
  }

  return { answers, allowed };
}

function normalizeList(value: unknown, label: string): string[] {
  if (!Array.isArray(value)) {
    throw new WordListError(`${label} must be an array.`);
  }

  const normalized = value.map((entry) => {
    if (typeof entry !== "string") {
      throw new WordListError(`${label} must contain only strings.`);
    }
    return entry.trim().toLowerCase();
  });

  const seen = new Set<string>();
  for (const word of normalized) {
    if (!new RegExp(`^[a-z]{${WORD_LENGTH}}$`).test(word)) {
      throw new WordListError(`"${word}" must be five letters.`);
    }
    if (seen.has(word)) {
      throw new WordListError(`Duplicate word "${word}" in ${label}.`);
    }
    seen.add(word);
  }

  if (normalized.length === 0) {
    throw new WordListError(`${label} must not be empty.`);
  }

  return normalized;
}
