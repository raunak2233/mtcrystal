import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import { ensureDatabaseSetup, query, withTransaction } from "@/lib/server/db";
import type {
  Banner,
  Category,
  Order,
  Payment,
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

type ProductRow = RowDataPacket & {
  id: string;
  slug: string;
  name: string;
  description: string;
  short_desc: string;
  category: string;
  price: number | string;
  image: string;
  stock: number;
  featured: number;
  new_arrival: number;
  best_seller: number;
  created_at: string;
  updated_at: string;
};

type ProductImageRow = RowDataPacket & {
  product_id: string;
  image_url: string;
  sort_order: number;
};

type ProductBulletRow = RowDataPacket & {
  product_id: string;
  bullet_point: string;
  sort_order: number;
};

type UserRow = RowDataPacket & {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  is_admin: number;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

type AddressRow = RowDataPacket & {
  id: string;
  user_id: string;
  label: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: number;
};

type CategoryRow = RowDataPacket & {
  id: string;
  name: string;
  slug: string;
  description: string;
};

type BannerRow = RowDataPacket & {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta_text: string;
  cta_link: string;
  secondary_cta_text: string | null;
  secondary_cta_link: string | null;
};

type OrderRow = RowDataPacket & {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_first_name: string;
  address_last_name: string;
  address_email: string;
  address_phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number | string;
  shipping: number | string;
  total: number | string;
  payment_method: string;
  payment_status: Order["paymentStatus"];
  payment_id: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  paid_at: string | null;
  status: Order["status"];
  created_at: string;
  updated_at: string;
};

type OrderItemRow = RowDataPacket & {
  order_id: string;
  product_id: string;
  name: string;
  price: number | string;
  quantity: number;
  image: string;
};

type PaymentRow = RowDataPacket & {
  id: string;
  order_id: string;
  user_id: string | null;
  provider: Payment["provider"];
  method: string;
  status: Payment["status"];
  amount: number | string;
  currency: string;
  provider_order_id: string | null;
  provider_payment_id: string | null;
  provider_signature: string | null;
  provider_payload_json: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

let bootstrapPromise: Promise<void> | null = null;

function nowIso() {
  return new Date().toISOString();
}

function toMysqlDateTime(value?: string | null) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    const fallback = new Date();
    return fallback.toISOString().slice(0, 19).replace("T", " ");
  }

  return date.toISOString().slice(0, 19).replace("T", " ");
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function toNumber(value: number | string | null | undefined) {
  return Number(value || 0);
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

function hydrateProducts(
  products: ProductRow[],
  images: ProductImageRow[],
  bulletPoints: ProductBulletRow[]
) {
  return products.map((product) =>
    normalizeStoredProduct({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      shortDesc: product.short_desc,
      category: product.category,
      price: toNumber(product.price),
      image: product.image,
      images: images
        .filter((item) => item.product_id === product.id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => item.image_url),
      stock: Number(product.stock),
      featured: Boolean(product.featured),
      newArrival: Boolean(product.new_arrival),
      bestSeller: Boolean(product.best_seller),
      bulletPoints: bulletPoints
        .filter((item) => item.product_id === product.id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => item.bullet_point),
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    })
  );
}

function hydrateUsers(users: UserRow[], addresses: AddressRow[]) {
  return users.map((user) =>
    normalizeStoredUser({
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.password_hash,
      isAdmin: Boolean(user.is_admin),
      phone: user.phone || "",
      addresses: addresses
        .filter((address) => address.user_id === user.id)
        .sort((a, b) => Number(b.is_default) - Number(a.is_default))
        .map((address) => ({
          id: address.id,
          label: address.label,
          firstName: address.first_name,
          lastName: address.last_name,
          email: address.email,
          phone: address.phone,
          address: address.address,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          isDefault: Boolean(address.is_default),
        })),
      createdAt: user.created_at,
    })
  );
}

function hydrateCategories(rows: CategoryRow[]): Category[] {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
  }));
}

function hydrateBanners(rows: BannerRow[]): Banner[] {
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    image: row.image,
    ctaText: row.cta_text,
    ctaLink: row.cta_link,
    secondaryCtaText: row.secondary_cta_text || "",
    secondaryCtaLink: row.secondary_cta_link || "",
  }));
}

function hydrateOrders(rows: OrderRow[], items: OrderItemRow[]): Order[] {
  return rows.map((row) => ({
    id: row.id,
    orderNumber: row.order_number,
    userId: row.user_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    address: {
      firstName: row.address_first_name,
      lastName: row.address_last_name,
      email: row.address_email,
      phone: row.address_phone,
      address: row.address_line,
      city: row.city,
      state: row.state,
      pincode: row.pincode,
    },
    items: items
      .filter((item) => item.order_id === row.id)
      .map((item) => ({
        productId: item.product_id,
        name: item.name,
        price: toNumber(item.price),
        quantity: item.quantity,
        image: item.image,
      })),
    subtotal: toNumber(row.subtotal),
    shipping: toNumber(row.shipping),
    total: toNumber(row.total),
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    paymentId: row.payment_id,
    razorpayOrderId: row.razorpay_order_id,
    razorpayPaymentId: row.razorpay_payment_id,
    razorpaySignature: row.razorpay_signature,
    paidAt: row.paid_at,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

function hydratePayments(rows: PaymentRow[]): Payment[] {
  return rows.map((row) => ({
    id: row.id,
    orderId: row.order_id,
    userId: row.user_id,
    provider: row.provider,
    method: row.method,
    status: row.status,
    amount: toNumber(row.amount),
    currency: row.currency,
    providerOrderId: row.provider_order_id || undefined,
    providerPaymentId: row.provider_payment_id || undefined,
    providerSignature: row.provider_signature || undefined,
    providerPayload: row.provider_payload_json
      ? (JSON.parse(row.provider_payload_json) as Record<string, unknown>)
      : null,
    paidAt: row.paid_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

async function tableCount(tableName: string) {
  const rows = await query<RowDataPacket[]>(`SELECT COUNT(*) AS count FROM ${tableName}`);
  return Number(rows[0]?.count || 0);
}

async function insertProducts(connection: PoolConnection, products: Product[]) {
  for (const product of products) {
    const normalized = normalizeStoredProduct(product);
    const createdAt = toMysqlDateTime(normalized.createdAt || nowIso());
    const updatedAt = toMysqlDateTime(normalized.updatedAt || createdAt);

    await connection.execute(
      `INSERT INTO products (
        id, slug, name, description, short_desc, category, price, image, stock,
        featured, new_arrival, best_seller, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        normalized.id,
        normalized.slug,
        normalized.name,
        normalized.description,
        normalized.shortDesc,
        normalized.category,
        normalized.price,
        normalized.image,
        normalized.stock,
        normalized.featured ? 1 : 0,
        normalized.newArrival ? 1 : 0,
        normalized.bestSeller ? 1 : 0,
        createdAt,
        updatedAt,
      ]
    );

    for (const [index, image] of normalized.images.entries()) {
      await connection.execute(
        "INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)",
        [normalized.id, image, index]
      );
    }

    for (const [index, bullet] of normalized.bulletPoints.entries()) {
      await connection.execute(
        "INSERT INTO product_bullet_points (product_id, bullet_point, sort_order) VALUES (?, ?, ?)",
        [normalized.id, bullet, index]
      );
    }
  }
}

async function insertUsers(connection: PoolConnection, users: StoredUser[]) {
  for (const user of users.map(normalizeStoredUser)) {
    const createdAt = toMysqlDateTime(user.createdAt || nowIso());
    const updatedAt = toMysqlDateTime(user.createdAt || nowIso());
    await connection.execute(
      "INSERT INTO users (id, name, email, password_hash, is_admin, phone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user.id,
        user.name,
        user.email,
        user.passwordHash,
        user.isAdmin ? 1 : 0,
        user.phone || "",
        createdAt,
        updatedAt,
      ]
    );

    for (const address of user.addresses || []) {
      await connection.execute(
        `INSERT INTO user_addresses (
          id, user_id, label, first_name, last_name, email, phone, address, city, state, pincode, is_default, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          address.id,
          user.id,
          address.label,
          address.firstName,
          address.lastName,
          address.email,
          address.phone,
          address.address,
          address.city,
          address.state,
          address.pincode,
          address.isDefault ? 1 : 0,
          createdAt,
          updatedAt,
        ]
      );
    }
  }
}

async function insertCategories(connection: PoolConnection, categories: Category[]) {
  const stamp = toMysqlDateTime(nowIso());
  for (const category of categories) {
    await connection.execute(
      "INSERT INTO categories (id, name, slug, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [category.id, category.name, category.slug, category.description, stamp, stamp]
    );
  }
}

async function insertBanners(connection: PoolConnection, banners: Banner[]) {
  const stamp = toMysqlDateTime(nowIso());
  for (const banner of banners) {
    await connection.execute(
      `INSERT INTO banners (
        id, title, subtitle, image, cta_text, cta_link, secondary_cta_text, secondary_cta_link, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        banner.id,
        banner.title || "",
        banner.subtitle || "",
        banner.image,
        banner.ctaText || "",
        banner.ctaLink || "/products",
        banner.secondaryCtaText || "",
        banner.secondaryCtaLink || "",
        stamp,
        stamp,
      ]
    );
  }
}

async function insertOrders(connection: PoolConnection, orders: Order[]) {
  for (const order of orders) {
    const createdAt = toMysqlDateTime(order.createdAt || nowIso());
    const updatedAt = toMysqlDateTime(order.updatedAt || createdAt);
    const paidAt = order.paidAt ? toMysqlDateTime(order.paidAt) : null;
    await connection.execute(
      `INSERT INTO orders (
        id, order_number, user_id, customer_name, customer_email, customer_phone,
        address_first_name, address_last_name, address_email, address_phone, address_line, city, state, pincode,
        subtotal, shipping, total, payment_method, payment_status, payment_id, razorpay_order_id,
        razorpay_payment_id, razorpay_signature, paid_at, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order.id,
        order.orderNumber,
        order.userId,
        order.customerName,
        order.customerEmail,
        order.customerPhone,
        order.address.firstName,
        order.address.lastName,
        order.address.email,
        order.address.phone,
        order.address.address,
        order.address.city,
        order.address.state,
        order.address.pincode,
        order.subtotal,
        order.shipping,
        order.total,
        order.paymentMethod,
        order.paymentStatus || "pending",
        order.paymentId || null,
        order.razorpayOrderId || null,
        order.razorpayPaymentId || null,
        order.razorpaySignature || null,
        paidAt,
        order.status,
        createdAt,
        updatedAt,
      ]
    );

    for (const item of order.items) {
      await connection.execute(
        "INSERT INTO order_items (order_id, product_id, name, price, quantity, image) VALUES (?, ?, ?, ?, ?, ?)",
        [order.id, item.productId, item.name, item.price, item.quantity, item.image]
      );
    }
  }
}

async function maybeBootstrapFromJson() {
  await ensureDatabaseSetup();

  if (process.env.MYSQL_BOOTSTRAP_FROM_JSON === "false") {
    return;
  }

  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = (async () => {
    const counts = await Promise.all([
      tableCount("users"),
      tableCount("categories"),
      tableCount("products"),
      tableCount("banners"),
      tableCount("orders"),
      tableCount("payments"),
    ]);

    if (counts.some((count) => count > 0)) {
      return;
    }

    const [products, categories, banners, users, orders] = await Promise.all([
      readJsonFile<Product[]>(storeFiles.products, []),
      readJsonFile<Category[]>(storeFiles.categories, []),
      readJsonFile<Banner[]>(storeFiles.banners, []),
      readJsonFile<StoredUser[]>(storeFiles.users, []),
      readJsonFile<Order[]>(storeFiles.orders, []),
    ]);

    await withTransaction(async (connection) => {
      await insertCategories(connection, categories);
      await insertProducts(connection, products);
      await insertUsers(connection, users);
      await insertBanners(connection, banners);
      await insertOrders(connection, orders);
    });
  })();

  return bootstrapPromise;
}

async function ensureStoreReady() {
  await maybeBootstrapFromJson();
}

export async function readProducts() {
  await ensureStoreReady();
  const [products, images, bulletPoints] = await Promise.all([
    query<ProductRow[]>("SELECT * FROM products ORDER BY created_at DESC, name ASC"),
    query<ProductImageRow[]>("SELECT * FROM product_images ORDER BY product_id ASC, sort_order ASC"),
    query<ProductBulletRow[]>("SELECT * FROM product_bullet_points ORDER BY product_id ASC, sort_order ASC"),
  ]);

  return hydrateProducts(products, images, bulletPoints);
}

export async function writeProducts(products: Product[]) {
  await ensureStoreReady();
  await withTransaction(async (connection) => {
    await connection.query("DELETE FROM product_bullet_points");
    await connection.query("DELETE FROM product_images");
    await connection.query("DELETE FROM products");
    await insertProducts(connection, products);
  });
}

export async function readCategories() {
  await ensureStoreReady();
  const rows = await query<CategoryRow[]>("SELECT * FROM categories ORDER BY name ASC");
  return hydrateCategories(rows);
}

export async function writeCategories(categories: Category[]) {
  await ensureStoreReady();
  await withTransaction(async (connection) => {
    await connection.query("DELETE FROM categories");
    await insertCategories(connection, categories);
  });
}

export async function readBanners() {
  await ensureStoreReady();
  const rows = await query<BannerRow[]>("SELECT * FROM banners ORDER BY created_at DESC, id ASC");
  return hydrateBanners(rows);
}

export async function writeBanners(banners: Banner[]) {
  await ensureStoreReady();
  await withTransaction(async (connection) => {
    await connection.query("DELETE FROM banners");
    await insertBanners(connection, banners);
  });
}

export async function readUsers() {
  await ensureStoreReady();
  const [users, addresses] = await Promise.all([
    query<UserRow[]>("SELECT * FROM users ORDER BY created_at ASC"),
    query<AddressRow[]>("SELECT * FROM user_addresses ORDER BY user_id ASC, is_default DESC, created_at ASC"),
  ]);

  return hydrateUsers(users, addresses);
}

export async function writeUsers(users: StoredUser[]) {
  await ensureStoreReady();
  await withTransaction(async (connection) => {
    await connection.query("DELETE FROM user_addresses");
    await connection.query("DELETE FROM users");
    await insertUsers(connection, users);
  });
}

export async function readOrders() {
  await ensureStoreReady();
  const [orders, items] = await Promise.all([
    query<OrderRow[]>("SELECT * FROM orders ORDER BY created_at DESC"),
    query<OrderItemRow[]>("SELECT * FROM order_items ORDER BY order_id ASC, id ASC"),
  ]);

  return hydrateOrders(orders, items);
}

export async function writeOrders(orders: Order[]) {
  await ensureStoreReady();
  await withTransaction(async (connection) => {
    await connection.query("DELETE FROM order_items");
    await connection.query("DELETE FROM orders");
    await insertOrders(connection, orders);
  });
}

export async function readPayments() {
  await ensureStoreReady();
  const rows = await query<PaymentRow[]>("SELECT * FROM payments ORDER BY created_at DESC");
  return hydratePayments(rows);
}

export async function writePayments(payments: Payment[]) {
  await ensureStoreReady();
  await withTransaction(async (connection) => {
    await connection.query("DELETE FROM payments");
    for (const payment of payments) {
      await connection.execute(
        `INSERT INTO payments (
          id, order_id, user_id, provider, method, status, amount, currency,
          provider_order_id, provider_payment_id, provider_signature, provider_payload_json, paid_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          payment.id,
          payment.orderId,
          payment.userId,
          payment.provider,
          payment.method,
          payment.status,
          payment.amount,
          payment.currency,
          payment.providerOrderId || null,
          payment.providerPaymentId || null,
          payment.providerSignature || null,
          payment.providerPayload ? JSON.stringify(payment.providerPayload) : null,
          payment.paidAt ? toMysqlDateTime(payment.paidAt) : null,
          toMysqlDateTime(payment.createdAt),
          toMysqlDateTime(payment.updatedAt),
        ]
      );
    }
  });
}

export async function getPaymentByOrderId(orderId: string) {
  const payments = await readPayments();
  return payments.find((payment) => payment.orderId === orderId) || null;
}

export async function upsertPayment(payment: Payment) {
  const payments = await readPayments();
  const index = payments.findIndex(
    (item) => item.id === payment.id || item.orderId === payment.orderId
  );
  if (index === -1) {
    payments.push(payment);
  } else {
    payments[index] = payment;
  }
  await writePayments(payments);
}
