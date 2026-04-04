import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { badRequest, forbidden, notFound, ok } from "@/lib/server/http";
import { readBanners, writeBanners } from "@/lib/server/store";
import { normalizeBanner, validateBanner } from "@/lib/server/validators";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  const { id } = await context.params;
  const banners = await readBanners();
  const index = banners.findIndex((item) => item.id === id);
  if (index === -1) {
    return notFound("Banner not found");
  }

  const banner = normalizeBanner({
    ...banners[index],
    ...(await request.json()),
    id,
  });
  const validationError = validateBanner(banner);
  if (validationError) {
    return badRequest(validationError);
  }

  banners[index] = banner;
  await writeBanners(banners);
  return ok({ banner });
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  const { id } = await context.params;
  const banners = await readBanners();
  const remaining = banners.filter((item) => item.id !== id);
  if (remaining.length === banners.length) {
    return notFound("Banner not found");
  }

  await writeBanners(remaining);
  return ok({ success: true });
}
