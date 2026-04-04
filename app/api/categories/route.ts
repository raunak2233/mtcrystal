import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { badRequest, forbidden, ok } from "@/lib/server/http";
import { readCategories, writeCategories } from "@/lib/server/store";
import { normalizeCategory, validateCategory } from "@/lib/server/validators";

export async function GET() {
  const categories = await readCategories();
  return ok({ categories });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  const category = normalizeCategory(await request.json());
  const validationError = validateCategory(category);
  if (validationError) {
    return badRequest(validationError);
  }

  const categories = await readCategories();
  if (categories.some((item) => item.slug === category.slug)) {
    return badRequest("A category with this slug already exists", 409);
  }

  categories.push(category);
  await writeCategories(categories);
  return ok({ category }, { status: 201 });
}
