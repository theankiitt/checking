import { Users, Eye, Clock, BarChart3 } from "lucide-react";

export interface AnalyticsMetric {
  label: string;
  value: string;
  icon: typeof Users;
  iconBg: string;
  iconColor: string;
}

export const GOOGLE_ANALYTICS_METRICS: AnalyticsMetric[] = [
  {
    label: "Total Visitors",
    value: "24,521",
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "Page Views",
    value: "89,234",
    icon: Eye,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    label: "Bounce Rate",
    value: "32.5%",
    icon: Clock,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    label: "Avg. Session",
    value: "4:32",
    icon: BarChart3,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];
