import * as fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadWordList, WordListError } from "./words";

const directories: string[] = [];

async function writeWords(contents: unknown): Promise<string> {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "words-"));
  directories.push(directory);
  const filePath = path.join(directory, "words.json");
  const text =
    typeof contents === "string" ? contents : JSON.stringify(contents);
  await fs.writeFile(filePath, text);
  return filePath;
}

afterEach(async () => {
  await Promise.all(
    directories
      .splice(0)
      .map((directory) => fs.rm(directory, { recursive: true, force: true })),
  );
});

describe("loadWordList", () => {
  it("normalizes letter case and surrounding spaces", async () => {
    const filePath = await writeWords({
      answers: [" Crane "],
      allowed: ["CRANE", "slate"],
    });
    await expect(loadWordList(filePath)).resolves.toEqual({
      answers: ["crane"],
      allowed: ["crane", "slate"],
    });
  });

  it("rejects malformed JSON", async () => {
    const filePath = await writeWords("{");
    await expect(loadWordList(filePath)).rejects.toBeInstanceOf(WordListError);
  });

  it("rejects words that are not five letters", async () => {
    const filePath = await writeWords({
      answers: ["cat"],
      allowed: ["cat"],
    });
    await expect(loadWordList(filePath)).rejects.toThrow(/five letters/);
  });

  it("rejects duplicates", async () => {
    const filePath = await writeWords({
      answers: ["crane", "Crane"],
      allowed: ["crane", "slate"],
    });
    await expect(loadWordList(filePath)).rejects.toThrow(/Duplicate word/);
  });

  it("rejects non-string entries", async () => {
    const filePath = await writeWords({
      answers: [1],
      allowed: ["crane"],
    });
    await expect(loadWordList(filePath)).rejects.toThrow(/only strings/);
  });

  it("loads the bundled word list", async () => {
    const words = await loadWordList(
      path.join(process.cwd(), "data", "words.json"),
    );
    expect(words.answers.length).toBeGreaterThan(0);
    expect(new Set(words.allowed)).toEqual(new Set(words.allowed));
    for (const answer of words.answers) {
      expect(words.allowed).toContain(answer);
    }
  });
});
