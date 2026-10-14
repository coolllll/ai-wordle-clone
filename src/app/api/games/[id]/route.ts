import { getPublicGame } from "@/lib/game-service";
import { toErrorResponse } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    return Response.json(await getPublicGame(id));
  } catch (error) {
    return toErrorResponse(error);
  }
}
