"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { QUICK_INSIGHTS } from "@/data/mocks";

export default function QuickInsightsPage() {
  const [loading] = useState(false);

  return (
    <DashboardLayout title="Quick Insights">
      <PageHeader
        title="Quick Insights"
        description="Real-time metrics and key performance indicators"
      />

      {loading ? (
        <SkeletonGrid count={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {QUICK_INSIGHTS.map((insight) => (
            <StatCard
              key={insight.label}
              label={insight.label}
              value={insight.value}
              change={insight.change}
              trend={insight.trend}
              icon={insight.icon}
              iconBg={insight.iconBg}
              iconColor={insight.iconColor}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
