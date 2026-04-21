import React from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
      data-testid="skeleton-card"
    >
      <Skeleton className="h-6 w-1/3" />
      <div className="space-y-3">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonSettings() {
  return (
    <div className="space-y-6" data-testid="skeleton-settings">
      <Skeleton className="h-8 w-1/4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-24 w-full" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <div className="flex items-center space-x-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 w-2/5" />
        </div>
      </div>
    </div>
  );
}
