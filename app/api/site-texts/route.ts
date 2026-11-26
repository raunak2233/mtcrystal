import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { badRequest, forbidden, ok } from "@/lib/server/http";
import { readContent, readTextOverrides, writeTextOverrides } from "@/lib/server/store";
import { CONTENT_DEFAULTS } from "@/lib/page-content";

/** The copy shown on the storefront; defaults merged with admin overrides. */
export async function GET() {
  const texts = await readContent();
  return ok({ texts });
}

/** Admin-only: saves the fields the client edited. */
export async function PUT(request: NextRequest) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Expected a JSON body");
  }

  const texts = (body as { texts?: unknown })?.texts;
  if (!texts || typeof texts !== "object" || Array.isArray(texts)) {
    return badRequest("Expected a texts object");
  }

  // Only accept known keys so a typo in a client cannot add junk rows.
  const clean: Record<string, string> = {};
  for (const [key, value] of Object.entries(texts as Record<string, unknown>)) {
    if (key in CONTENT_DEFAULTS && typeof value === "string") {
      clean[key] = value;
    }
  }

  await writeTextOverrides(clean);
  return ok({ texts: { ...CONTENT_DEFAULTS, ...(await readTextOverrides()) } });
}
