import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { badRequest, forbidden, notFound, ok } from "@/lib/server/http";
import { readCategories, readProducts, writeCategories, writeProducts } from "@/lib/server/store";
import { normalizeCategory, validateCategory } from "@/lib/server/validators";

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

  categories[index] = updatedCategory;
  await writeCategories(categories);

  if (previous.slug !== updatedCategory.slug) {
    const products = await readProducts();
    const patchedProducts = products.map((product) =>
      product.category === previous.slug
        ? { ...product, category: updatedCategory.slug, updatedAt: new Date().toISOString() }
        : product
    );
    await writeProducts(patchedProducts);
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

  const products = await readProducts();
  if (products.some((product) => product.category === category.slug)) {
    return badRequest("Reassign products before deleting this category");
  }

  await writeCategories(categories.filter((item) => item.id !== id));
  return ok({ success: true });
}
