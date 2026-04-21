"use client";

import React, { HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      hoverable = false,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles = "rounded-lg bg-white dark:bg-gray-800";

    const variants = {
      default: "shadow-sm",
      bordered: "border-2 border-gray-200 dark:border-gray-700",
      elevated: "shadow-lg",
    };

    const paddings = {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    };

    return (
      <div
        ref={ref}
        className={clsx(
          baseStyles,
          variants[variant],
          paddings[padding],
          hoverable &&
            "transition-shadow duration-200 hover:shadow-md cursor-pointer",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      "px-6 py-4 border-b border-gray-200 dark:border-gray-700",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = "CardHeader";

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={clsx("px-6 py-4", className)} {...props}>
    {children}
  </div>
));

CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      "px-6 py-4 border-t border-gray-200 dark:border-gray-700",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = "CardFooter";
