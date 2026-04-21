"use client";

import { Suspense } from "react";

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LazyLoader({ children, fallback }: LazyLoaderProps) {
  return (
    <Suspense
      fallback={
        fallback || (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-1/3 bg-gray-200 rounded" />
            <div className="space-y-3">
              <div className="h-10 w-full bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded" />
              <div className="h-10 w-2/3 bg-gray-200 rounded" />
            </div>
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
}
