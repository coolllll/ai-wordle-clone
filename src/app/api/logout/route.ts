import { clearSessionCookieHeader } from "@/lib/session";

export const dynamic = "force-dynamic";

export function POST() {
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/login",
      "Set-Cookie": clearSessionCookieHeader(),
    },
  });
}
