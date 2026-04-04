import crypto from "crypto";
import { cookies } from "next/headers";
import type { SessionUser, StoredUser } from "@/lib/types";

const SESSION_COOKIE = "mtcrystal_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSessionSecret() {
  return process.env.MT_SESSION_SECRET || "mtcrystal-local-dev-secret";
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, originalHash] = storedHash.split(":");
  if (!salt || !originalHash) {
    return false;
  }

  const hash = crypto.scryptSync(password, salt, 64);
  const original = Buffer.from(originalHash, "hex");

  if (hash.length !== original.length) {
    return false;
  }

  return crypto.timingSafeEqual(hash, original);
}

function toSessionUser(user: StoredUser): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  };
}

function sign(payload: string) {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
}

function encodeSession(user: SessionUser) {
  const payload = JSON.stringify({
    ...user,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });
  const encodedPayload = Buffer.from(payload).toString("base64url");
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

function decodeSession(token: string): SessionUser | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (actual.length !== expected.length) {
    return null;
  }
  if (!crypto.timingSafeEqual(actual, expected)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as SessionUser & { exp: number };

    if (!parsed.exp || parsed.exp < Date.now()) {
      return null;
    }

    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      isAdmin: parsed.isAdmin,
    };
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return token ? decodeSession(token) : null;
}

export async function setSession(user: StoredUser) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encodeSession(toSessionUser(user)), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function sanitizeUser(user: StoredUser): SessionUser {
  return toSessionUser(user);
}
