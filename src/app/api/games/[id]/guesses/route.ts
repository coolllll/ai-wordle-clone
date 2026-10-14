import { submitGuess } from "@/lib/game-service";
import { toErrorResponse } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const guess = await readGuess(request);
    return Response.json(await submitGuess(id, guess));
  } catch (error) {
    return toErrorResponse(error);
  }
}

async function readGuess(request: Request): Promise<unknown> {
  try {
    const body = (await request.json()) as { guess?: unknown };
    return body.guess;
  } catch {
    return undefined;
  }
}
