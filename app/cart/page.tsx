"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getCart,
  getCartTotal,
  removeFromCart,
  updateQuantity,
  type CartItem,
} from "@/lib/cart";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    updateCartState();

    const handleCartUpdate = () => {
      updateCartState();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const updateCartState = () => {
    setCart(getCart());
    setTotal(getCartTotal());
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="space-y-6 p-8 text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-300" />
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <p className="text-lg text-gray-600">
            Add some beautiful crystals to get started!
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link href={`/products/${item.slug || item.id}`}>
                      <h3 className="truncate text-lg font-semibold transition-colors hover:text-purple-600">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="mt-1 font-bold text-purple-600">
                      Rs. {item.price}
                    </p>

                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center gap-2 rounded-lg border">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(item.id)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">
                      Rs. {item.price * item.quantity}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6">
              <h2 className="mb-6 text-2xl font-bold">Order Summary</h2>

              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {total}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between border-t pt-3 text-xl font-bold">
                  <span>Total</span>
                  <span className="text-purple-600">Rs. {total}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href="/products">
                <Button variant="outline" className="mt-3 w-full">
                  Continue Shopping
                </Button>
              </Link>

              <div className="mt-6 space-y-2 border-t pt-6 text-sm text-gray-600">
                <p>Free shipping on all orders</p>
                <p>30-day return policy</p>
                <p>Secure checkout</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
