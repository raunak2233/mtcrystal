export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDesc: string;
  /** Primary category slug, used for breadcrumbs and related products. */
  category: string;
  /** Every category slug this product belongs to, including the primary one. */
  categories: string[];
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
  /** Null for a top-level group such as "Chakras". Categories nest one level only. */
  parentId: string | null;
  sortOrder: number;
}

export interface CategoryNode extends Category {
  children: Category[];
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

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  message: string;
  product: string;
  image: string;
  reviewDate: string;
  featured: boolean;
  sortOrder: number;
}

export interface SiteSettings {
  brandTagline: string;
  footerAbout: string;
  contactEmail: string;
  supportEmail: string;
  phonePrimary: string;
  phoneSecondary: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  businessHours: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  whatsappUrl: string;
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

export type PaymentStatus =
  | "pending"
  | "created"
  | "authorized"
  | "captured"
  | "paid"
  | "failed"
  | "refunded";

export interface Payment {
  id: string;
  orderId: string;
  userId: string | null;
  provider: "razorpay" | "manual";
  method: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  providerOrderId?: string;
  providerPaymentId?: string;
  providerSignature?: string;
  providerPayload?: Record<string, unknown> | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

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
  paymentStatus: PaymentStatus;
  paymentId?: string | null;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  paidAt?: string | null;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
