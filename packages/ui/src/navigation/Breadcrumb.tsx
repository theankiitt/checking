"use client";

import React from "react";
import { clsx } from "clsx";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
  homeIcon?: React.ReactNode;
  onNavigate?: (href: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronRight className="h-4 w-4" />,
  className,
  homeIcon = <Home className="h-4 w-4" />,
  onNavigate,
}) => {
  const handleClick = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    } else if (typeof window !== "undefined") {
      window.location.href = href;
    }
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center space-x-2">
        <li>
          <button
            onClick={() => handleClick("/")}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Go to home"
          >
            {homeIcon}
          </button>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center space-x-2">
              <span className="text-gray-400">{separator}</span>
              {isLast || !item.href ? (
                <span
                  className={clsx(
                    "text-sm font-medium",
                    isLast
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-gray-400",
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => handleClick(item.href!)}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
