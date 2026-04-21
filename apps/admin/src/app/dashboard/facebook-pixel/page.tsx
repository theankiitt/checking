"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { MousePointer, ShoppingCart, CreditCard, Facebook } from "lucide-react";

const FACEBOOK_PIXEL_METRICS = [
  {
    label: "Pixel Events",
    value: "1,234",
    icon: MousePointer,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "Add to Cart",
    value: "456",
    icon: ShoppingCart,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    label: "Purchases",
    value: "89",
    icon: CreditCard,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    label: "Conversion Rate",
    value: "7.2%",
    icon: Facebook,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

export default function FacebookPixelPage() {
  const [loading] = useState(false);

  return (
    <DashboardLayout title="Facebook Pixel">
      <PageHeader
        title="Facebook Pixel"
        description="Track conversions from Facebook ads"
      />

      {loading ? (
        <SkeletonGrid count={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FACEBOOK_PIXEL_METRICS.map((metric) => (
            <StatCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              icon={metric.icon}
              iconBg={metric.iconBg}
              iconColor={metric.iconColor}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
