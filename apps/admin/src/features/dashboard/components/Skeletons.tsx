import { Skeleton } from "@/components/ui/Skeleton";

export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-16 h-4" />
          </div>
          <Skeleton className="w-24 h-8 mb-2" />
          <Skeleton className="w-20 h-4" />
        </div>
      ))}
    </div>
  );
}

export function RecentOrdersTableSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <Skeleton className="w-32 h-6" />
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-24 h-4 flex-1" />
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-16 h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TopProductsListSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <Skeleton className="w-28 h-6" />
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="w-32 h-4" />
            </div>
            <Skeleton className="w-16 h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <Skeleton className="w-40 h-6 mb-4" />
      <Skeleton className="w-full h-64" />
    </div>
  );
}

export function KPICardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="w-16 h-4" />
      </div>
      <Skeleton className="w-24 h-8 mb-2" />
      <Skeleton className="w-20 h-4" />
    </div>
  );
}

export function OverviewCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-32 h-6" />
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
      <Skeleton className="w-24 h-8 mb-2" />
      <Skeleton className="w-40 h-4" />
    </div>
  );
}

export function QuickInsightSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200">
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="flex-1">
            <Skeleton className="w-3/4 h-4 mb-2" />
            <Skeleton className="w-full h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
