import { getHistory } from "@/lib/game-service";
import { toErrorResponse } from "@/lib/http";
import { requireUserId } from "@/lib/request-session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    return Response.json(await getHistory(await requireUserId(request)));
  } catch (error) {
    return toErrorResponse(error);
  }
}
