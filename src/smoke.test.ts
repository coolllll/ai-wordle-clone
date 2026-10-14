import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("smoke", () => {
  it("runs the test runner", () => {
    expect(1 + 1).toBe(2);
  });

  it("enables the daisyUI emerald theme", () => {
    const css = fs.readFileSync(
      path.join(process.cwd(), "src/app/globals.css"),
      "utf8",
    );
    expect(css).toContain('@plugin "daisyui"');
    expect(css).toContain("emerald --default");
  });
});
