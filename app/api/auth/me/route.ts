import { getSessionUser } from "@/lib/server/auth";
import { ok, unauthorized } from "@/lib/server/http";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return unauthorized();
  }

  return ok({ user });
}
