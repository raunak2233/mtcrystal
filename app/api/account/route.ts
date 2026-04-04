import { getSessionUser, sanitizeUser, setSession } from "@/lib/server/auth";
import { badRequest, notFound, ok, unauthorized } from "@/lib/server/http";
import { readUsers, writeUsers } from "@/lib/server/store";
import { createId, validateOrderAddress } from "@/lib/server/validators";
import type { AccountUser, StoredUser, UserAddress } from "@/lib/types";

function sanitizeAccountUser(user: StoredUser): AccountUser {
  return {
    ...sanitizeUser(user),
    phone: String(user.phone || "").trim(),
    addresses: Array.isArray(user.addresses) ? user.addresses : [],
    createdAt: user.createdAt,
  };
}

function normalizeAddress(address: Partial<UserAddress>, fallbackEmail: string): UserAddress {
  return {
    id: String(address.id || "").trim() || createId(),
    label: String(address.label || "").trim() || "Saved address",
    firstName: String(address.firstName || "").trim(),
    lastName: String(address.lastName || "").trim(),
    email: String(address.email || fallbackEmail).trim(),
    phone: String(address.phone || "").trim(),
    address: String(address.address || "").trim(),
    city: String(address.city || "").trim(),
    state: String(address.state || "").trim(),
    pincode: String(address.pincode || "").trim(),
    isDefault: Boolean(address.isDefault),
  };
}

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return unauthorized();
  }

  const users = await readUsers();
  const user = users.find((item) => item.id === sessionUser.id);
  if (!user) {
    return notFound("Account not found");
  }

  return ok({ user: sanitizeAccountUser(user) });
}

export async function PUT(request: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return unauthorized();
  }

  const body = await request.json();
  const users = await readUsers();
  const index = users.findIndex((item) => item.id === sessionUser.id);

  if (index === -1) {
    return notFound("Account not found");
  }

  const currentUser = users[index];
  const name = String(body.name || currentUser.name).trim();
  const phone = String(body.phone || "").trim();
  const incomingAddresses: Partial<UserAddress>[] = Array.isArray(body.addresses)
    ? body.addresses
    : currentUser.addresses || [];

  if (!name) {
    return badRequest("Name is required");
  }

  const normalizedAddresses = incomingAddresses.map((address: Partial<UserAddress>) =>
    normalizeAddress(address, currentUser.email)
  );
  const invalidAddress = normalizedAddresses.find((address: UserAddress) => !validateOrderAddress(address));
  if (invalidAddress) {
    return badRequest("Each saved address must include full contact and shipping details");
  }

  const updatedAddresses = normalizedAddresses.map((address: UserAddress, index: number) => ({
    ...address,
    isDefault: normalizedAddresses.length ? index === 0 : false,
  }));

  const updatedUser: StoredUser = {
    ...currentUser,
    name,
    phone,
    addresses: updatedAddresses,
  };

  users[index] = updatedUser;
  await writeUsers(users);
  await setSession(updatedUser);

  return ok({ user: sanitizeAccountUser(updatedUser) });
}
