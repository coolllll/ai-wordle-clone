import * as fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { authenticate, registerAccount, usersFile } from "./accounts";

const directories: string[] = [];

async function useTempDir(): Promise<void> {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "word-users-"));
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

describe("registerAccount", () => {
  it("creates an account and stores only a password hash", async () => {
    await useTempDir();
    const account = await registerAccount("ada", "secret-pass");

    expect(account).toMatchObject({ username: "ada" });
    expect(account.id).toEqual(expect.any(String));
    expect(account).not.toHaveProperty("passwordHash");
    expect(JSON.stringify(account)).not.toContain("secret-pass");

    const stored = JSON.parse(await fs.readFile(usersFile(), "utf8")) as {
      users: Array<{ username: string; passwordHash: string }>;
    };
    expect(stored.users).toHaveLength(1);
    expect(stored.users[0]?.passwordHash).not.toBe("secret-pass");
    expect(stored.users[0]?.passwordHash.length).toBeGreaterThan(0);
  });

  it("does not create a second account for a duplicate username", async () => {
    await useTempDir();
    await registerAccount("ada", "secret-pass");

    await expect(registerAccount("ada", "another-pass")).rejects.toThrow(
      /already in use/,
    );

    const stored = JSON.parse(await fs.readFile(usersFile(), "utf8")) as {
      users: unknown[];
    };
    expect(stored.users).toHaveLength(1);
  });
});

describe("authenticate", () => {
  it("accepts the matching password and rejects a wrong username or password", async () => {
    await useTempDir();
    await registerAccount("ada", "secret-pass");

    const account = await authenticate("ada", "secret-pass");
    expect(account).toMatchObject({ username: "ada" });
    expect(account).not.toHaveProperty("passwordHash");
    expect(JSON.stringify(account)).not.toContain("secret-pass");

    await expect(authenticate("ada", "wrong-pass")).rejects.toThrow(
      /incorrect/,
    );
    await expect(authenticate("nobody", "secret-pass")).rejects.toThrow(
      /incorrect/,
    );
  });
});
