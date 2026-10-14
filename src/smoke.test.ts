import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("smoke", () => {
  it("runs the test runner", () => {
    expect(1 + 1).toBe(2);
  });

  it("defines theme tokens without the daisyUI plugin", () => {
    const css = fs.readFileSync(
      path.join(process.cwd(), "src/app/globals.css"),
      "utf8",
    );
    expect(css).toContain("@theme");
    expect(css).not.toContain('@plugin "daisyui"');
  });
});
