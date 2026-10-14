import * as fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createGame, getPublicGame, submitGuess } from "./game-service";
import { writeJsonAtomic, gamesFile } from "./storage";
import { createGameRecord } from "./game";

const directories: string[] = [];

async function useTempDir(): Promise<void> {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "word-owner-"));
  directories.push(directory);
  process.env.WORDLE_DATA_DIR = directory;
}

afterEach(async () => {
  delete process.env.WORDLE_DATA_DIR;
  await Promise.all(
    directories
      .splice(0)
      .map((directory) => fs.rm(directory, { recursive: true, force: true })),
  );
});

describe("game ownership", () => {
  it("returns an owned game and hides another account's game", async () => {
    await useTempDir();
    const owned = await createGame("user-1");
    const foreign = createGameRecord({
      id: "foreign",
      answer: "lemon",
      userId: "user-2",
    });
    const unowned = createGameRecord({ id: "legacy", answer: "mango" });
    const store = JSON.parse(await fs.readFile(gamesFile(), "utf8")) as {
      games: unknown[];
    };
    store.games.push(foreign, unowned);
    await writeJsonAtomic(gamesFile(), store);

    const visible = await getPublicGame(owned.id, "user-1");
    expect(visible.status).toBe("playing");
    expect(visible.id).toBe(owned.id);

    await expect(getPublicGame("foreign", "user-1")).rejects.toMatchObject({
      status: 404,
      message: "Game not found.",
    });
    await expect(getPublicGame("legacy", "user-1")).rejects.toMatchObject({
      status: 404,
    });
    await expect(
      submitGuess("foreign", "lemon", "user-1"),
    ).rejects.toMatchObject({
      status: 404,
      message: "Game not found.",
    });

    const hidden = await getPublicGame("foreign", "user-1").catch(
      (error: Error) => error.message,
    );
    expect(hidden).not.toContain("lemon");
    expect(String(hidden)).not.toContain("playing");
  });
});
