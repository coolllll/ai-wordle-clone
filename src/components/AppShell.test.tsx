// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AppShell } from "./AppShell";

afterEach(() => {
  cleanup();
});

describe("AppShell", () => {
  it("renders an actionable History link without daisyUI button classes", () => {
    render(
      <AppShell username="ada">
        <p>Play</p>
      </AppShell>,
    );
    expect(screen.getByTestId("current-user")).toHaveTextContent("ada");
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
    const history = screen.getByRole("link", { name: "History" });
    expect(history).toHaveAttribute("href", "/history");
    const leaderboard = screen.getByRole("link", { name: "Leaderboard" });
    expect(leaderboard).toHaveAttribute("href", "/leaderboard");
    expect(history.className).not.toContain("btn");
    expect(history.className).not.toContain("btn-primary");
    expect(document.documentElement.innerHTML).toContain("Play");
  });
});
