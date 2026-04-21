"use client";

import { Plus, Layout } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { DRAG_ACTIVATION_CONSTRAINT } from "../config";
import type { NavigationItem } from "../types";

interface NavigationListProps {
  items: NavigationItem[];
  onReorder: (activeId: string, overId: string | undefined) => void;
  onEdit: (item: NavigationItem) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function NavigationList({
  items,
  onReorder,
  onEdit,
  onDelete,
  onAdd,
}: NavigationListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: DRAG_ACTIVATION_CONSTRAINT,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const itemIds = items.map((item) => item.id);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-gray-500" />
          <span className="font-semibold text-gray-700">Menu Items</span>
          <span className="px-2 py-0.5 text-sm bg-gray-200 text-gray-600 rounded-full">
            {items.length}
          </span>
        </div>
        <span className="text-sm text-gray-500">Drag to reorder</span>
      </div>

      <div className="p-4 space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) =>
            onReorder(String(event.active.id), String(event.over?.id))
          }
        >
          <SortableContext
            items={itemIds}
            strategy={verticalListSortingStrategy}
          >
            {items.length === 0 ? (
              <EmptyState onAdd={onAdd} />
            ) : (
              items.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  onEdit={() => onEdit(item)}
                  onDelete={() => onDelete(item.id)}
                />
              ))
            )}
          </SortableContext>
        </DndContext>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onAdd}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Navigation Item
        </button>
      </div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-12 text-gray-500">
      <Layout className="w-12 h-12 mx-auto mb-3 text-gray-300" />
      <p>No navigation items yet</p>
      <p className="text-sm">Click below to add your first item</p>
    </div>
  );
}
