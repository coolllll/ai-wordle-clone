import { getHistory } from "@/lib/game-service";
import { toErrorResponse } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json(await getHistory());
  } catch (error) {
    return toErrorResponse(error);
  }
}
