import { createGame } from "@/lib/game-service";
import { toErrorResponse } from "@/lib/http";
import { requireUserId } from "@/lib/request-session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    return Response.json(await createGame(await requireUserId(request)));
  } catch (error) {
    return toErrorResponse(error);
  }
}
