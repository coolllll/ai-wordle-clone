import { getPublicGame } from "@/lib/game-service";
import { toErrorResponse } from "@/lib/http";
import { requireUserId } from "@/lib/request-session";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    return Response.json(await getPublicGame(id, await requireUserId(request)));
  } catch (error) {
    return toErrorResponse(error);
  }
}
