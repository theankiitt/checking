import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
}

export function StatCard({
  label,
  value,
  change,
  trend = "up",
  icon: Icon,
  iconBg = "bg-blue-100",
  iconColor = "text-blue-600",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {change && (
          <span
            className={`flex items-center text-sm font-medium ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
    </div>
  );
}
