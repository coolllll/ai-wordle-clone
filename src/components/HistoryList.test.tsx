// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HistoryList } from "./HistoryList";
import type { HistoryEntry } from "@/lib/types";

afterEach(() => {
  cleanup();
});

const win: HistoryEntry = {
  id: "win",
  completedAt: "2026-03-02T00:00:00.000Z",
  result: "won",
  score: 3,
  answer: "apple",
  guesses: ["grape", "lemon", "apple"],
};

const loss: HistoryEntry = {
  id: "loss",
  completedAt: "2026-03-03T00:00:00.000Z",
  result: "failed",
  score: null,
  answer: "lemon",
  guesses: ["grape", "mango", "melon", "berry", "peach", "grape"],
};

describe("HistoryList", () => {
  it("shows an empty history", () => {
    render(<HistoryList entries={[]} />);
    expect(screen.getByTestId("history-empty")).toHaveTextContent(
      "No completed games yet.",
    );
  });

  it("shows a won game score and a failed game without a numeric score, newest first", () => {
    render(<HistoryList entries={[loss, win]} />);
    const results = screen
      .getAllByTestId("history-result")
      .map((node) => node.textContent);
    expect(results).toEqual(["failed", "won"]);
    expect(screen.getByTestId("history-score")).toHaveTextContent("Score: 3");
    expect(
      screen.getAllByTestId("history-answer").map((node) => node.textContent),
    ).toEqual(["lemon", "apple"]);
    const guesses = screen.getAllByTestId("history-guesses");
    expect(guesses[0]).toHaveTextContent("grape");
    expect(guesses[1]).toHaveTextContent("lemon");
    expect(screen.queryByText("Score: null")).not.toBeInTheDocument();
  });
});
