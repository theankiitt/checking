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
  category?: Category | string;
  categoryId?: string;
  tags?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  averageRating?: number;
  reviewCount?: number;
  rating?: number;
  reviews?: number;
  variants?: ProductVariant[];
  brand?: Brand;
  currency?: string;
  currencySymbol?: string;
  currencyPrices?: ProductCurrencyPrice[];
  isActive?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  isDigital?: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    reviews?: number;
  };
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
  sku?: string;
  isActive?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  isActive?: boolean;
  sortOrder?: number;
  _count?: {
    products: number;
  };
}

export interface ProductBasic {
  id: string;
  name: string;
  slug?: string;
  thumbnail?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug?: string;
  logo?: string;
  description?: string;
  isActive?: boolean;
}

export interface Review {
  id: string;
  userId?: string;
  productId: string;
  rating: number;
  comment?: string;
  title?: string;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  user?: UserBasic;
  product?: ProductBasic;
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
  _count?: {
    orders?: number;
    reviews?: number;
  };
}

export interface CartItem {
  id?: string;
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  currencySymbol: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: UserBasic;
  items?: OrderItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
  product?: ProductBasic;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

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
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country: string;
  isDefault?: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  byStatus: Record<string, number>;
  byPaymentStatus: Record<string, number>;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  breakdown: Record<number, number>;
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
}

export interface DashboardOverview {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
}

export interface DashboardKPI {
  visitors24h: number;
  visitorsChange: string;
  websitePerformance: number;
  orders7d: number;
  revenue7d: number;
  ordersWoW: string;
  revenueWoW: string;
}

export interface DashboardQuickStats {
  todayOrders: number;
  todayRevenue: number;
  yesterdayRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export interface TopProduct {
  name: string;
  price: number;
  stock: number;
}

export interface RecentOrderInfo {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  customer: {
    name: string;
  } | null;
}

export interface RecentContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  createdAt: string;
}

export interface OrdersByStatus {
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface DashboardStats {
  overview: DashboardOverview;
  kpi: DashboardKPI;
  quickStats: DashboardQuickStats;
  topProducts: TopProduct[];
  recentOrders: RecentOrderInfo[];
  recentContacts: RecentContact[];
  ordersByStatus: OrdersByStatus;
}

export interface OrderChartItem {
  date: string;
  revenue: number;
  orders: number;
}

export interface VisitorByCountry {
  country: string;
  value: number;
}

export interface ChartData {
  ordersChart: OrderChartItem[];
  visitorsByCountry: VisitorByCountry[];
}

export interface AnalyticsOverview {
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  growthRate: number;
}

export interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
  sessions: number;
}

export interface VisitorData {
  date: string;
  newVisitors: number;
  returningVisitors: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

export interface DeviceData {
  device: string;
  count: number;
  sessions: number;
  percentage: number;
}

export interface TrafficSourceData {
  source: string;
  visitors: number;
  sessions: number;
  percentage: number;
}

export interface TopPage {
  title: string;
  path: string;
  views: number;
  uniqueViews: number;
}

export interface SalesData {
  period: string;
  revenue: number;
  orders: number;
  customers: number;
  conversion: number;
  sessions: number;
  averageOrderValue: number;
}

export interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalSessions: number;
  averageOrderValue: number;
  conversionRate: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
  draftOrders: number;
  abandonedCarts: number;
  addToCartRate: number;
  checkoutRate: number;
}

export interface TopSellingProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  growth: number;
}

export interface ConversionFunnel {
  step: string;
  value: number;
  conversion: number;
}

export interface OrderStatusBreakdown {
  status: string;
  count: number;
  color: string;
}

export interface WebsiteAnalyticsData {
  overview: AnalyticsOverview;
  traffic: TrafficData[];
  visitors: VisitorData[];
  revenue: RevenueData[];
  devices: DeviceData[];
  sources: TrafficSourceData[];
  pages: TopPage[];
}

export interface SalesAnalyticsData {
  metrics: SalesMetrics;
  salesTrend: SalesData[];
  topProducts: TopSellingProduct[];
  conversionFunnel: ConversionFunnel[];
  orderStatusBreakdown: OrderStatusBreakdown[];
}
