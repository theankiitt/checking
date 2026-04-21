import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("animate-pulse bg-gray-200 rounded", className)} />;
}

export function ProductCardSkeleton({
  viewMode = "grid",
}: {
  viewMode?: "grid" | "list";
}) {
  if (viewMode === "list") {
    return (
      <div className="flex gap-4 bg-white rounded-lg shadow-md p-4">
        <Skeleton className="w-32 h-32 rounded-lg" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <Skeleton className="aspect-square" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({
  count = 6,
  viewMode = "grid",
}: {
  count?: number;
  viewMode?: "grid" | "list";
}) {
  return (
    <div
      className={cn(
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4",
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <Skeleton className="h-8 w-64" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Skeleton className="lg:col-span-5 aspect-square" />
        <div className="lg:col-span-4 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="lg:col-span-3 h-64" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
