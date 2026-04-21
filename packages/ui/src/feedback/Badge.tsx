"use client";

import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "md",
  dot = false,
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full";

  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {dot && (
        <span
          className={clsx(
            "mr-1.5 h-1.5 w-1.5 rounded-full",
            variant === "default" && "bg-gray-600",
            variant === "success" && "bg-green-600",
            variant === "warning" && "bg-yellow-600",
            variant === "error" && "bg-red-600",
            variant === "info" && "bg-blue-600",
          )}
        />
      )}
      {children}
    </span>
  );
};
