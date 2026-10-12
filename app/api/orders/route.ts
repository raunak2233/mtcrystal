import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { badRequest, forbidden, ok, serverError, unauthorized } from "@/lib/server/http";
import { readOrders, readPayments, decrementProductStocks, getProductsByIds, writeOrders, writePayments } from "@/lib/server/store";
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
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorized("Please sign in before placing an order");
    }

    const body = await request.json();
    const address = body.address as OrderAddress;
    const items = body.items as OrderItem[];
    const paymentMethod = String(body.paymentMethod || "cod");
    if (paymentMethod !== "cod") {
      return badRequest("Use the payment API for online payments");
    }

    if (!validateOrderAddress(address)) {
      return badRequest("Please complete your shipping details");
    }

    if (!validateOrderItems(items)) {
      return badRequest("Your cart is empty or invalid");
    }

    const products = await getProductsByIds(items.map((item) => item.productId));
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
    const paymentId = createId();
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
      paymentStatus: "pending" as const,
      paymentId,
      razorpayOrderId: null,
      razorpayPaymentId: null,
      razorpaySignature: null,
      paidAt: null,
      status: "pending" as const,
      createdAt: now,
      updatedAt: now,
    };
    const payment = {
      id: paymentId,
      orderId: order.id,
      userId: user.id,
      provider: "manual" as const,
      method: paymentMethod,
      status: "pending" as const,
      amount: order.total,
      currency: "INR",
      providerPayload: null,
      paidAt: null,
      createdAt: now,
      updatedAt: now,
    };

    const orders = await readOrders();
    const payments = await readPayments();
    orders.push(order);
    payments.push(payment);

    await writeOrders(orders);
    await writePayments(payments);
    await decrementProductStocks(
      items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      now
    );

    return ok({ order }, { status: 201 });
  } catch (error) {
    console.error("Create COD order failed", error);
    return serverError(error instanceof Error ? error.message : "Unable to create order");
  }
}
