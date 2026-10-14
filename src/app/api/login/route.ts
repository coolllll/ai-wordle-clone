import { authenticate } from "@/lib/accounts";
import { toErrorResponse } from "@/lib/http";
import { createSessionToken, sessionCookieHeader } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: unknown;
      password?: unknown;
    };
    const account = await authenticate(
      typeof body.username === "string" ? body.username : "",
      typeof body.password === "string" ? body.password : "",
    );
    const token = await createSessionToken(account.id);
    return Response.json(account, {
      headers: { "Set-Cookie": sessionCookieHeader(token) },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
