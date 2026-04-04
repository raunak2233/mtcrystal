"use client";

import { Card } from "@/components/ui/card";
import type { Order } from "@/lib/types";

export function AdminOrderManager({
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
  const filteredOrders = orderFilter === "all" ? orders : orders.filter((order) => order.status === orderFilter);
  const selectedOrder = filteredOrders.find((order) => order.id === selectedOrderId) || filteredOrders[0] || null;
  const orderStats = {
    total: orders.length,
    pending: orders.filter((order) => order.status === "pending").length,
    shipped: orders.filter((order) => order.status === "shipped").length,
    revenue: orders.reduce((sum, order) => sum + order.total, 0),
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-3xl p-5">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="mt-2 text-3xl font-bold">{orderStats.total}</p>
        </Card>
        <Card className="rounded-3xl p-5">
          <p className="text-sm text-gray-500">Pending Action</p>
          <p className="mt-2 text-3xl font-bold">{orderStats.pending}</p>
        </Card>
        <Card className="rounded-3xl p-5">
          <p className="text-sm text-gray-500">Shipped</p>
          <p className="mt-2 text-3xl font-bold">{orderStats.shipped}</p>
        </Card>
        <Card className="rounded-3xl p-5">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="mt-2 text-3xl font-bold">Rs. {orderStats.revenue}</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
        <Card className="rounded-3xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Order Queue</h2>
              <p className="text-sm text-gray-500">Select an order to manage it in detail.</p>
            </div>
            <select
              value={orderFilter}
              onChange={(event) => setOrderFilter(event.target.value as "all" | Order["status"])}
              className="rounded-xl border bg-white px-3 py-2 text-sm"
            >
              {["all", "pending", "confirmed", "packed", "shipped", "delivered", "cancelled"].map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All statuses" : status}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selectedOrder?.id === order.id
                    ? "border-purple-500 bg-purple-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-purple-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.customerName}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                    {order.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                  <span>{order.items.length} item(s)</span>
                  <span>Rs. {order.total}</span>
                </div>
              </button>
            ))}
            {!filteredOrders.length ? <p className="text-sm text-gray-500">No orders found for this filter.</p> : null}
          </div>
        </Card>

        <Card className="rounded-3xl p-6">
          {selectedOrder ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Selected Order</p>
                  <h2 className="mt-2 text-3xl font-bold">{selectedOrder.orderNumber}</h2>
                  <p className="mt-2 text-gray-600">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={selectedOrder.status}
                    onChange={(event) => updateOrderStatus(selectedOrder.id, event.target.value as Order["status"])}
                    className="rounded-xl border bg-white px-4 py-3 text-sm"
                  >
                    {["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Total</p>
                    <p className="text-lg font-semibold">Rs. {selectedOrder.total}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border bg-white p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-400">Customer</p>
                  <h3 className="mt-3 text-xl font-semibold">{selectedOrder.customerName}</h3>
                  <p className="mt-1 text-gray-600">{selectedOrder.customerEmail}</p>
                  <p className="text-gray-600">{selectedOrder.customerPhone}</p>
                </div>
                <div className="rounded-2xl border bg-white p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-400">Delivery Address</p>
                  <div className="mt-3 space-y-1 text-gray-700">
                    <p>{selectedOrder.address.address}</p>
                    <p>{selectedOrder.address.city}, {selectedOrder.address.state}</p>
                    <p>{selectedOrder.address.pincode}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Items</h3>
                  <span className="text-sm text-gray-500">{selectedOrder.items.length} item(s)</span>
                </div>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={`${selectedOrder.id}-${item.productId}`} className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty {item.quantity}</p>
                      </div>
                      <p className="font-semibold">Rs. {item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center text-center text-gray-500">
              Select an order from the queue to review and update it.
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
