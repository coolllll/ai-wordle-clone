import * as fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  clearSessionCookieHeader,
  createSessionToken,
  sessionCookieHeader,
  userIdFromCookieHeader,
  userIdFromToken,
} from "./session";

const directories: string[] = [];

async function useTempDir(): Promise<void> {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "word-session-"));
  directories.push(directory);
  process.env.WORDLE_DATA_DIR = directory;
}

afterEach(async () => {
  delete process.env.WORDLE_DATA_DIR;
  await Promise.all(
    directories
      .splice(0)
      .map((directory) => fs.rm(directory, { recursive: true, force: true })),
  );
});

describe("session cookie", () => {
  it("accepts a cookie signed with the current key and rejects a changed cookie", async () => {
    await useTempDir();
    const token = await createSessionToken("user-1");
    expect(await userIdFromToken(token)).toBe("user-1");
    expect(sessionCookieHeader(token)).toContain("HttpOnly");

    const tampered = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;
    expect(await userIdFromToken(tampered)).toBeNull();
  });

  it("has no account on the next request after logout", async () => {
    await useTempDir();
    const token = await createSessionToken("user-1");
    const cookie = sessionCookieHeader(token).split(";")[0] ?? "";
    expect(await userIdFromCookieHeader(cookie)).toBe("user-1");

    const cleared = clearSessionCookieHeader().split(";")[0] ?? "";
    expect(await userIdFromCookieHeader(cleared)).toBeNull();
    expect(await userIdFromCookieHeader(null)).toBeNull();
  });
});
