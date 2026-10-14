// @vitest-environment jsdom
import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import GameLayout from "./layout";

vi.mock("@/lib/session", () => ({
  getCurrentUser: vi.fn(async () => null),
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));

afterEach(() => {
  cleanup();
});

describe("GameLayout", () => {
  it("sends a signed-out game page to login without showing the board", async () => {
    await expect(
      GameLayout({
        children: <div data-testid="board">board</div>,
      }),
    ).rejects.toThrow("REDIRECT:/login");
    expect(screen.queryByTestId("board")).not.toBeInTheDocument();
  });
});
