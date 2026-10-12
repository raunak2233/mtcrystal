import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { badRequest, forbidden, notFound, ok } from "@/lib/server/http";
import {
  deleteProduct,
  findProductConflict,
  getProductById,
  readCategories,
  updateProduct,
} from "@/lib/server/store";
import { normalizeProduct, validateProduct } from "@/lib/server/validators";
import { findUnknownCategorySlugs } from "@/lib/server/category-guards";

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const product = await getProductById(id);

  if (!product) {
    return notFound("Product not found");
  }

  return ok({ product });
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  const { id } = await context.params;
  const body = await request.json();
  const existing = await getProductById(id);

  if (!existing) {
    return notFound("Product not found");
  }

  const updatedProduct = normalizeProduct({
    ...existing,
    ...body,
    id,
    createdAt: existing.createdAt,
  });

  const validationError = validateProduct(updatedProduct);
  if (validationError) {
    return badRequest(validationError);
  }

  const unknownSlugs = findUnknownCategorySlugs(updatedProduct.categories, await readCategories());
  if (unknownSlugs.length) {
    return badRequest(`Unknown category: ${unknownSlugs.join(", ")}`);
  }

  if (updatedProduct.slug !== existing.slug) {
    const { slugExists } = await findProductConflict(id, updatedProduct.slug);
    if (slugExists) {
      return badRequest("A product with this slug already exists", 409);
    }
  }

  const saved = await updateProduct(id, updatedProduct);
  return ok({ product: saved });
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  const { id } = await context.params;
  const deleted = await deleteProduct(id);

  if (!deleted) {
    return notFound("Product not found");
  }

  return ok({ success: true });
}
