export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDesc: string;
  category: string;
  price: number;
  image: string;
  images: string[];
  stock: number;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  bulletPoints: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface UserAddress extends OrderAddress {
  id: string;
  label: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
  phone?: string;
  addresses?: UserAddress[];
  createdAt: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface AccountUser extends SessionUser {
  phone: string;
  addresses: UserAddress[];
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: OrderAddress;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
