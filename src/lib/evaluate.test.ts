import { describe, expect, it } from "vitest";
import { evaluateGuess } from "./evaluate";
import { keyboardStates } from "./feedback";

describe("evaluateGuess", () => {
  it("marks every matching position correct", () => {
    expect(evaluateGuess("crane", "crane")).toEqual([
      "correct",
      "correct",
      "correct",
      "correct",
      "correct",
    ]);
  });

  it("marks a letter present when it occurs elsewhere", () => {
    expect(evaluateGuess("audio", "crane")).toEqual([
      "present",
      "absent",
      "absent",
      "absent",
      "absent",
    ]);
  });

  it("marks letters absent when they do not occur", () => {
    expect(evaluateGuess("fuzzy", "crane")).toEqual([
      "absent",
      "absent",
      "absent",
      "absent",
      "absent",
    ]);
  });

  it("marks excess repeated letters absent after exact matches are consumed", () => {
    expect(evaluateGuess("baaaa", "aback")).toEqual([
      "present",
      "present",
      "correct",
      "absent",
      "absent",
    ]);
  });
});

describe("keyboardStates", () => {
  it("keeps the strongest known state for a letter", () => {
    expect(
      keyboardStates([
        {
          word: "bacde",
          tiles: ["present", "absent", "absent", "absent", "absent"],
        },
        {
          word: "xbyzz",
          tiles: ["absent", "correct", "absent", "absent", "absent"],
        },
      ]),
    ).toMatchObject({ b: "correct", a: "absent" });
  });
});
