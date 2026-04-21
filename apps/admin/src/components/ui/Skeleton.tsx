"use client";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200";

  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const style: React.CSSProperties = {
    width: width ?? (variant === "circular" ? 40 : "100%"),
    height: height ?? (variant === "text" ? 16 : 100),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton width={60} height={20} />
      </div>
      <Skeleton width="60%" height={24} className="mb-2" />
      <Skeleton width="40%" height={16} />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex gap-4">
          <Skeleton width={100} height={20} />
          <Skeleton width={150} height={20} />
          <Skeleton width={80} height={20} />
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-gray-100 last:border-0">
          <div className="flex gap-4 items-center">
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton width="30%" height={16} />
            <Skeleton width="20%" height={16} />
            <Skeleton width={80} height={24} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
