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
      <AppShell>
        <p>Play</p>
      </AppShell>,
    );
    const history = screen.getByRole("link", { name: "History" });
    expect(history).toHaveAttribute("href", "/history");
    expect(history.className).not.toContain("btn");
    expect(history.className).not.toContain("btn-primary");
    expect(document.documentElement.innerHTML).toContain("Play");
  });
});
