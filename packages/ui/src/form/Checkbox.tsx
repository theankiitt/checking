"use client";

import React, { forwardRef, InputHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, disabled, id, ...props }, ref) => {
    const checkboxId =
      id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-center">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          disabled={disabled}
          className={clsx(
            "h-4 w-4 rounded border-gray-300",
            "text-blue-600 focus:ring-blue-500",
            "disabled:bg-gray-100 disabled:cursor-not-allowed",
            "dark:border-gray-600 dark:checked:bg-blue-600",
            className,
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className={clsx(
              "ml-2 text-sm font-medium text-gray-700 dark:text-gray-300",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            {label}
          </label>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400 ml-6">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
