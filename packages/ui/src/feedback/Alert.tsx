"use client";

import React from "react";
import { clsx } from "clsx";

export interface AlertProps {
  children: React.ReactNode;
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = "info",
  title,
  onClose,
  className,
}) => {
  const variants = {
    info: {
      container:
        "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-300",
      title: "text-blue-900 dark:text-blue-200",
    },
    success: {
      container:
        "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
      text: "text-green-800 dark:text-green-300",
      title: "text-green-900 dark:text-green-200",
    },
    warning: {
      container:
        "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-800 dark:text-yellow-300",
      title: "text-yellow-900 dark:text-yellow-200",
    },
    error: {
      container:
        "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-300",
      title: "text-red-900 dark:text-red-200",
    },
  };

  return (
    <div
      className={clsx(
        "border rounded-lg p-4",
        variants[variant].container,
        className,
      )}
      role="alert"
    >
      {title && (
        <h4 className={clsx("font-semibold mb-1", variants[variant].title)}>
          {title}
        </h4>
      )}
      <div className={clsx("text-sm", variants[variant].text)}>{children}</div>
    </div>
  );
};
