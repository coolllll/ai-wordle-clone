import * as fs from "node:fs/promises";
import path from "node:path";
import type { GameRecord, StoreData, TileState } from "./types";

const TILES = new Set<TileState>(["correct", "present", "absent"]);
const STATUSES = new Set(["playing", "won", "failed"]);

export class StorageError extends Error {
  readonly code: "malformed" | "write-failed" | "unavailable";

  constructor(code: StorageError["code"], message: string) {
    super(message);
    this.name = "StorageError";
    this.code = code;
  }
}

export function dataDirectory(): string {
  return process.env.WORDLE_DATA_DIR ?? path.join(process.cwd(), "data");
}

export function gamesFile(): string {
  return path.join(dataDirectory(), "games.json");
}

let queue: Promise<void> = Promise.resolve();

export async function readStore(): Promise<StoreData> {
  const filePath = gamesFile();
  try {
    const text = await fs.readFile(filePath, "utf8");
    try {
      return parseStore(JSON.parse(text));
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(
        "malformed",
        "Saved game data is invalid and was not changed.",
      );
    }
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return createEmptyStore(filePath);
    }
    throw new StorageError(
      "unavailable",
      "Saved game data is invalid and was not changed.",
    );
  }
}

export function updateStore(
  mutator: (store: StoreData) => StoreData,
): Promise<StoreData> {
  const run = queue.then(async () => {
    const current = await readStore();
    const next = parseStore(mutator(structuredClone(current)));
    await writeJsonAtomic(gamesFile(), next);
    return next;
  });
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export async function writeJsonAtomic(
  filePath: string,
  data: unknown,
): Promise<void> {
  const directory = path.dirname(filePath);
  const temporaryPath = path.join(
    directory,
    `.${path.basename(filePath)}.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`,
  );

  try {
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(
      temporaryPath,
      `${JSON.stringify(data, null, 2)}\n`,
      "utf8",
    );
    await fs.rename(temporaryPath, filePath);
  } catch {
    await fs.rm(temporaryPath, { force: true }).catch(() => undefined);
    throw new StorageError("write-failed", "The latest result was not saved.");
  }
}

async function createEmptyStore(filePath: string): Promise<StoreData> {
  const empty: StoreData = { games: [] };
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.writeFile(filePath, `${JSON.stringify(empty, null, 2)}\n`, {
      flag: "wx",
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw new StorageError(
        "write-failed",
        "The latest result was not saved.",
      );
    }
    return readStore();
  }
  return empty;
}

export function parseStore(value: unknown): StoreData {
  if (
    !value ||
    typeof value !== "object" ||
    !Array.isArray((value as StoreData).games)
  ) {
    throw new StorageError(
      "malformed",
      "Saved game data is invalid and was not changed.",
    );
  }

  const games = (value as StoreData).games;
  if (!games.every(isGameRecord)) {
    throw new StorageError(
      "malformed",
      "Saved game data is invalid and was not changed.",
    );
  }

  const ids = new Set(games.map((game) => game.id));
  if (ids.size !== games.length) {
    throw new StorageError(
      "malformed",
      "Saved game data is invalid and was not changed.",
    );
  }

  return { games };
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function isGameRecord(value: unknown): value is GameRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const game = value as GameRecord;
  if (typeof game.id !== "string" || game.id.length === 0) {
    return false;
  }
  if (
    "userId" in game &&
    game.userId !== undefined &&
    (typeof game.userId !== "string" || game.userId.length === 0)
  ) {
    return false;
  }
  if (typeof game.answer !== "string" || !/^[a-z]{5}$/.test(game.answer)) {
    return false;
  }
  if (!STATUSES.has(game.status) || !Array.isArray(game.guesses)) {
    return false;
  }
  if (game.guesses.length > 6 || !isIsoDate(game.createdAt)) {
    return false;
  }
  if (typeof game.completionRecorded !== "boolean") {
    return false;
  }

  for (const guess of game.guesses) {
    if (
      !guess ||
      typeof guess.word !== "string" ||
      !/^[a-z]{5}$/.test(guess.word)
    ) {
      return false;
    }
    if (!Array.isArray(guess.tiles) || guess.tiles.length !== 5) {
      return false;
    }
    if (!guess.tiles.every((tile) => TILES.has(tile))) {
      return false;
    }
  }

  if (game.status === "playing") {
    return game.completedAt === null && game.completionRecorded === false;
  }

  return isIsoDate(game.completedAt) && game.completionRecorded === true;
}
