"use client";

import React, { forwardRef, TextareaHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, disabled, id, ...props }, ref) => {
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          className={clsx(
            "block w-full rounded-lg border-gray-300 dark:border-gray-600",
            "shadow-sm focus:border-blue-500 focus:ring-blue-500",
            "dark:bg-gray-800 dark:text-white",
            "disabled:bg-gray-100 disabled:cursor-not-allowed",
            "transition-colors duration-200",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600",
            className,
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
