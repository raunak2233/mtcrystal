import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { badRequest, forbidden, ok, unauthorized } from "@/lib/server/http";
import { readOrders, readProducts, writeOrders, writeProducts } from "@/lib/server/store";
import { createId, validateOrderAddress, validateOrderItems } from "@/lib/server/validators";
import type { OrderAddress, OrderItem } from "@/lib/types";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return unauthorized();
  }

  const scope = request.nextUrl.searchParams.get("scope");
  const orders = await readOrders();
  const myOrders = orders.filter((order) => order.userId === user.id || order.customerEmail === user.email);
  const visibleOrders = scope === "mine"
    ? myOrders
    : user.isAdmin
      ? orders
      : myOrders;

  return ok({ orders: visibleOrders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return unauthorized("Please sign in before placing an order");
  }

  const body = await request.json();
  const address = body.address as OrderAddress;
  const items = body.items as OrderItem[];
  const paymentMethod = String(body.paymentMethod || "cod");

  if (!validateOrderAddress(address)) {
    return badRequest("Please complete your shipping details");
  }

  if (!validateOrderItems(items)) {
    return badRequest("Your cart is empty or invalid");
  }

  const products = await readProducts();
  for (const item of items) {
    const product = products.find((productItem) => productItem.id === item.productId);
    if (!product) {
      return badRequest(`Product "${item.name}" no longer exists`);
    }
    if (product.stock < item.quantity) {
      return badRequest(`Only ${product.stock} item(s) left for ${product.name}`);
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const now = new Date().toISOString();
  const order = {
    id: createId(),
    orderNumber: `MTC-${Date.now().toString().slice(-6)}`,
    userId: user.id,
    customerName: `${address.firstName} ${address.lastName}`.trim(),
    customerEmail: address.email,
    customerPhone: address.phone,
    address,
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    paymentMethod,
    status: "pending" as const,
    createdAt: now,
    updatedAt: now,
  };

  const updatedProducts = products.map((product) => {
    const item = items.find((orderItem) => orderItem.productId === product.id);
    return item
      ? { ...product, stock: product.stock - item.quantity, updatedAt: now }
      : product;
  });
  const orders = await readOrders();
  orders.push(order);

  await Promise.all([writeOrders(orders), writeProducts(updatedProducts)]);

  return ok({ order }, { status: 201 });
}
