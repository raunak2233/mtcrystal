import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { badRequest, ok, serverError, unauthorized } from "@/lib/server/http";
import { getRazorpayClient, getRazorpayConfig } from "@/lib/server/razorpay";
import { readOrders, readPayments, readProducts, writeOrders, writePayments } from "@/lib/server/store";
import { createId, validateOrderAddress, validateOrderItems } from "@/lib/server/validators";
import type { OrderAddress, OrderItem } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorized("Please sign in before placing an order");
    }

    const body = await request.json();
    const address = body.address as OrderAddress;
    const items = body.items as OrderItem[];

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
    const total = subtotal + shipping;
    const now = new Date().toISOString();
    const orderId = createId();
    const paymentId = createId();
    const orderNumber = `MTC-${Date.now().toString().slice(-6)}`;
    const razorpay = getRazorpayClient();
    const { keyId, currency } = getRazorpayConfig();
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency,
      receipt: orderNumber,
      notes: {
        internalOrderId: orderId,
        userId: user.id,
      },
    });

    const order = {
      id: orderId,
      orderNumber,
      userId: user.id,
      customerName: `${address.firstName} ${address.lastName}`.trim(),
      customerEmail: address.email,
      customerPhone: address.phone,
      address,
      items,
      subtotal,
      shipping,
      total,
      paymentMethod: "razorpay",
      paymentStatus: "created" as const,
      paymentId,
      razorpayOrderId: razorpayOrder.id,
      razorpayPaymentId: null,
      razorpaySignature: null,
      paidAt: null,
      status: "pending" as const,
      createdAt: now,
      updatedAt: now,
    };

    const payment = {
      id: paymentId,
      orderId,
      userId: user.id,
      provider: "razorpay" as const,
      method: "razorpay",
      status: "created" as const,
      amount: total,
      currency,
      providerOrderId: razorpayOrder.id,
      providerPaymentId: undefined,
      providerSignature: undefined,
      providerPayload: razorpayOrder as unknown as Record<string, unknown>,
      paidAt: null,
      createdAt: now,
      updatedAt: now,
    };

    const [orders, payments] = await Promise.all([readOrders(), readPayments()]);
    orders.push(order);
    payments.push(payment);
    await writeOrders(orders);
    await writePayments(payments);

    return ok({
      order,
      checkout: {
        key: keyId,
        amount: Math.round(total * 100),
        currency,
        razorpayOrderId: razorpayOrder.id,
        name: "MT Crystals",
        description: `Order ${orderNumber}`,
        prefill: {
          name: user.name,
          email: address.email,
          contact: address.phone,
        },
      },
    });
  } catch (error) {
    console.error("Razorpay create order failed", error);
    return serverError(error instanceof Error ? error.message : "Unable to create payment order");
  }
}
