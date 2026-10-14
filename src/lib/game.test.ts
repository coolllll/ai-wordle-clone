import { describe, expect, it } from "vitest";
import { applyGuess, createGameRecord, toPublicGame } from "./game";

const allowed = new Set(["apple", "grape", "lemon", "mango", "melon", "berry"]);
const wrong = ["grape", "lemon", "mango", "melon", "berry", "grape"];

function playing() {
  return createGameRecord({
    id: "game-1",
    answer: "apple",
    now: new Date("2026-01-01T00:00:00.000Z"),
  });
}

describe("applyGuess", () => {
  it("does not consume an attempt for an invalid guess", () => {
    const game = playing();
    const result = applyGuess(game, "zzzzz", allowed);
    expect(result).toEqual({ ok: false, reason: "invalid" });
    expect(game.guesses).toHaveLength(0);
    expect(game.status).toBe("playing");
  });

  it("wins on every attempt from 1 through 6 and scores that attempt", () => {
    for (let winAt = 1; winAt <= 6; winAt += 1) {
      let game = playing();
      for (let attempt = 1; attempt < winAt; attempt += 1) {
        const result = applyGuess(game, wrong[attempt - 1], allowed);
        expect(result.ok).toBe(true);
        if (result.ok) {
          game = result.game;
        }
      }
      const won = applyGuess(
        game,
        "apple",
        allowed,
        new Date("2026-01-02T00:00:00.000Z"),
      );
      expect(won.ok).toBe(true);
      if (!won.ok) {
        continue;
      }
      expect(won.game.status).toBe("won");
      expect(won.game.guesses).toHaveLength(winAt);
      expect(toPublicGame(won.game).score).toBe(winAt);
      expect(toPublicGame(won.game).answer).toBe("apple");
    }
  });

  it("fails on the sixth accepted guess without a numeric score", () => {
    let game = playing();
    for (const word of wrong) {
      const result = applyGuess(game, word, allowed);
      expect(result.ok).toBe(true);
      if (result.ok) {
        game = result.game;
      }
    }
    expect(game.status).toBe("failed");
    expect(game.guesses).toHaveLength(6);
    const projection = toPublicGame(game);
    expect(projection.answer).toBe("apple");
    expect(projection.score).toBeUndefined();
    expect(JSON.stringify(projection)).not.toContain('"score"');
  });

  it("rejects a guess after the game is finished", () => {
    const won = applyGuess(playing(), "apple", allowed);
    expect(won.ok).toBe(true);
    if (!won.ok) {
      return;
    }
    expect(applyGuess(won.game, "grape", allowed)).toEqual({
      ok: false,
      reason: "finished",
    });
    expect(won.game.guesses).toHaveLength(1);
  });
});

describe("toPublicGame", () => {
  it("omits the answer while the game is still playing", () => {
    const projection = toPublicGame(playing());
    expect(projection).not.toHaveProperty("answer");
    expect(JSON.parse(JSON.stringify(projection))).not.toHaveProperty("answer");
    expect(JSON.stringify(projection)).not.toContain("apple");
  });
});
