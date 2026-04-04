"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LogOut,
  MapPin,
  Package,
  Plus,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  apiSend,
  getAccount,
  getOrders,
  updateAccount,
} from "@/lib/api-client";
import type { AccountUser, Order, UserAddress } from "@/lib/types";

const emptyAddress = {
  id: "",
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

export function AccountPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [account, setAccount] = useState<AccountUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
  });
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState("");

  const activeTab = searchParams.get("tab") || "profile";

  const loadAccountData = async () => {
    setLoading(true);

    try {
      const [accountResponse, orderResponse] = await Promise.all([
        getAccount(),
        getOrders("mine").catch(() => ({ orders: [] as Order[] })),
      ]);

      setAccount(accountResponse.user);
      setOrders(orderResponse.orders);
      setProfileForm({
        name: accountResponse.user.name,
        phone: accountResponse.user.phone || "",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccountData().catch((error) => {
      console.error("Failed to load account", error);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const placed = searchParams.get("placed");
    if (placed) {
      toast.success(`Order ${placed} placed successfully`);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && !account) {
      router.replace("/login?redirect=/account");
    }
  }, [account, loading, router]);

  const handleAuthChanged = () => {
    window.dispatchEvent(new Event("authChanged"));
  };

  const handleLogout = async () => {
    setSubmitting(true);
    try {
      await apiSend("/api/auth/logout", "POST");
      setAccount(null);
      setOrders([]);
      handleAuthChanged();
      toast.success("Signed out");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign out");
    } finally {
      setSubmitting(false);
    }
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) {
      return;
    }

    setSavingProfile(true);
    try {
      const response = await updateAccount({
        name: profileForm.name,
        phone: profileForm.phone,
        addresses: account.addresses,
      });

      setAccount(response.user);
      setProfileForm({
        name: response.user.name,
        phone: response.user.phone,
      });
      handleAuthChanged();
      toast.success("Account details updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update account");
    } finally {
      setSavingProfile(false);
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      ...emptyAddress,
      email: account?.email || "",
    });
    setEditingAddressId("");
  };

  const saveAddress = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) {
      return;
    }

    setSavingAddress(true);
    try {
      const normalizedAddress: UserAddress = {
        ...addressForm,
        id: editingAddressId || crypto.randomUUID(),
        label: addressForm.label.trim() || "Saved address",
        email: addressForm.email.trim() || account.email,
      };

      const updatedAddresses = editingAddressId
        ? account.addresses.map((address) =>
            address.id === editingAddressId ? normalizedAddress : address
          )
        : [normalizedAddress, ...account.addresses];

      const response = await updateAccount({
        name: account.name,
        phone: account.phone,
        addresses: updatedAddresses,
      });

      setAccount(response.user);
      resetAddressForm();
      toast.success(editingAddressId ? "Address updated" : "Address added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  const editAddress = (address: UserAddress) => {
    setEditingAddressId(address.id);
    setAddressForm(address);
  };

  const removeAddress = async (addressId: string) => {
    if (!account) {
      return;
    }

    try {
      const response = await updateAccount({
        name: account.name,
        phone: account.phone,
        addresses: account.addresses.filter((address) => address.id !== addressId),
      });

      setAccount(response.user);
      if (editingAddressId === addressId) {
        resetAddressForm();
      }
      toast.success("Address removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove address");
    }
  };

  const orderCountLabel = useMemo(() => `${orders.length} order${orders.length === 1 ? "" : "s"}`, [orders.length]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  if (!account) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto space-y-8 px-4 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold">My Account</h1>
            <p className="text-gray-600">
              Welcome back, {account.name}. You have {orderCountLabel}.
            </p>
          </div>
          <div className="flex gap-3">
            {account.isAdmin ? (
              <Link href="/admin">
                <Button variant="outline" className="gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Admin Dashboard
                </Button>
              </Link>
            ) : null}
            <Button
              variant="outline"
              className="gap-2 text-red-600"
              onClick={handleLogout}
              disabled={submitting}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <Card className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <User className="h-10 w-10 rounded-full bg-purple-100 p-2 text-purple-600" />
              <div>
                <h2 className="text-2xl font-bold">Account Details</h2>
                <p className="text-gray-600">
                  Keep your contact information up to date.
                </p>
              </div>
            </div>

            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="account-name">Full Name</Label>
                  <Input
                    id="account-name"
                    value={profileForm.name}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="account-email">Email</Label>
                  <Input id="account-email" value={account.email} disabled />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="account-phone">Phone</Label>
                  <Input
                    id="account-phone"
                    value={profileForm.phone}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="rounded-2xl border bg-stone-50 p-4">
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-semibold">
                    {account.isAdmin ? "Admin" : "Customer"}
                  </p>
                </div>
              </div>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
                disabled={savingProfile}
              >
                {savingProfile ? "Saving..." : "Save Details"}
              </Button>
            </form>
          </Card>

          <Card className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <Package className="h-10 w-10 rounded-full bg-amber-100 p-2 text-amber-700" />
              <div>
                <h2 className="text-2xl font-bold">Order Snapshot</h2>
                <p className="text-gray-600">
                  Your latest order activity at a glance.
                </p>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-2xl border bg-white p-4">
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold">{orders.length}</p>
              </div>
              <div className="rounded-2xl border bg-white p-4">
                <p className="text-sm text-gray-500">Saved Addresses</p>
                <p className="text-2xl font-semibold">{account.addresses.length}</p>
              </div>
              <div className="rounded-2xl border bg-white p-4">
                <p className="text-sm text-gray-500">Active Tab</p>
                <p className="font-semibold capitalize">{activeTab}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
          <Card className="p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-10 w-10 rounded-full bg-emerald-100 p-2 text-emerald-700" />
                <div>
                  <h2 className="text-2xl font-bold">Saved Addresses</h2>
                  <p className="text-gray-600">
                    Select these during checkout or manage them here.
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={resetAddressForm}>
                <Plus className="mr-2 h-4 w-4" />
                New Address
              </Button>
            </div>

            <div className="space-y-4">
              {account.addresses.length ? (
                account.addresses.map((address) => (
                  <div
                    key={address.id}
                    className="rounded-2xl border bg-white p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                          {address.label}
                        </p>
                        <p className="mt-2 font-semibold">
                          {address.firstName} {address.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                        <p className="mt-2 text-sm text-gray-700">
                          {address.address}, {address.city}, {address.state} {address.pincode}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">{address.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => editAddress(address)}>
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          className="text-red-600"
                          onClick={() => removeAddress(address.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed bg-stone-50 p-8 text-center text-gray-600">
                  No saved addresses yet. Add one for faster checkout.
                </div>
              )}
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="mb-2 text-2xl font-bold">
              {editingAddressId ? "Edit Address" : "Add Address"}
            </h2>
            <p className="mb-6 text-gray-600">
              Save complete delivery details for checkout.
            </p>

            <form onSubmit={saveAddress} className="space-y-4">
              <div>
                <Label htmlFor="address-label">Label</Label>
                <Input
                  id="address-label"
                  value={addressForm.label}
                  onChange={(event) =>
                    setAddressForm((current) => ({
                      ...current,
                      label: event.target.value,
                    }))
                  }
                  placeholder="Home, Office, Gift address"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={addressForm.firstName}
                    onChange={(event) =>
                      setAddressForm((current) => ({
                        ...current,
                        firstName: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={addressForm.lastName}
                    onChange={(event) =>
                      setAddressForm((current) => ({
                        ...current,
                        lastName: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={addressForm.phone}
                    onChange={(event) =>
                      setAddressForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={addressForm.email}
                    onChange={(event) =>
                      setAddressForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Textarea
                  id="street"
                  value={addressForm.address}
                  onChange={(event) =>
                    setAddressForm((current) => ({
                      ...current,
                      address: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={addressForm.city}
                    onChange={(event) =>
                      setAddressForm((current) => ({
                        ...current,
                        city: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={addressForm.state}
                    onChange={(event) =>
                      setAddressForm((current) => ({
                        ...current,
                        state: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={addressForm.pincode}
                    onChange={(event) =>
                      setAddressForm((current) => ({
                        ...current,
                        pincode: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={savingAddress}
                >
                  {savingAddress
                    ? "Saving..."
                    : editingAddressId
                      ? "Update Address"
                      : "Save Address"}
                </Button>
                <Button type="button" variant="outline" onClick={resetAddressForm}>
                  Clear
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <Card className="p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Order History</h2>
              <p className="text-gray-600">
                Track every order from your account dashboard.
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>

          <div className="space-y-4">
            {orders.length ? (
              orders.map((order) => (
                <div key={order.id} className="rounded-2xl border bg-white p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Order Number</p>
                      <h3 className="text-xl font-semibold">{order.orderNumber}</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-semibold capitalize text-purple-700">
                        {order.status}
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        Rs. {order.total}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 border-t pt-4">
                    {order.items.map((item) => (
                      <div
                        key={`${order.id}-${item.productId}`}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>Rs. {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed bg-stone-50 p-8 text-center">
                <Package className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <h3 className="mb-2 text-2xl font-bold">No orders yet</h3>
                <p className="mb-6 text-gray-600">
                  Your order history will appear here after checkout.
                </p>
                <Link href="/products">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
