"use client";

import { Users, TrendingUp, ShoppingCart, DollarSign } from "lucide-react";
import { KPICardSkeleton } from "./Skeletons";
import { formatCurrency } from "@/utils/currency";

interface KPICardsProps {
  data?: {
    kpi: {
      visitors24h: number;
      visitorsChange: string;
      websitePerformance: number;
      orders7d: number;
      revenue7d: number;
      ordersWoW: string;
      revenueWoW: string;
    };
  };
  isLoading: boolean;
}

export function KPICards({ data, isLoading }: KPICardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const kpi = data?.kpi;

  const cards = [
    {
      title: "Visitors (24h)",
      value: kpi?.visitors24h.toLocaleString() || "0",
      change: `${parseFloat(kpi?.visitorsChange || "0") >= 0 ? "+" : ""}${kpi?.visitorsChange}% vs yesterday`,
      changeType:
        parseFloat(kpi?.visitorsChange || "0") >= 0 ? "positive" : "negative",
      icon: Users,
      iconColor: "text-purple-600",
    },
    {
      title: "Website Performance",
      value: kpi?.websitePerformance || "N/A",
      change:
        kpi?.websitePerformance && kpi.websitePerformance >= 90
          ? "Excellent (Lighthouse)"
          : kpi?.websitePerformance && kpi.websitePerformance >= 50
            ? "Good (Lighthouse)"
            : "Needs Improvement",
      changeType: "neutral",
      icon: TrendingUp,
      iconColor: "text-green-600",
    },
    {
      title: "Orders (7d)",
      value: kpi?.orders7d.toLocaleString() || "0",
      change: `+${kpi?.ordersWoW || "0"}% WoW`,
      changeType: "positive",
      icon: ShoppingCart,
      iconColor: "text-purple-600",
    },
    {
      title: "Revenue (7d)",
      value: formatCurrency(kpi?.revenue7d || 0),
      change: `+${kpi?.revenueWoW || "0"}% WoW`,
      changeType: "positive",
      icon: DollarSign,
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 custom-font">
              {card.title}
            </h3>
            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
          </div>
          <p className="text-3xl font-bold text-gray-900 custom-font">
            {card.value}
          </p>
          <p
            className={`text-sm custom-font mt-1 ${
              card.changeType === "positive"
                ? "text-green-600"
                : card.changeType === "negative"
                  ? "text-red-600"
                  : "text-gray-600"
            }`}
          >
            {card.change}
          </p>
        </div>
      ))}
    </div>
  );
}
