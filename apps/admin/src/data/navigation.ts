// Navigation data - extracted to a separate, maintainable file
import {
  Home,
  Bell,
  ShoppingCart,
  FolderOpen,
  Package,
  Users,
  DollarSign,
  FileText,
  Star,
  Package2,
  Layers,
  BarChart,
  Mail,
  Gift,
  PieChart,
  UserCheck,
  Percent,
  Settings,
  TrendingUp,
  BarChart3,
  ChevronRight,
  Image,
  MessageCircle,
} from "lucide-react";

export interface NavItemChild {
  id: string;
  label: string;
  icon: typeof Home;
  permission?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: typeof Home;
  permission?: string;
  children?: NavItemChild[];
}

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    permission: "dashboard",
    children: [
      { id: "quick-insights", label: "Quick Insights", icon: TrendingUp },
    ],
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    permission: "dashboard",
  },

  {
    id: "orders",
    label: "Orders",
    icon: ShoppingCart,
    permission: "orders.view",
    children: [
      {
        id: "custom-orders",
        label: "Custom Orders",
        icon: MessageCircle,
        permission: "orders.view",
      },
    ],
  },

  {
    id: "categories",
    label: "Categories",
    icon: FolderOpen,
    permission: "categories.view",
  },

  {
    id: "products",
    label: "Products",
    icon: Package,
    permission: "products.view",
  },

  {
    id: "sales",
    label: "Sales",
    icon: DollarSign,
    permission: "discounts.manage",
    children: [
      {
        id: "discounts",
        label: "Discounts",
        icon: Percent,
        permission: "discounts.manage",
      },
      {
        id: "promotions",
        label: "Promotions",
        icon: Gift,
        permission: "discounts.manage",
      },
      {
        id: "email-marketing",
        label: "Email Marketing",
        icon: Mail,
        permission: "content.manage",
      },
    ],
  },

  {
    id: "analytics",
    label: "Analytics & Reports",
    icon: BarChart3,
    permission: "analytics.view",
    children: [
      {
        id: "website-analytics",
        label: "Website Analytics",
        icon: PieChart,
        permission: "analytics.view",
      },
      {
        id: "google-analytics",
        label: "Google Analytics",
        icon: BarChart,
        permission: "analytics.view",
      },
      {
        id: "facebook-pixel",
        label: "Facebook Pixel",
        icon: BarChart,
        permission: "analytics.view",
      },
      {
        id: "sales-analytics",
        label: "Sales Analytics",
        icon: TrendingUp,
        permission: "analytics.view",
      },
      {
        id: "product-performance",
        label: "Product Performance",
        icon: BarChart,
        permission: "analytics.view",
      },
      {
        id: "customer-analytics",
        label: "Customer Analytics",
        icon: Users,
        permission: "analytics.view",
      },
      {
        id: "marketing-performance",
        label: "Marketing Performance",
        icon: PieChart,
        permission: "analytics.view",
      },
    ],
  },

  {
    id: "content-management",
    label: "Content Management",
    icon: FileText,
    permission: "content.manage",
    children: [
      {
        id: "top-banner",
        label: "Top Banner",
        icon: Package,
        permission: "content.manage",
      },
      {
        id: "popup-banner",
        label: "Pop-up Banner",
        icon: Package,
        permission: "content.manage",
      },
      {
        id: "media",
        label: "Media",
        icon: Package,
        permission: "media.manage",
      },
      {
        id: "sliders",
        label: "Sliders",
        icon: Package,
        permission: "content.manage",
      },
      {
        id: "splash-screen",
        label: "Splash Screen",
        icon: Image,
        permission: "content.manage",
      },
      {
        id: "navigation",
        label: "Navigation",
        icon: Package,
        permission: "content.manage",
      },
      {
        id: "articles",
        label: "Articles",
        icon: FileText,
        permission: "content.manage",
      },
      {
        id: "about",
        label: "About",
        icon: FileText,
        permission: "content.manage",
      },
    ],
  },

  {
    id: "users",
    label: "User Management",
    icon: UserCheck,
    permission: "users.manage",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    permission: "settings.manage",
    children: [
      {
        id: "site-settings",
        label: "Site Settings",
        icon: Settings,
        permission: "settings.manage",
      },
    ],
  },
];
