import { NextRequest } from "next/server";
import { hashPassword, sanitizeUser, setSession, getAdminEmails } from "@/lib/server/auth";
import { badRequest, ok, serverError } from "@/lib/server/http";
import { readUsers, writeUsers } from "@/lib/server/store";
import { createId } from "@/lib/server/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!name || !email || !password) {
      return badRequest("Name, email, and password are required");
    }

    if (password.length < 6) {
      return badRequest("Password must be at least 6 characters");
    }

    const users = await readUsers();
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      return badRequest("An account with this email already exists", 409);
    }

    const adminEmails = getAdminEmails();
    const isAdmin = users.length === 0 || adminEmails.includes(email);
    const user = {
      id: createId(),
      name,
      email,
      passwordHash: hashPassword(password),
      isAdmin,
      phone: "",
      addresses: [],
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    await writeUsers(users);
    await setSession(user);

    return ok({ user: sanitizeUser(user) }, { status: 201 });
  } catch (error) {
    console.error("Register failed", error);
    return serverError("Unable to create account");
  }
}
