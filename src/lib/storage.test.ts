import * as fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createGameRecord } from "./game";
import { submitGuess } from "./game-service";
import { gamesFile, readStore, writeJsonAtomic } from "./storage";
import type { GameRecord } from "./types";

const directories: string[] = [];

async function useTempDir(): Promise<string> {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "word-store-"));
  directories.push(directory);
  process.env.WORDLE_DATA_DIR = directory;
  return directory;
}

async function withUnwritableDirectory(
  directory: string,
  action: () => Promise<void>,
): Promise<void> {
  await fs.chmod(directory, 0o555);
  try {
    await action();
  } finally {
    await fs.chmod(directory, 0o755);
  }
}

function playing(id = "game-1"): GameRecord {
  return createGameRecord({
    id,
    answer: "apple",
    now: new Date("2026-01-01T00:00:00.000Z"),
  });
}

afterEach(async () => {
  delete process.env.WORDLE_DATA_DIR;
  await Promise.all(
    directories
      .splice(0)
      .map((directory) => fs.rm(directory, { recursive: true, force: true })),
  );
});

describe("readStore", () => {
  it("creates and loads an empty store", async () => {
    await useTempDir();
    await expect(readStore()).resolves.toEqual({ games: [] });
    await expect(readStore()).resolves.toEqual({ games: [] });
    const parsed = JSON.parse(await fs.readFile(gamesFile(), "utf8")) as {
      games: unknown[];
    };
    expect(parsed.games).toEqual([]);
  });

  it("loads a valid store", async () => {
    await useTempDir();
    const game = playing();
    await writeJsonAtomic(gamesFile(), { games: [game] });
    await expect(readStore()).resolves.toEqual({ games: [game] });
  });

  it("rejects malformed JSON without replacing it", async () => {
    await useTempDir();
    await fs.mkdir(path.dirname(gamesFile()), { recursive: true });
    await fs.writeFile(gamesFile(), "{");
    await expect(readStore()).rejects.toThrow(/invalid and was not changed/);
    await expect(fs.readFile(gamesFile(), "utf8")).resolves.toBe("{");
  });
});

describe("writeJsonAtomic", () => {
  it("keeps the previous file when replacement fails", async () => {
    const directory = await useTempDir();
    const filePath = path.join(directory, "games.json");
    await writeJsonAtomic(filePath, { games: [] });
    await fs.writeFile(filePath, '{"ok":true}\n');

    await withUnwritableDirectory(directory, async () => {
      await expect(
        writeJsonAtomic(filePath, { games: [{ id: "new" }] }),
      ).rejects.toThrow(/not saved/);
      await expect(fs.readFile(filePath, "utf8")).resolves.toBe(
        '{"ok":true}\n',
      );
    });
  });
});

describe("completed game records", () => {
  it("reloads an in-progress game and records completion once", async () => {
    await useTempDir();
    const game = playing();
    await writeJsonAtomic(gamesFile(), { games: [game] });

    const reloaded = await readStore();
    expect(reloaded.games).toEqual([game]);

    const won = await submitGuess(game.id, "apple");
    expect(won.status).toBe("won");
    await expect(submitGuess(game.id, "apple")).rejects.toMatchObject({
      status: 409,
    });

    const stored = await readStore();
    expect(stored.games).toHaveLength(1);
    expect(stored.games[0]?.status).toBe("won");
    expect(stored.games[0]?.completionRecorded).toBe(true);
    expect(stored.games.filter((item) => item.completionRecorded)).toHaveLength(
      1,
    );
  });
});
