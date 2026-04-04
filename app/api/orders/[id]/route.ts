import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { badRequest, forbidden, notFound, ok, unauthorized } from "@/lib/server/http";
import { readOrders, writeOrders } from "@/lib/server/store";

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) {
    return unauthorized();
  }

  const { id } = await context.params;
  const orders = await readOrders();
  const order = orders.find((item) => item.id === id);

  if (!order) {
    return notFound("Order not found");
  }

  if (!user.isAdmin && order.userId !== user.id && order.customerEmail !== user.email) {
    return forbidden();
  }

  return ok({ order });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  const { id } = await context.params;
  const body = await request.json();
  const status = String(body.status || "");
  const allowedStatuses = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];
  if (!allowedStatuses.includes(status)) {
    return badRequest("Invalid order status");
  }

  const orders = await readOrders();
  const index = orders.findIndex((item) => item.id === id);
  if (index === -1) {
    return notFound("Order not found");
  }

  orders[index] = {
    ...orders[index],
    status: status as typeof orders[number]["status"],
    updatedAt: new Date().toISOString(),
  };
  await writeOrders(orders);

  return ok({ order: orders[index] });
}
