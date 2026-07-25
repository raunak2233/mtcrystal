"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState, SectionHeader, StatCard } from "@/components/admin/admin-ui";
import type { Order } from "@/lib/types";

const ORDER_STATUSES: Order["status"][] = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
];

export function OrderManager({
  orders,
  orderFilter,
  setOrderFilter,
  selectedOrderId,
  setSelectedOrderId,
  updateOrderStatus,
}: {
  orders: Order[];
  orderFilter: "all" | Order["status"];
  setOrderFilter: (value: "all" | Order["status"]) => void;
  selectedOrderId: string;
  setSelectedOrderId: (value: string) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
}) {
  const filteredOrders =
    orderFilter === "all" ? orders : orders.filter((order) => order.status === orderFilter);
  const selectedOrder = filteredOrders.find((order) => order.id === selectedOrderId) || null;

  const stats = {
    total: orders.length,
    pending: orders.filter((order) => order.status === "pending").length,
    shipped: orders.filter((order) => order.status === "shipped").length,
    revenue: orders.reduce((sum, order) => sum + order.total, 0),
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Orders" description="Track and update customer orders.">
        <Select
          value={orderFilter}
          onValueChange={(value) => setOrderFilter(value as "all" | Order["status"])}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ORDER_STATUSES.map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SectionHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Orders" value={stats.total} />
        <StatCard label="Pending Action" value={stats.pending} />
        <StatCard label="Shipped" value={stats.shipped} />
        <StatCard label="Revenue" value={`Rs. ${stats.revenue}`} />
      </div>

      {!orders.length ? (
        <EmptyState
          title="No orders yet"
          description="Orders placed on the storefront will show up here."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,340px),1fr]">
          {/* On phones the detail panel replaces the queue, so only one is shown at a time. */}
          <div className={selectedOrder ? "hidden xl:block" : "block"}>
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedOrder?.id === order.id
                      ? "border-purple-500 bg-purple-50 shadow-sm"
                      : "border-stone-200 bg-white hover:border-purple-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold">{order.orderNumber}</p>
                      <p className="truncate text-sm text-stone-500">{order.customerName}</p>
                    </div>
                    <span className="flex-shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium capitalize text-stone-700">
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-stone-500">
                    <span>{order.items.length} item(s)</span>
                    <span className="font-medium text-stone-900">Rs. {order.total}</span>
                  </div>
                </button>
              ))}
              {!filteredOrders.length ? (
                <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-center text-sm text-stone-500">
                  No orders with this status.
                </p>
              ) : null}
            </div>
          </div>

          <div className={selectedOrder ? "block" : "hidden xl:block"}>
            {selectedOrder ? (
              <div className="space-y-5 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-2 xl:hidden"
                  onClick={() => setSelectedOrderId("")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to orders
                </Button>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
                      Selected Order
                    </p>
                    <h3 className="mt-2 text-2xl font-bold sm:text-3xl">
                      {selectedOrder.orderNumber}
                    </h3>
                    <p className="mt-1 text-sm text-stone-600">
                      Placed {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(value) =>
                        updateOrderStatus(selectedOrder.id, value as Order["status"])
                      }
                    >
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((status) => (
                          <SelectItem key={status} value={status} className="capitalize">
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Total</p>
                      <p className="text-lg font-semibold">Rs. {selectedOrder.total}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-stone-200 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Customer</p>
                    <h4 className="mt-2 text-lg font-semibold">{selectedOrder.customerName}</h4>
                    <a
                      href={`mailto:${selectedOrder.customerEmail}`}
                      className="mt-1 block break-all text-sm text-stone-600 hover:text-purple-600"
                    >
                      {selectedOrder.customerEmail}
                    </a>
                    <a
                      href={`tel:${selectedOrder.customerPhone}`}
                      className="text-sm text-stone-600 hover:text-purple-600"
                    >
                      {selectedOrder.customerPhone}
                    </a>
                  </div>
                  <div className="rounded-2xl border border-stone-200 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                      Delivery Address
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-stone-700">
                      <p>{selectedOrder.address.address}</p>
                      <p>
                        {selectedOrder.address.city}, {selectedOrder.address.state}
                      </p>
                      <p>{selectedOrder.address.pincode}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-semibold">Items</h4>
                    <span className="text-sm text-stone-500">
                      {selectedOrder.items.length} item(s)
                    </span>
                  </div>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={`${selectedOrder.id}-${item.productId}`}
                        className="flex items-center justify-between gap-3 rounded-xl bg-stone-50 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-stone-500">Qty {item.quantity}</p>
                        </div>
                        <p className="flex-shrink-0 font-semibold">
                          Rs. {item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 rounded-2xl bg-stone-50 p-4 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone-400">Payment</p>
                    <p className="font-medium capitalize">{selectedOrder.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone-400">Status</p>
                    <p className="font-medium capitalize">{selectedOrder.paymentStatus}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white text-center text-sm text-stone-500">
                Select an order to review and update it.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
