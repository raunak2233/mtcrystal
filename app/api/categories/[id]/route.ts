import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { badRequest, forbidden, notFound, ok } from "@/lib/server/http";
import { countProductsByCategorySlug, readCategories, renameProductCategorySlug, writeCategories } from "@/lib/server/store";
import {
  normalizeCategory,
  validateCategory,
  validateCategoryHierarchy,
} from "@/lib/server/validators";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  const { id } = await context.params;
  const categories = await readCategories();
  const index = categories.findIndex((item) => item.id === id);
  if (index === -1) {
    return notFound("Category not found");
  }

  const previous = categories[index];
  const updatedCategory = normalizeCategory({
    ...previous,
    ...(await request.json()),
    id,
  });
  const validationError = validateCategory(updatedCategory);
  if (validationError) {
    return badRequest(validationError);
  }

  const duplicate = categories.find(
    (item) => item.id !== id && item.slug === updatedCategory.slug
  );
  if (duplicate) {
    return badRequest("A category with this slug already exists", 409);
  }

  const nextCategories = categories.map((item) => (item.id === id ? updatedCategory : item));
  const hierarchyError = validateCategoryHierarchy(updatedCategory, nextCategories);
  if (hierarchyError) {
    return badRequest(hierarchyError);
  }

  await writeCategories(nextCategories);

  if (previous.slug !== updatedCategory.slug) {
    await renameProductCategorySlug(previous.slug, updatedCategory.slug);
  }

  return ok({ category: updatedCategory });
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  const { id } = await context.params;
  const categories = await readCategories();
  const category = categories.find((item) => item.id === id);
  if (!category) {
    return notFound("Category not found");
  }

  if (categories.some((item) => item.parentId === category.id)) {
    return badRequest("Delete or move this category's sub-categories first");
  }

  const linkedCount = await countProductsByCategorySlug(category.slug);
  if (linkedCount > 0) {
    return badRequest("Reassign products before deleting this category");
  }

  await writeCategories(categories.filter((item) => item.id !== id));
  return ok({ success: true });
}
