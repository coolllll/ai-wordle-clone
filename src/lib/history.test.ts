import { describe, expect, it } from "vitest";
import { createGameRecord } from "./game";
import { toHistory } from "./history";
import type { GameRecord } from "./types";

function completed(
  overrides: Partial<GameRecord> &
    Pick<GameRecord, "id" | "status" | "completedAt">,
): GameRecord {
  return {
    ...createGameRecord({
      id: overrides.id,
      answer: overrides.answer ?? "apple",
      now: new Date("2026-01-01T00:00:00.000Z"),
      userId: overrides.userId ?? "user-1",
    }),
    guesses: overrides.guesses ?? [
      {
        word: "apple",
        tiles: ["correct", "correct", "correct", "correct", "correct"],
      },
    ],
    status: overrides.status,
    completedAt: overrides.completedAt,
    completionRecorded: true,
  };
}

describe("toHistory", () => {
  it("lists completed games newest first and scores only wins", () => {
    const history = toHistory(
      [
        completed({
          id: "older-win",
          status: "won",
          completedAt: "2026-01-01T00:00:00.000Z",
          guesses: [
            {
              word: "grape",
              tiles: ["absent", "absent", "present", "absent", "absent"],
            },
            {
              word: "apple",
              tiles: ["correct", "correct", "correct", "correct", "correct"],
            },
          ],
        }),
        completed({
          id: "newer-loss",
          status: "failed",
          completedAt: "2026-02-01T00:00:00.000Z",
          answer: "lemon",
          guesses: [
            {
              word: "grape",
              tiles: ["absent", "present", "absent", "absent", "absent"],
            },
            {
              word: "mango",
              tiles: ["absent", "absent", "absent", "absent", "absent"],
            },
            {
              word: "melon",
              tiles: ["present", "present", "absent", "absent", "absent"],
            },
            {
              word: "berry",
              tiles: ["absent", "present", "absent", "absent", "absent"],
            },
            {
              word: "peach",
              tiles: ["absent", "absent", "absent", "absent", "absent"],
            },
            {
              word: "grape",
              tiles: ["absent", "present", "absent", "absent", "absent"],
            },
          ],
        }),
        createGameRecord({ id: "active", answer: "apple", userId: "user-1" }),
        completed({
          id: "other-account",
          status: "won",
          completedAt: "2026-03-01T00:00:00.000Z",
          userId: "user-2",
        }),
        (() => {
          const unowned = completed({
            id: "unowned",
            status: "won",
            completedAt: "2026-03-02T00:00:00.000Z",
          });
          delete unowned.userId;
          return unowned;
        })(),
      ],
      "user-1",
    );

    expect(history.map((entry) => entry.id)).toEqual([
      "newer-loss",
      "older-win",
    ]);
    expect(history[0]).toMatchObject({
      result: "failed",
      score: null,
      answer: "lemon",
      guesses: ["grape", "mango", "melon", "berry", "peach", "grape"],
    });
    expect(history[1]).toMatchObject({
      result: "won",
      score: 2,
      answer: "apple",
      guesses: ["grape", "apple"],
    });
  });
});
