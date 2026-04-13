import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { badRequest, forbidden, ok, serverError, unauthorized } from "@/lib/server/http";
import { getRazorpayClient, verifyRazorpaySignature } from "@/lib/server/razorpay";
import { readOrders, readPayments, readProducts, writeOrders, writePayments, writeProducts } from "@/lib/server/store";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorized();
    }

    const body = await request.json();
    const orderId = String(body.orderId || "");
    const razorpayOrderId = String(body.razorpayOrderId || "");
    const razorpayPaymentId = String(body.razorpayPaymentId || "");
    const razorpaySignature = String(body.razorpaySignature || "");

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return badRequest("Missing payment verification details");
    }

    if (!verifyRazorpaySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature })) {
      return badRequest("Payment signature verification failed");
    }

    const [orders, payments, products] = await Promise.all([
      readOrders(),
      readPayments(),
      readProducts(),
    ]);
    const orderIndex = orders.findIndex((item) => item.id === orderId);
    if (orderIndex === -1) {
      return badRequest("Order not found");
    }

    const order = orders[orderIndex];
    if (!user.isAdmin && order.userId !== user.id && order.customerEmail !== user.email) {
      return forbidden();
    }

    if (order.paymentStatus === "paid" || order.paymentStatus === "captured") {
      return ok({ order });
    }

    if (order.razorpayOrderId !== razorpayOrderId) {
      return badRequest("Payment order mismatch");
    }

    for (const item of order.items) {
      const product = products.find((productItem) => productItem.id === item.productId);
      if (!product) {
        return badRequest(`Product "${item.name}" no longer exists`);
      }
      if (product.stock < item.quantity) {
        return badRequest(`Only ${product.stock} item(s) left for ${product.name}`);
      }
    }

    const fetchedPayment = await getRazorpayClient().payments.fetch(razorpayPaymentId);
    const paidAt = new Date().toISOString();
    const paymentStatus = fetchedPayment.status === "captured" ? "captured" : "paid";

    orders[orderIndex] = {
      ...order,
      paymentStatus,
      razorpayPaymentId,
      razorpaySignature,
      paidAt,
      status: "confirmed",
      updatedAt: paidAt,
    };

    const paymentIndex = payments.findIndex((item) => item.orderId === orderId);
    if (paymentIndex !== -1) {
      payments[paymentIndex] = {
        ...payments[paymentIndex],
        status: paymentStatus,
        providerPaymentId: razorpayPaymentId,
        providerSignature: razorpaySignature,
        providerPayload: fetchedPayment as unknown as Record<string, unknown>,
        paidAt,
        updatedAt: paidAt,
      };
    }

    const updatedProducts = products.map((product) => {
      const item = order.items.find((orderItem) => orderItem.productId === product.id);
      return item
        ? { ...product, stock: product.stock - item.quantity, updatedAt: paidAt }
        : product;
    });

    await writeOrders(orders);
    await writePayments(payments);
    await writeProducts(updatedProducts);

    return ok({ order: orders[orderIndex] });
  } catch (error) {
    console.error("Razorpay verify payment failed", error);
    return serverError(error instanceof Error ? error.message : "Unable to verify payment");
  }
}
