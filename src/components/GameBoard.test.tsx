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
});
