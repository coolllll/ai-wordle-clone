// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import LeaderboardPage from "./page";
import type { GameRecord } from "@/lib/types";

const { readStore, listPublicAccounts } = vi.hoisted(() => ({
  readStore: vi.fn(),
  listPublicAccounts: vi.fn(),
}));

vi.mock("@/lib/storage", () => ({
  readStore,
}));

vi.mock("@/lib/accounts", () => ({
  listPublicAccounts,
}));

afterEach(() => {
  cleanup();
  readStore.mockReset();
  listPublicAccounts.mockReset();
});

function won(id: string, userId: string, guesses: number): GameRecord {
  return {
    id,
    userId,
    answer: "apple",
    guesses: Array.from({ length: guesses }, () => ({
      word: "apple",
      tiles: ["correct", "correct", "correct", "correct", "correct"],
    })),
    status: "won",
    createdAt: "2026-01-01T00:00:00.000Z",
    completedAt: "2026-01-02T00:00:00.000Z",
    completionRecorded: true,
  };
}

describe("LeaderboardPage", () => {
  it("shows ranked rows without answers or guesses", async () => {
    readStore.mockResolvedValue({
      games: [won("slow", "bea", 4), won("fast", "ada", 2)],
    });
    listPublicAccounts.mockResolvedValue([
      { id: "ada", username: "ada" },
      { id: "bea", username: "bea" },
    ]);

    render(await LeaderboardPage());

    expect(
      screen.getByRole("heading", { name: "Leaderboard" }),
    ).toBeInTheDocument();
    const rows = screen.getAllByTestId("leaderboard-row");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent("1");
    expect(rows[0]).toHaveTextContent("ada");
    expect(rows[0]).toHaveTextContent("Score: 2");
    expect(screen.queryByText("apple")).not.toBeInTheDocument();
    expect(screen.queryByTestId("leaderboard-empty")).not.toBeInTheDocument();
  });

  it("shows an empty leaderboard when nobody has won", async () => {
    readStore.mockResolvedValue({ games: [] });
    listPublicAccounts.mockResolvedValue([]);

    render(await LeaderboardPage());

    expect(
      screen.getByRole("heading", { name: "Leaderboard" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("leaderboard-empty")).toHaveTextContent(
      "No wins yet.",
    );
    expect(screen.queryByTestId("leaderboard-row")).not.toBeInTheDocument();
  });

  it("shows a load error and no rows when storage cannot be read", async () => {
    readStore.mockRejectedValue(new Error("unreadable"));
    listPublicAccounts.mockResolvedValue([]);

    render(await LeaderboardPage());

    expect(screen.getByRole("alert")).toHaveTextContent(
      "The leaderboard could not be loaded.",
    );
    expect(screen.queryByTestId("leaderboard-row")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Leaderboard" }),
    ).not.toBeInTheDocument();
  });
});
