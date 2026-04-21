"use client";

import React, { useMemo, useState } from "react";
import { clsx } from "clsx";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  isLoading?: boolean;
  emptyMessage?: string;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectChange?: (ids: string[]) => void;
  onRowClick?: (item: T) => void;
  className?: string;
  stickyHeader?: boolean;
  maxHeight?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onSort,
  sortKey,
  sortDirection,
  isLoading = false,
  emptyMessage = "No data available",
  selectable = false,
  selectedIds = [],
  onSelectChange,
  onRowClick,
  className,
  stickyHeader = false,
  maxHeight,
}: DataTableProps<T>) {
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>([]);
  const currentSelectedIds = selectable
    ? onSelectChange
      ? selectedIds
      : localSelectedIds
    : [];

  const handleSelectAll = () => {
    if (currentSelectedIds.length === data.length) {
      if (onSelectChange) {
        onSelectChange([]);
      } else {
        setLocalSelectedIds([]);
      }
    } else {
      const allIds = data.map(keyExtractor);
      if (onSelectChange) {
        onSelectChange(allIds);
      } else {
        setLocalSelectedIds(allIds);
      }
    }
  };

  const handleSelectRow = (id: string) => {
    const newIds = currentSelectedIds.includes(id)
      ? currentSelectedIds.filter((i) => i !== id)
      : [...currentSelectedIds, id];

    if (onSelectChange) {
      onSelectChange(newIds);
    } else {
      setLocalSelectedIds(newIds);
    }
  };

  const handleSort = (key: string) => {
    if (!onSort) return;

    const direction =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    onSort(key, direction);
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const renderSortIcon = (key: string) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  return (
    <div className={clsx("flex flex-col", className)}>
      <div
        className={clsx(
          "overflow-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700",
          stickyHeader && maxHeight,
        )}
        style={maxHeight ? { maxHeight } : undefined}
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead
            className={clsx(
              "bg-gray-50 dark:bg-gray-900",
              stickyHeader && "sticky top-0 z-10",
            )}
          >
            <tr>
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      currentSelectedIds.length === data.length &&
                      data.length > 0
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={clsx(
                    "px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                    column.sortable &&
                      "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <tr key={index}>
                  {selectable && (
                    <td className="px-4 py-3">
                      <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const id = keyExtractor(item);
                const isSelected = currentSelectedIds.includes(id);

                return (
                  <tr
                    key={id}
                    className={clsx(
                      "hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors",
                      isSelected && "bg-blue-50 dark:bg-blue-900/10",
                      onRowClick && "cursor-pointer",
                    )}
                    onClick={() => onRowClick?.(item)}
                  >
                    {selectable && (
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(id)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={clsx(
                          "px-4 py-3 text-sm text-gray-900 dark:text-gray-100",
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right",
                        )}
                      >
                        {column.render
                          ? column.render(item, index)
                          : item[column.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{startItem}</span> to{" "}
            <span className="font-medium">{endItem}</span> of{" "}
            <span className="font-medium">{totalItems}</span> results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(1)}
              disabled={currentPage === 1}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange?.(pageNum)}
                    className={clsx(
                      "w-8 h-8 rounded text-sm font-medium transition-colors",
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange?.(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
