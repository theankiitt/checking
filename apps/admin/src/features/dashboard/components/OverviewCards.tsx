"use client";

import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import { OverviewCardSkeleton } from "./Skeletons";
import { formatCurrency } from "@/utils/currency";

interface OverviewCardsProps {
  data?: {
    overview: {
      totalSales: number;
      totalOrders: number;
      totalProducts: number;
      totalCustomers: number;
    };
  };
  isLoading: boolean;
}

export function OverviewCards({ data, isLoading }: OverviewCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <OverviewCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const overview = data?.overview;

  const cards = [
    {
      title: "Total Sales",
      value: formatCurrency(overview?.totalSales || 0),
      icon: DollarSign,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Orders",
      value: overview?.totalOrders.toLocaleString() || "0",
      icon: ShoppingCart,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Products",
      value: overview?.totalProducts.toLocaleString() || "0",
      icon: Package,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Customers",
      value: overview?.totalCustomers.toLocaleString() || "0",
      icon: Users,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div
            className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center mb-3`}
          >
            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
          </div>
          <h3 className="text-sm font-medium text-gray-500 custom-font">
            {card.title}
          </h3>
          <p className="text-2xl font-bold text-gray-900 custom-font mt-1">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
