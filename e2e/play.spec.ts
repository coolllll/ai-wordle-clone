import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { e2eDataDir } from "./paths";

test("wins, records history, reloads, and starts another game", async ({
  page,
}) => {
  fs.rmSync(path.join(e2eDataDir, "games.json"), { force: true });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(page.getByTestId("board-row")).toHaveCount(6);
  await expect(page.getByTestId("status")).toContainText(
    "Attempts remaining: 6",
  );

  const fits = await page.evaluate(
    () =>
      document.documentElement.scrollWidth <=
      document.documentElement.clientWidth + 1,
  );
  expect(fits).toBe(true);

  const gamesFile = path.join(e2eDataDir, "games.json");
  await expect.poll(() => fs.existsSync(gamesFile)).toBe(true);
  const store = JSON.parse(fs.readFileSync(gamesFile, "utf8")) as {
    games: Array<{ answer: string }>;
  };
  const answer = store.games.at(-1)?.answer;
  expect(answer).toMatch(/^[a-z]{5}$/);

  for (const letter of answer ?? "") {
    await page.getByTestId(`key-${letter}`).click();
  }
  await page.getByTestId("key-enter").click();

  await expect(page.getByTestId("status")).toContainText("Score: 1");
  await expect(page.getByTestId("alert")).toContainText("Result saved");

  await page.goto("/history");
  await expect(page.getByTestId("history-entry").first()).toContainText(
    answer ?? "",
  );
  await expect(page.getByTestId("history-result").first()).toHaveText("won");
  await expect(page.getByTestId("history-score").first()).toContainText(
    "Score: 1",
  );

  await page.goto("/");
  await expect(page.getByTestId("status")).toContainText("Score: 1");

  await page.getByTestId("new-game").click();
  await expect(page.getByTestId("status")).toContainText(
    "Attempts remaining: 6",
  );
  await expect(page.getByTestId("tile-0-0")).toHaveText("");
});
