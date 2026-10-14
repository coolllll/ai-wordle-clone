import { AccountError } from "./accounts";
import { GameRequestError } from "./game-service";
import { StorageError } from "./storage";

export function toErrorResponse(error: unknown): Response {
  if (error instanceof GameRequestError || error instanceof AccountError) {
    return Response.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof StorageError) {
    const message =
      error.code === "write-failed"
        ? "The latest result was not saved."
        : "Saved game data is invalid and was not changed.";
    return Response.json({ error: message }, { status: 500 });
  }

  return Response.json(
    { error: "The latest result was not saved." },
    { status: 500 },
  );
}
