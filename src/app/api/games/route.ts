import { createGame } from "@/lib/game-service";
import { toErrorResponse } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    return Response.json(await createGame());
  } catch (error) {
    return toErrorResponse(error);
  }
}
