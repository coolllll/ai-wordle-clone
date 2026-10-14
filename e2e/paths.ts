import os from "node:os";
import path from "node:path";

export const e2eDataDir = path.join(os.tmpdir(), "word-guess-playwright");
