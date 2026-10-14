// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HomePage from "./page";

vi.mock("@/lib/session", () => ({
  getCurrentUser: vi.fn(async () => ({ id: "user-1", username: "ada" })),
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));

vi.mock("@/components/GameClient", () => ({
  GameClient: () => <div data-testid="game">game</div>,
}));

afterEach(() => {
  cleanup();
});

describe("HomePage", () => {
  it("shows the game and no leaderboard rows", async () => {
    render(await HomePage());
    expect(screen.getByTestId("game")).toBeInTheDocument();
    expect(screen.queryByTestId("leaderboard-row")).not.toBeInTheDocument();
  });
});
