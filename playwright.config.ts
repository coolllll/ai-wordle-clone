import fs from "node:fs";
import { defineConfig } from "@playwright/test";
import { e2eDataDir } from "./e2e/paths";

fs.mkdirSync(e2eDataDir, { recursive: true });

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  use: {
    baseURL: "http://127.0.0.1:3457",
  },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3457",
    url: "http://127.0.0.1:3457",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ...process.env,
      WORDLE_DATA_DIR: e2eDataDir,
    },
  },
});
