import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { badRequest, forbidden, notFound, ok } from "@/lib/server/http";
import { readCategories, readProducts, writeProducts } from "@/lib/server/store";
import { normalizeProduct, validateProduct } from "@/lib/server/validators";
import { findUnknownCategorySlugs } from "@/lib/server/category-guards";

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const products = await readProducts();
  const product = products.find((item) => item.id === id);

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
  const products = await readProducts();
  const index = products.findIndex((item) => item.id === id);

  if (index === -1) {
    return notFound("Product not found");
  }

  const updatedProduct = normalizeProduct({
    ...products[index],
    ...body,
    id,
    createdAt: products[index].createdAt,
  });

  const validationError = validateProduct(updatedProduct);
  if (validationError) {
    return badRequest(validationError);
  }

  const unknownSlugs = findUnknownCategorySlugs(updatedProduct.categories, await readCategories());
  if (unknownSlugs.length) {
    return badRequest(`Unknown category: ${unknownSlugs.join(", ")}`);
  }

  if (products.some((item, itemIndex) => item.slug === updatedProduct.slug && itemIndex !== index)) {
    return badRequest("A product with this slug already exists", 409);
  }

  products[index] = updatedProduct;
  await writeProducts(products);
  return ok({ product: updatedProduct });
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  const { id } = await context.params;
  const products = await readProducts();
  const remaining = products.filter((item) => item.id !== id);

  if (remaining.length === products.length) {
    return notFound("Product not found");
  }

  await writeProducts(remaining);
  return ok({ success: true });
}
