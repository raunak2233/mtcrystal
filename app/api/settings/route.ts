import { getSessionUser } from "@/lib/server/auth";
import { badRequest, forbidden, ok } from "@/lib/server/http";
import { readSettings, writeSettings } from "@/lib/server/store";
import { normalizeSettings, validateSettings } from "@/lib/server/validators";

export async function GET() {
  const settings = await readSettings();
  return ok({ settings });
}

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  const current = await readSettings();
  const settings = normalizeSettings({ ...current, ...(await request.json()) });

  const validationError = validateSettings(settings);
  if (validationError) {
    return badRequest(validationError);
  }

  await writeSettings(settings);
  return ok({ settings });
}
