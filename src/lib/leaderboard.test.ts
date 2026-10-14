import { describe, expect, it } from "vitest";
import { createGameRecord } from "./game";
import { toLeaderboard } from "./leaderboard";
import type { GameRecord } from "./types";

function guess(word: string): GameRecord["guesses"][number] {
  return {
    word,
    tiles: ["correct", "correct", "correct", "correct", "correct"],
  };
}

function finished(
  overrides: Partial<GameRecord> &
    Pick<GameRecord, "id" | "status" | "completedAt" | "userId">,
): GameRecord {
  return {
    ...createGameRecord({
      id: overrides.id,
      answer: overrides.answer ?? "apple",
      userId: overrides.userId,
    }),
    guesses: overrides.guesses ?? [guess("apple")],
    status: overrides.status,
    completedAt: overrides.completedAt,
    completionRecorded: true,
  };
}

const accounts = [
  { id: "ada", username: "ada" },
  { id: "bea", username: "bea" },
  { id: "cy", username: "cy" },
];

describe("toLeaderboard", () => {
  it("ranks a lower winning score first and omits losses and unknown accounts", () => {
    const rows = toLeaderboard(
      [
        finished({
          id: "ada-win",
          userId: "ada",
          status: "won",
          completedAt: "2026-02-01T00:00:00.000Z",
          guesses: [guess("grape"), guess("apple")],
          answer: "apple",
        }),
        finished({
          id: "bea-win",
          userId: "bea",
          status: "won",
          completedAt: "2026-01-01T00:00:00.000Z",
          guesses: [guess("a"), guess("b"), guess("c"), guess("apple")],
        }),
        finished({
          id: "cy-loss",
          userId: "cy",
          status: "failed",
          completedAt: "2026-01-02T00:00:00.000Z",
          guesses: Array.from({ length: 6 }, () => guess("grape")),
        }),
        finished({
          id: "ghost",
          userId: "gone",
          status: "won",
          completedAt: "2026-01-01T00:00:00.000Z",
        }),
      ],
      accounts,
    );

    expect(rows).toEqual([
      { rank: 1, username: "ada", score: 2 },
      { rank: 2, username: "bea", score: 4 },
    ]);
    expect(JSON.stringify(rows)).not.toContain("apple");
    expect(JSON.stringify(rows)).not.toContain("grape");
  });

  it("keeps an account's best win when that account has several", () => {
    const rows = toLeaderboard(
      [
        finished({
          id: "slow",
          userId: "ada",
          status: "won",
          completedAt: "2026-01-01T00:00:00.000Z",
          guesses: [
            guess("a"),
            guess("b"),
            guess("c"),
            guess("d"),
            guess("apple"),
          ],
        }),
        finished({
          id: "fast",
          userId: "ada",
          status: "won",
          completedAt: "2026-03-01T00:00:00.000Z",
          guesses: [guess("grape"), guess("apple")],
        }),
      ],
      accounts,
    );

    expect(rows).toEqual([{ rank: 1, username: "ada", score: 2 }]);
  });

  it("breaks equal scores by the earlier best win, then by stored username", () => {
    const rows = toLeaderboard(
      [
        finished({
          id: "bea-early",
          userId: "bea",
          status: "won",
          completedAt: "2026-01-01T00:00:00.000Z",
          guesses: [guess("a"), guess("b"), guess("apple")],
        }),
        finished({
          id: "ada-late",
          userId: "ada",
          status: "won",
          completedAt: "2026-02-01T00:00:00.000Z",
          guesses: [guess("a"), guess("b"), guess("apple")],
        }),
        finished({
          id: "cy-tie",
          userId: "cy",
          status: "won",
          completedAt: "2026-02-01T00:00:00.000Z",
          guesses: [guess("a"), guess("b"), guess("apple")],
        }),
      ],
      accounts,
    );

    expect(rows).toEqual([
      { rank: 1, username: "bea", score: 3 },
      { rank: 2, username: "ada", score: 3 },
      { rank: 3, username: "cy", score: 3 },
    ]);
  });
});
