import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type {
  Banner,
  Category,
  Order,
  Product,
  StoredUser,
  UserAddress,
} from "@/lib/types";
import { slugify } from "@/lib/server/validators";

const dataDir = path.join(process.cwd(), "data");

const storeFiles = {
  products: path.join(dataDir, "products.json"),
  categories: path.join(dataDir, "categories.json"),
  banners: path.join(dataDir, "banners.json"),
  users: path.join(dataDir, "users.json"),
  orders: path.join(dataDir, "orders.json"),
} as const;

async function ensureFile(filePath: string, fallback: unknown) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf8");
  }
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  await ensureFile(filePath, fallback);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function writeJsonFile<T>(filePath: string, data: T) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

function normalizeStoredProduct(product: Product): Product {
  const image = String(product.image || "").trim();
  const images = Array.isArray(product.images)
    ? product.images.map((value) => String(value || "").trim()).filter(Boolean)
    : [];

  return {
    ...product,
    slug: String(product.slug || "").trim() || slugify(product.name || product.id || ""),
    image,
    images: images.length ? images : image ? [image] : [],
    bulletPoints: Array.isArray(product.bulletPoints)
      ? product.bulletPoints.map((value) => String(value || "").trim()).filter(Boolean)
      : [],
  };
}

function normalizeStoredAddress(address: UserAddress, email: string): UserAddress {
  return {
    id: String(address.id || "").trim() || crypto.randomUUID(),
    label: String(address.label || "").trim() || "Saved address",
    firstName: String(address.firstName || "").trim(),
    lastName: String(address.lastName || "").trim(),
    email: String(address.email || email).trim(),
    phone: String(address.phone || "").trim(),
    address: String(address.address || "").trim(),
    city: String(address.city || "").trim(),
    state: String(address.state || "").trim(),
    pincode: String(address.pincode || "").trim(),
    isDefault: Boolean(address.isDefault),
  };
}

function normalizeStoredUser(user: StoredUser): StoredUser {
  const addresses = Array.isArray(user.addresses)
    ? user.addresses.map((address) => normalizeStoredAddress(address, user.email))
    : [];

  return {
    ...user,
    phone: String(user.phone || "").trim(),
    addresses,
  };
}

export async function readProducts() {
  const products = await readJsonFile<Product[]>(storeFiles.products, []);
  return products.map(normalizeStoredProduct);
}

export async function writeProducts(products: Product[]) {
  await writeJsonFile(storeFiles.products, products);
}

export async function readCategories() {
  return readJsonFile<Category[]>(storeFiles.categories, []);
}

export async function writeCategories(categories: Category[]) {
  await writeJsonFile(storeFiles.categories, categories);
}

export async function readBanners() {
  return readJsonFile<Banner[]>(storeFiles.banners, []);
}

export async function writeBanners(banners: Banner[]) {
  await writeJsonFile(storeFiles.banners, banners);
}

export async function readUsers() {
  const users = await readJsonFile<StoredUser[]>(storeFiles.users, []);
  return users.map(normalizeStoredUser);
}

export async function writeUsers(users: StoredUser[]) {
  await writeJsonFile(storeFiles.users, users);
}

export async function readOrders() {
  return readJsonFile<Order[]>(storeFiles.orders, []);
}

export async function writeOrders(orders: Order[]) {
  await writeJsonFile(storeFiles.orders, orders);
}
