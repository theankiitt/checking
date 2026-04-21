"use client";

import { cn } from "@/lib/utils";

interface SliderSkeletonProps {
  className?: string;
}

export default function SliderSkeleton({ className }: SliderSkeletonProps) {
  return (
    <div
      className={cn(
        "relative max-w-[88rem] mx-auto px-4 md:px-6 lg:px-8 mt-4 h-[200px] md:h-[300px] lg:h-[400px] xl:h-[450px] rounded-xl bg-gray-200 overflow-hidden",
        className,
      )}
      role="status"
      aria-label="Loading carousel"
      aria-busy="true"
    >
      {/* Shimmer gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"
        style={{ backgroundSize: "200% 100%" }}
      />
      
      {/* Screen reader only text */}
      <span className="sr-only">Loading slider...</span>
    </div>
  );
}
