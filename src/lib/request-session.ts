import { GameRequestError } from "./game-service";
import { userIdFromCookieHeader } from "./session";

export async function requireUserId(request: Request): Promise<string> {
  const userId = await userIdFromCookieHeader(request.headers.get("cookie"));
  if (!userId) {
    throw new GameRequestError(401, "Sign in required.");
  }
  return userId;
}
