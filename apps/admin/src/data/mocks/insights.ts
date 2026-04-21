import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export interface Insight {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: typeof DollarSign;
  iconBg?: string;
  iconColor?: string;
}

export const QUICK_INSIGHTS: Insight[] = [
  {
    label: "Total Revenue",
    value: "$12,450",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    label: "Orders",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "New Customers",
    value: "43",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    label: "Products Sold",
    value: "289",
    change: "-3.1%",
    trend: "down",
    icon: Package,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];
