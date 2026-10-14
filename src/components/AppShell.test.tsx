// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AppShell } from "./AppShell";

afterEach(() => {
  cleanup();
});

describe("AppShell", () => {
  it("renders a daisyUI control for the emerald theme", () => {
    render(
      <AppShell>
        <p>Play</p>
      </AppShell>,
    );
    const history = screen.getByRole("link", { name: "History" });
    expect(history.className).toContain("btn");
    expect(history.className).toContain("btn-primary");
    expect(document.documentElement.innerHTML).toContain("Play");
  });
});
