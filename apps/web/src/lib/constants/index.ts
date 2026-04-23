export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const API_ENDPOINTS = {
  products: "/api/v1/products",
  categories: "/api/v1/categories",
  cart: "/api/v1/cart",
  orders: "/api/v1/orders",
  auth: "/api/v1/auth",
  users: "/api/v1/users",
  reviews: "/api/v1/reviews",
} as const;

export const SITE_CONFIG = {
  name: "Celebrate Multi Industries",
  tagline: "Authentic Nepali Handicrafts & Traditional Products",
  description:
    "Discover authentic Nepali handicrafts, puja samagri, musical instruments, herbs, and jewelry",
  keywords: ["nepali handicrafts", "traditional products", "nepal", "handmade"],
  author: "GharSamma",
  email: "support@gharsamma.com",
  phone: "+977-1-4XXXXXX",
  address: "Kathmandu, Nepal",
} as const;

export const DELIVERY_OPTIONS = {
  USA: {
    standard: { cost: 12, days: 5 },
    express: { cost: 25, days: 2 },
    premium: { cost: 35, days: 1 },
    "next-day": { cost: 45, days: 1 },
  },
  UK: {
    standard: { cost: 10, days: 4 },
    express: { cost: 22, days: 2 },
    premium: { cost: 32, days: 1 },
    "next-day": { cost: 42, days: 1 },
  },
  Canada: {
    standard: { cost: 11, days: 5 },
    express: { cost: 24, days: 2 },
    premium: { cost: 34, days: 1 },
    "next-day": { cost: 44, days: 1 },
  },
  Australia: {
    standard: { cost: 15, days: 6 },
    express: { cost: 30, days: 3 },
    premium: { cost: 40, days: 2 },
    "next-day": { cost: 50, days: 1 },
  },
} as const;

export const DELIVERY_COUNTRIES = ["USA", "UK", "Canada", "Australia"] as const;
export const DELIVERY_METHODS = [
  "standard",
  "express",
  "premium",
  "next-day",
] as const;

export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 12,
  maxLimit: 100,
} as const;
