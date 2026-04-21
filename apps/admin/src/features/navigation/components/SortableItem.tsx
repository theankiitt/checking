"use client";

import { GripVertical, Edit, Trash2, Link as LinkIcon } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { NAVIGATION_CONFIG } from "../config";
import type { NavigationItem } from "../types";

interface SortableItemProps {
  item: NavigationItem;
  onEdit: () => void;
  onDelete: () => void;
}

export function SortableItem({ item, onEdit, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isDropdown = item.type === "dropdown";
  const typeColors = NAVIGATION_CONFIG.colors[isDropdown ? "dropdown" : "link"];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-300 rounded-xl p-4 transition-all duration-200 shadow-sm hover:shadow-md ${isDragging ? "ring-2 ring-blue-500" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${typeColors.bg} ${typeColors.text}`}
          >
            {isDropdown ? "Mega Menu" : "Link"}
          </span>
          <span className="font-semibold text-gray-900 truncate">
            {item.label}
          </span>
        </div>
        <p className="text-sm text-gray-500 truncate mt-1 flex items-center gap-1">
          <LinkIcon className="w-3 h-3 flex-shrink-0" />
          {item.href}
          {item.columns && item.columns.length > 0 && (
            <span className="ml-2 text-xs text-purple-600">
              {item.columns.length} columns
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className={`p-2 rounded-lg transition-colors ${NAVIGATION_CONFIG.buttons.edit.bg} ${NAVIGATION_CONFIG.buttons.edit.text}`}
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className={`p-2 rounded-lg transition-colors ${NAVIGATION_CONFIG.buttons.delete.bg} ${NAVIGATION_CONFIG.buttons.delete.text}`}
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
