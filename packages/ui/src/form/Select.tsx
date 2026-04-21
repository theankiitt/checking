"use client";

import React, {
  forwardRef,
  SelectHTMLAttributes,
  useState,
  useRef,
  useEffect,
} from "react";
import { clsx } from "clsx";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder = "Select an option",
      disabled,
      id,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (selectedValue: string) => {
      setIsOpen(false);
      onChange?.(selectedValue);
    };

    return (
      <div className="w-full" ref={selectRef}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            value={value}
            disabled={disabled}
            className={clsx(
              "block w-full rounded-lg border bg-white dark:bg-gray-800",
              "shadow-sm focus:ring-blue-500 focus:border-blue-500",
              "disabled:bg-gray-100 disabled:cursor-not-allowed",
              "transition-colors duration-200 appearance-none",
              "pl-3 pr-10 py-2",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600",
              className,
            )}
            onChange={(e) => onChange?.(e.target.value)}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>
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

Select.displayName = "Select";
