export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  quantity?: number;
  stock?: number;
  image?: string;
  images?: string[];
  thumbnail?: string;
  category?: Category;
  categoryId?: string;
  averageRating?: number;
  reviewCount?: number;
  variants?: ProductVariant[];
  brand?: Brand;
  attributes?: ProductAttribute[];
  dimensions?: ProductDimensions;
  weight?: string;
  weightUnit?: string;
  currency?: string;
  currencySymbol?: string;
  currencyPrices?: ProductCurrencyPrice[];
  isActive?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCurrencyPrice {
  id: string;
  productId: string;
  country: string;
  price: number;
  comparePrice?: number;
  currency: string;
  currencySymbol: string;
  isActive: boolean;
}

export interface ProductVariant {
  id: string;
  productId?: string;
  name: string;
  value: string;
  price?: number;
  quantity?: number;
  image?: string;
  sku?: string;
  isActive?: boolean;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
}

export interface ProductDimensions {
  unit: string;
  width?: number;
  height?: number;
  length?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  disclaimer?: string;
  faqs?: FAQ[];
  isActive?: boolean;
  sortOrder?: number;
  _count?: {
    products: number;
  };
}

export interface Brand {
  id: string;
  name: string;
  slug?: string;
  logo?: string;
  description?: string;
  isActive?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Review {
  id: string;
  userId?: string;
  userName?: string;
  productId: string;
  rating: number;
  comment?: string | null;
  title?: string | null;
  date?: string;
  verified?: boolean;
  isVerified?: boolean;
  images?: string[];
  isActive?: boolean;
  createdAt?: string;
  user?: UserBasic;
}

export interface UserBasic {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface User extends UserBasic {
  phone?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id?: string;
  productId: string;
  quantity: number;
  variantId?: string;
  variant?: ProductVariant;
  product?: Product;
}

export interface Cart {
  id?: string;
  userId?: string;
  items: CartItem[];
  itemCount?: number;
  subtotal?: number;
  total?: number;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  userId?: string;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  shippingStatus?: ShippingStatus;
  subtotal?: number;
  taxAmount?: number;
  shippingAmount?: number;
  discountAmount?: number;
  total?: number;
  totalAmount?: number;
  currency?: string;
  currencySymbol?: string;
  items?: CartItem[];
  createdAt: string;
  updatedAt: string;
  shippingAddress?: Address;
  billingAddress?: Address;
  paymentMethod?: string;
  notes?: string;
  user?: UserBasic;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED"
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type ShippingStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "RETURNED";

export interface Address {
  id?: string;
  userId?: string;
  type?: "SHIPPING" | "BILLING";
  fullName?: string;
  name?: string;
  phoneNumber?: string;
  phone?: string;
  city?: string;
  streetAddress?: string;
  street?: string;
  building?: string;
  floor?: string;
  near?: string;
  additionalDetails?: string;
  postalCode?: string;
  zipCode?: string;
  country: string;
  state?: string;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WishlistItem {
  id?: string;
  productId: string;
  product?: Product;
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items?: T[];
  data?: T[];
  products?: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Filters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
  country?: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  byStatus: Record<string, number>;
  byPaymentStatus: Record<string, number>;
}
