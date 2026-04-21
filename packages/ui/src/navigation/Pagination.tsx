"use client";

import React from "react";
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
  boundaryCount?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  siblingCount = 1,
  boundaryCount = 1,
}) => {
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const getPages = () => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2 + boundaryCount;
    const shouldShowRightDots =
      rightSiblingIndex < totalPages - (2 + boundaryCount);

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = range(1, 3 + boundaryCount);
      return [
        ...leftRange,
        "...",
        range(totalPages - boundaryCount + 1, totalPages),
      ];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = range(
        totalPages - (3 + boundaryCount - 1),
        totalPages,
      );
      return [...range(1, boundaryCount), "...", ...rightRange];
    }

    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [
      ...range(1, boundaryCount),
      "...",
      ...middleRange,
      "...",
      ...range(totalPages - boundaryCount + 1, totalPages),
    ];
  };

  const pages = getPages();

  return (
    <nav
      className={clsx("flex items-center justify-center gap-1", className)}
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={clsx(
          "p-2 rounded-lg transition-colors",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "text-gray-700 dark:text-gray-300",
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-gray-500 dark:text-gray-400"
            >
              ...
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page as number)}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={clsx(
          "p-2 rounded-lg transition-colors",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "text-gray-700 dark:text-gray-300",
        )}
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
};
