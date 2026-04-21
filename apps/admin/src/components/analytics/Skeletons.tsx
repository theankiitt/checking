"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="h-5 bg-gray-200 rounded w-40 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
}

export function TopPagesSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="text-right">
              <div className="h-4 bg-gray-200 rounded w-12"></div>
              <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 px-4">
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </td>
    </tr>
  );
}

export function TopProductsTableSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="h-5 bg-gray-200 rounded w-48 mb-4"></div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ConversionRateSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="h-5 bg-gray-200 rounded w-40 mb-4"></div>
      <div className="h-64 flex items-end justify-between space-x-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-2">
            <div
              className="bg-gray-200 rounded-t w-8"
              style={{ height: `${Math.random() * 150 + 50}px` }}
            ></div>
            <div className="h-3 bg-gray-200 rounded w-8"></div>
            <div className="h-3 bg-gray-200 rounded w-6"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
