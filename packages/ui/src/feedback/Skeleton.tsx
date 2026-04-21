"use client";

import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "text",
  width,
  height,
  animation = "pulse",
  style,
  ...props
}) => {
  const baseStyles = "bg-gray-200 dark:bg-gray-700 rounded";

  const variants = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const animations = {
    pulse: "animate-pulse",
    wave: "animate-pulse",
    none: "",
  };

  return (
    <div
      className={clsx(
        baseStyles,
        variants[variant],
        animations[animation],
        className,
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
};

export const SkeletonCard: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <div className="space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="text" width="80%" />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <Skeleton key={i} variant="text" width="100%" />
      ))}
      <div className="flex gap-2">
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" className="flex-1" />
      </div>
    </div>
  );
};
