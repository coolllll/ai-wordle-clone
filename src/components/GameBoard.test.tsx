// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { buildBoard } from "@/lib/board";
import { GameBoard } from "./GameBoard";

afterEach(() => {
  cleanup();
});

describe("GameBoard", () => {
  it("renders six rows of five tiles without a horizontal overflow rule", () => {
    render(<GameBoard rows={buildBoard([], "", "playing")} />);
    const rows = screen.getAllByTestId("board-row");
    expect(rows).toHaveLength(6);
    for (const row of rows) {
      expect(row.querySelectorAll("[data-testid^='tile-']")).toHaveLength(5);
    }
    const board = screen.getByTestId("board");
    expect(board.className).toContain("overflow-x-hidden");
    expect(board.className).toContain("max-w-full");
    Object.defineProperty(board, "clientWidth", {
      configurable: true,
      value: 320,
    });
    Object.defineProperty(board, "scrollWidth", {
      configurable: true,
      value: 320,
    });
    expect(board.scrollWidth).toBeLessThanOrEqual(board.clientWidth);
  });

  it("uses a different color set for correct, present, and absent tiles", () => {
    render(
      <GameBoard
        rows={[
          [
            { letter: "c", state: "correct" },
            { letter: "r", state: "present" },
            { letter: "a", state: "absent" },
            { letter: "", state: "empty" },
            { letter: "e", state: "filled" },
          ],
        ]}
      />,
    );
    const correct = screen.getByTestId("tile-0-0").className;
    const present = screen.getByTestId("tile-0-1").className;
    const absent = screen.getByTestId("tile-0-2").className;
    expect(correct).toContain("bg-correct");
    expect(correct).toContain("text-on-correct");
    expect(present).toContain("bg-present");
    expect(present).toContain("text-on-present");
    expect(absent).toContain("bg-absent");
    expect(absent).toContain("text-on-absent");
    expect(new Set([correct, present, absent]).size).toBe(3);
  });
});
