"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

const SIZE_CLASSES = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${SIZE_CLASSES[size]} animate-spin text-blue-600`} />
      {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
  );
}

interface PageLoadingProps {
  height?: string;
}

export function PageLoading({ height = "h-64" }: PageLoadingProps) {
  return (
    <div className={`flex items-center justify-center ${height}`}>
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}
