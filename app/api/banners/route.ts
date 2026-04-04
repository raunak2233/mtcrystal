import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { badRequest, forbidden, ok } from "@/lib/server/http";
import { readBanners, writeBanners } from "@/lib/server/store";
import { normalizeBanner, validateBanner } from "@/lib/server/validators";

export async function GET() {
  const banners = await readBanners();
  return ok({ banners });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  const banner = normalizeBanner(await request.json());
  const validationError = validateBanner(banner);
  if (validationError) {
    return badRequest(validationError);
  }

  const banners = await readBanners();
  banners.push(banner);
  await writeBanners(banners);
  return ok({ banner }, { status: 201 });
}
