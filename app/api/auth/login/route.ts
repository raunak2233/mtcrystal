import { NextRequest } from "next/server";
import { sanitizeUser, setSession, verifyPassword } from "@/lib/server/auth";
import { badRequest, ok, unauthorized } from "@/lib/server/http";
import { readUsers } from "@/lib/server/store";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email || !password) {
    return badRequest("Email and password are required");
  }

  const users = await readUsers();
  const user = users.find((item) => item.email === email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return unauthorized("Invalid email or password");
  }

  await setSession(user);
  return ok({ user: sanitizeUser(user) });
}
