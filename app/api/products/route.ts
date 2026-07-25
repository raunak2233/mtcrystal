import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { badRequest, forbidden, ok } from "@/lib/server/http";
import { readCategories, readProducts, writeProducts } from "@/lib/server/store";
import { normalizeProduct, validateProduct } from "@/lib/server/validators";
import { findUnknownCategorySlugs } from "@/lib/server/category-guards";

export async function GET() {
  const products = await readProducts();
  return ok({ products });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  const body = await request.json();
  const product = normalizeProduct(body);
  const validationError = validateProduct(product);
  if (validationError) {
    return badRequest(validationError);
  }

  const unknownSlugs = findUnknownCategorySlugs(product.categories, await readCategories());
  if (unknownSlugs.length) {
    return badRequest(`Unknown category: ${unknownSlugs.join(", ")}`);
  }

  const products = await readProducts();
  if (products.some((item) => item.id === product.id)) {
    return badRequest("A product with this id already exists", 409);
  }
  if (products.some((item) => item.slug === product.slug)) {
    return badRequest("A product with this slug already exists", 409);
  }

  product.createdAt = new Date().toISOString();
  products.push(product);
  await writeProducts(products);
  return ok({ product }, { status: 201 });
}
