import * as fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { POST as createGame } from "./games/route";
import { GET as getGame } from "./games/[id]/route";
import { POST as postGuess } from "./games/[id]/guesses/route";
import { GET as getHistory } from "./history/route";
import { gamesFile } from "@/lib/storage";
import type { GameRecord, PublicGame } from "@/lib/types";

const directories: string[] = [];

async function useTempDir(): Promise<string> {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "word-api-"));
  directories.push(directory);
  process.env.WORDLE_DATA_DIR = directory;
  return directory;
}

async function readGames(): Promise<GameRecord[]> {
  const parsed = JSON.parse(await fs.readFile(gamesFile(), "utf8")) as {
    games: GameRecord[];
  };
  return parsed.games;
}

function guessRequest(id: string, guess: unknown): Request {
  return new Request(`http://localhost/api/games/${id}/guesses`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ guess }),
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

describe("game API", () => {
  it("creates a public game without the answer", async () => {
    await useTempDir();
    const response = await createGame();
    const body = (await response.json()) as PublicGame;
    expect(response.status).toBe(200);
    expect(body.status).toBe("playing");
    expect(body.guesses).toEqual([]);
    expect(body).not.toHaveProperty("answer");

    const stored = await readGames();
    expect(stored).toHaveLength(1);
    expect(JSON.stringify(body)).not.toContain(stored[0].answer);
  });

  it("restores a game, accepts a valid guess, and rejects invalid, missing, and finished games", async () => {
    await useTempDir();
    const created = (await (await createGame()).json()) as PublicGame;
    const stored = await readGames();
    const answer = stored[0].answer;

    const restored = await getGame(new Request("http://localhost"), {
      params: Promise.resolve({ id: created.id }),
    });
    const restoredBody = (await restored.json()) as PublicGame;
    expect(restored.status).toBe(200);
    expect(restoredBody.id).toBe(created.id);
    expect(restoredBody).not.toHaveProperty("answer");

    const invalid = await postGuess(guessRequest(created.id, "zzzzz"), {
      params: Promise.resolve({ id: created.id }),
    });
    expect(invalid.status).toBe(400);
    expect((await readGames())[0].guesses).toHaveLength(0);

    const won = await postGuess(guessRequest(created.id, answer), {
      params: Promise.resolve({ id: created.id }),
    });
    const wonBody = (await won.json()) as PublicGame;
    expect(won.status).toBe(200);
    expect(wonBody.status).toBe("won");
    expect(wonBody.answer).toBe(answer);
    expect(wonBody.score).toBe(1);

    const finished = await postGuess(guessRequest(created.id, answer), {
      params: Promise.resolve({ id: created.id }),
    });
    expect(finished.status).toBe(409);
    expect(
      (await readGames()).filter((game) => game.completionRecorded),
    ).toHaveLength(1);

    const missing = await postGuess(guessRequest("missing", answer), {
      params: Promise.resolve({ id: "missing" }),
    });
    expect(missing.status).toBe(404);

    const missingGet = await getGame(new Request("http://localhost"), {
      params: Promise.resolve({ id: "missing" }),
    });
    expect(missingGet.status).toBe(404);
  });

  it("returns completed games newest first", async () => {
    await useTempDir();
    const older: GameRecord = {
      id: "older",
      answer: "apple",
      guesses: [
        {
          word: "apple",
          tiles: ["correct", "correct", "correct", "correct", "correct"],
        },
      ],
      status: "won",
      createdAt: "2026-01-01T00:00:00.000Z",
      completedAt: "2026-01-01T01:00:00.000Z",
      completionRecorded: true,
    };
    const newer: GameRecord = {
      id: "newer",
      answer: "lemon",
      guesses: Array.from({ length: 6 }, () => ({
        word: "grape",
        tiles: [
          "absent",
          "absent",
          "absent",
          "absent",
          "absent",
        ] as GameRecord["guesses"][number]["tiles"],
      })),
      status: "failed",
      createdAt: "2026-02-01T00:00:00.000Z",
      completedAt: "2026-02-01T01:00:00.000Z",
      completionRecorded: true,
    };
    await fs.mkdir(path.dirname(gamesFile()), { recursive: true });
    await fs.writeFile(gamesFile(), JSON.stringify({ games: [older, newer] }));

    const response = await getHistory();
    expect(response.status).toBe(200);
    const body = (await response.json()) as Array<{
      id: string;
      result: string;
      score: number | null;
      answer: string;
      guesses: string[];
      completedAt: string;
    }>;
    expect(body.map((entry) => entry.id)).toEqual(["newer", "older"]);
    expect(body[0]).toMatchObject({
      result: "failed",
      score: null,
      answer: "lemon",
      completedAt: "2026-02-01T01:00:00.000Z",
    });
    expect(body[0].guesses).toHaveLength(6);
    expect(body[1]).toMatchObject({ result: "won", score: 1, answer: "apple" });
  });

  it("does not report success when saving a guess fails", async () => {
    const directory = await useTempDir();
    const created = (await (await createGame()).json()) as PublicGame;
    const answer = (await readGames())[0].answer;
    const before = await fs.readFile(gamesFile(), "utf8");
    await fs.chmod(directory, 0o555);

    try {
      const response = await postGuess(guessRequest(created.id, answer), {
        params: Promise.resolve({ id: created.id }),
      });
      const body = (await response.json()) as { error: string };

      expect(response.status).toBe(500);
      expect(body.error).toBe("The latest result was not saved.");
      expect(body.error.toLowerCase()).not.toContain("success");
      await expect(fs.readFile(gamesFile(), "utf8")).resolves.toBe(before);
    } finally {
      await fs.chmod(directory, 0o755);
    }
  });
});
