import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { badRequest, forbidden, notFound, ok } from "@/lib/server/http";
import { readPages, writePages } from "@/lib/server/store";
import { normalizePage, validatePage } from "@/lib/server/validators";

export async function GET(_: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const pages = await readPages();
  const page = pages.find((item) => item.id === slug);
  if (!page) {
    return notFound(`Page "${slug}" not found`);
  }
  return ok({ page });
}

export async function PUT(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  const { slug } = await context.params;
  const pages = await readPages();
  const existing = pages.find((item) => item.id === slug);

  const page = normalizePage({
    id: slug,
    ...(existing || {}),
    ...(await request.json()),
  });
  const validationError = validatePage(page);
  if (validationError) {
    return badRequest(validationError);
  }

  const index = pages.findIndex((item) => item.id === page.id);
  if (index === -1) {
    pages.push(page);
  } else {
    pages[index] = page;
  }

  await writePages(pages);
  return ok({ page });
}
