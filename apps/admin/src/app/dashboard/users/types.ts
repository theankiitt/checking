export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: "ADMIN" | "STAFF" | "MANAGER";
  isActive: boolean;
  permissions: string[];
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface CreateUserInput {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: "STAFF" | "MANAGER";
  permissions: string[];
}

export interface UpdateUserInput {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: "STAFF" | "MANAGER";
  isActive?: boolean;
  permissions?: string[];
}

export const PERMISSIONS = [
  { id: "dashboard", label: "Dashboard", category: "general" },
  { id: "orders.view", label: "View Orders", category: "orders" },
  { id: "orders.create", label: "Create Orders", category: "orders" },
  { id: "orders.update", label: "Update Orders", category: "orders" },
  { id: "orders.delete", label: "Delete Orders", category: "orders" },
  { id: "products.view", label: "View Products", category: "products" },
  { id: "products.create", label: "Create Products", category: "products" },
  { id: "products.update", label: "Update Products", category: "products" },
  { id: "products.delete", label: "Delete Products", category: "products" },
  { id: "categories.view", label: "View Categories", category: "categories" },
  {
    id: "categories.manage",
    label: "Manage Categories",
    category: "categories",
  },
  { id: "customers.view", label: "View Customers", category: "customers" },
  { id: "customers.manage", label: "Manage Customers", category: "customers" },
  { id: "reviews.manage", label: "Manage Reviews", category: "customers" },
  { id: "discounts.manage", label: "Manage Discounts", category: "sales" },
  { id: "analytics.view", label: "View Analytics", category: "analytics" },
  { id: "settings.manage", label: "Manage Settings", category: "settings" },
  { id: "users.manage", label: "Manage Users", category: "settings" },
  { id: "media.manage", label: "Manage Media", category: "content" },
  { id: "content.manage", label: "Manage Content", category: "content" },
];

export const PERMISSION_CATEGORIES = [
  { id: "general", label: "General" },
  { id: "orders", label: "Orders" },
  { id: "products", label: "Products" },
  { id: "categories", label: "Categories" },
  { id: "customers", label: "Customers" },
  { id: "sales", label: "Sales & Discounts" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Settings & Users" },
  { id: "content", label: "Content Management" },
];

export const PERMISSION_PRESETS = [
  {
    id: "order_manager",
    label: "Order Manager",
    description: "Full access to orders and basic product viewing",
    permissions: [
      "orders.view",
      "orders.create",
      "orders.update",
      "products.view",
      "customers.view",
    ],
  },
  {
    id: "product_manager",
    label: "Product Manager",
    description: "Manage products, categories, and inventory",
    permissions: [
      "products.view",
      "products.create",
      "products.update",
      "products.delete",
      "categories.view",
      "categories.manage",
    ],
  },
  {
    id: "customer_support",
    label: "Customer Support",
    description: "View customers, orders, and manage reviews",
    permissions: [
      "customers.view",
      "customers.manage",
      "orders.view",
      "reviews.manage",
    ],
  },
  {
    id: "content_editor",
    label: "Content Editor",
    description: "Manage media, sliders, and promotional content",
    permissions: [
      "media.manage",
      "content.manage",
      "products.view",
      "categories.view",
    ],
  },
  {
    id: "analytics_viewer",
    label: "Analytics Viewer",
    description: "View-only access to analytics and reports",
    permissions: ["dashboard", "analytics.view"],
  },
];
