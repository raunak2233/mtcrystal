"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  apiSend,
  getAccount,
  updateAccount,
} from "@/lib/api-client";
import { clearCart, getCart, getCartTotal, type CartItem } from "@/lib/cart";
import type { AccountUser, UserAddress } from "@/lib/types";

const emptyAddress = {
  label: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, callback: (payload: { error?: { description?: string } }) => void) => void;
    };
  }
}

async function loadRazorpayScript() {
  if (window.Razorpay) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutPageClient() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const [account, setAccount] = useState<AccountUser | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [formData, setFormData] = useState(emptyAddress);

  useEffect(() => {
    const cartItems = getCart();
    if (!cartItems.length) {
      router.push("/cart");
      return;
    }

    setCart(cartItems);
    setTotal(getCartTotal());

    getAccount()
      .then((response) => {
        const currentAccount = response.user;
        setAccount(currentAccount);

        if (currentAccount.addresses.length) {
          const defaultAddress = currentAccount.addresses[0];
          setSelectedAddressId(defaultAddress.id);
          setFormData({
            label: defaultAddress.label,
            firstName: defaultAddress.firstName,
            lastName: defaultAddress.lastName,
            email: defaultAddress.email,
            phone: defaultAddress.phone,
            address: defaultAddress.address,
            city: defaultAddress.city,
            state: defaultAddress.state,
            pincode: defaultAddress.pincode,
          });
        } else {
          const [firstName = "", ...lastNameParts] = currentAccount.name.split(" ");
          setSelectedAddressId("new");
          setFormData((current) => ({
            ...current,
            firstName,
            lastName: lastNameParts.join(" "),
            email: currentAccount.email,
            phone: currentAccount.phone || "",
          }));
        }
      })
      .catch((error) => {
        console.error("Failed to load checkout", error);
        toast.error("Please sign in before checkout");
        router.replace("/login?redirect=/checkout");
      });
  }, [router]);

  const selectedSavedAddress = useMemo(
    () =>
      account?.addresses.find((address) => address.id === selectedAddressId) || null,
    [account?.addresses, selectedAddressId]
  );

  const usingNewAddress = selectedAddressId === "new" || !account?.addresses.length;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleAddressSelection = (value: string) => {
    setSelectedAddressId(value);
    if (value === "new") {
      const [firstName = "", ...lastNameParts] = (account?.name || "").split(" ");
      setFormData({
        ...emptyAddress,
        firstName,
        lastName: lastNameParts.join(" "),
        email: account?.email || "",
        phone: account?.phone || "",
      });
      return;
    }

    const selected = account?.addresses.find((address) => address.id === value);
    if (selected) {
      setFormData({
        label: selected.label,
        firstName: selected.firstName,
        lastName: selected.lastName,
        email: selected.email,
        phone: selected.phone,
        address: selected.address,
        city: selected.city,
        state: selected.state,
        pincode: selected.pincode,
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) {
      return;
    }

    const addressPayload = usingNewAddress
      ? formData
      : selectedSavedAddress;

    if (!addressPayload) {
      toast.error("Please select or add a delivery address");
      return;
    }

    const emptyFields = Object.entries(addressPayload).filter(
      ([key, value]) => key !== "label" && !String(value).trim()
    );
    if (emptyFields.length > 0) {
      toast.error("Please fill in all required address fields");
      return;
    }

    setSubmitting(true);
    try {
      if (usingNewAddress && saveNewAddress) {
        const newAddress: UserAddress = {
          ...formData,
          id: crypto.randomUUID(),
          label: formData.label.trim() || "Saved address",
          isDefault: !account.addresses.length,
        };

        const accountResponse = await updateAccount({
          name: account.name,
          phone: account.phone,
          addresses: [newAddress, ...account.addresses],
        });
        setAccount(accountResponse.user);
      }

      const requestPayload = {
        address: {
          firstName: addressPayload.firstName,
          lastName: addressPayload.lastName,
          email: addressPayload.email,
          phone: addressPayload.phone,
          address: addressPayload.address,
          city: addressPayload.city,
          state: addressPayload.state,
          pincode: addressPayload.pincode,
        },
        paymentMethod,
        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      };

      if (paymentMethod === "razorpay") {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded || !window.Razorpay) {
          throw new Error("Unable to load Razorpay checkout");
        }
        const RazorpayCtor = window.Razorpay;

        const response = await apiSend<{
          order: { id: string; orderNumber: string };
          checkout: {
            key: string;
            amount: number;
            currency: string;
            razorpayOrderId: string;
            name: string;
            description: string;
            prefill: { name: string; email: string; contact: string };
          };
        }>("/api/payments/create-order", "POST", requestPayload);

        await new Promise<void>((resolve, reject) => {
          const razorpay = new RazorpayCtor({
            key: response.checkout.key,
            amount: response.checkout.amount,
            currency: response.checkout.currency,
            name: response.checkout.name,
            description: response.checkout.description,
            order_id: response.checkout.razorpayOrderId,
            prefill: response.checkout.prefill,
            handler: async (paymentResponse: Record<string, string>) => {
              try {
                await apiSend("/api/payments/verify", "POST", {
                  orderId: response.order.id,
                  razorpayOrderId: paymentResponse.razorpay_order_id,
                  razorpayPaymentId: paymentResponse.razorpay_payment_id,
                  razorpaySignature: paymentResponse.razorpay_signature,
                });

                clearCart();
                toast.success("Payment successful");
                router.push(`/account?tab=orders&placed=${response.order.orderNumber}`);
                resolve();
              } catch (error) {
                reject(error);
              }
            },
            theme: {
              color: "#7c3aed",
            },
          });

          razorpay.on("payment.failed", (failure) => {
            reject(new Error(failure.error?.description || "Payment failed"));
          });
          razorpay.open();
        });
      } else {
        const response = await apiSend<{ order: { orderNumber: string } }>(
          "/api/orders",
          "POST",
          requestPayload
        );

        clearCart();
        toast.success("Order placed successfully");
        router.push(`/account?tab=orders&placed=${response.order.orderNumber}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart.length || !account) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Checkout</h1>
            <p className="text-gray-600">
              Choose a saved address or add a new one for this order.
            </p>
          </div>
          <Link href="/account">
            <Button variant="outline">Manage Addresses</Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card className="p-6">
                <h2 className="mb-6 text-2xl font-bold">Delivery Address</h2>

                {account.addresses.length ? (
                  <RadioGroup
                    value={selectedAddressId}
                    onValueChange={handleAddressSelection}
                    className="space-y-4"
                  >
                    {account.addresses.map((address) => (
                      <label
                        key={address.id}
                        className="flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition hover:border-purple-200"
                      >
                        <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-purple-600" />
                            <p className="font-semibold">{address.label}</p>
                          </div>
                          <p className="mt-2 text-sm text-gray-700">
                            {address.firstName} {address.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{address.phone}</p>
                          <p className="text-sm text-gray-600">
                            {address.address}, {address.city}, {address.state} {address.pincode}
                          </p>
                        </div>
                      </label>
                    ))}

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-dashed p-4 transition hover:border-purple-200">
                      <RadioGroupItem value="new" id="new-address" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <PlusCircle className="h-4 w-4 text-purple-600" />
                          <p className="font-semibold">Use a new address</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          Enter fresh delivery details for this order.
                        </p>
                      </div>
                    </label>
                  </RadioGroup>
                ) : null}

                {usingNewAddress ? (
                  <div className="mt-6 space-y-4 border-t pt-6">
                    <div>
                      <Label htmlFor="label">Address Label</Label>
                      <Input
                        id="label"
                        name="label"
                        value={formData.label}
                        onChange={handleInputChange}
                        placeholder="Home, Office, Gift address"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={saveNewAddress}
                        onChange={(event) => setSaveNewAddress(event.target.checked)}
                      />
                      Save this address in my account
                    </label>
                  </div>
                ) : null}
              </Card>

              <Card className="p-6">
                <h2 className="mb-6 text-2xl font-bold">Payment Method</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      Cash on Delivery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                      Razorpay
                    </Label>
                  </div>
                </RadioGroup>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 p-6">
                <h2 className="mb-6 text-2xl font-bold">Order Summary</h2>

                <div className="mb-6 max-h-64 space-y-4 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-purple-600">
                          Rs. {item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-6 space-y-3 border-t pt-6">
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

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? "Placing Order..." : "Place Order"}
                </Button>

                <p className="mt-4 text-center text-xs text-gray-500">
                  By placing your order, you agree to our terms and conditions.
                </p>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
