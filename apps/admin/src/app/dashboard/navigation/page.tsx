"use client";

import { useState, useCallback } from "react";
import { Save, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageLoading } from "@/components/ui/LoadingSpinner";
import {
  useNavigation,
  useNavigationItems,
  createEmptyFormData,
  buildFormDataFromItem,
  createNavigationItem,
} from "@/features/navigation/hooks/useNavigation";
import { NavigationList } from "@/features/navigation/components/NavigationList";
import { NavigationItemForm } from "@/features/navigation/components/NavigationItemForm";
import { ConfirmModal } from "@/features/navigation/components/ConfirmModal";
import type { NavigationItem, FormData } from "@/features/navigation/types";

function NavigationError({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl border border-gray-200 p-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Failed to load navigation
      </h3>
      <p className="text-gray-500 mb-4 text-center max-w-md">
        {error?.message ||
          "An unexpected error occurred while loading the navigation data."}
      </p>
      <Button onClick={onRetry} variant="danger">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
}

function NavigationContent() {
  const {
    items: initialItems,
    categories,
    isLoading,
    isSaving,
    isError,
    error,
    saveNavigation,
    refetch,
  } = useNavigation();

  const { items, setItems, handleDragEnd, updateItem, deleteItem } =
    useNavigationItems(initialItems);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [formData, setFormData] = useState<FormData>(createEmptyFormData());
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({ isOpen: false, id: null });

  const openModal = useCallback(
    (item?: NavigationItem) => {
      setEditingItem(item || null);
      setFormData(
        item
          ? buildFormDataFromItem(item, categories)
          : { ...createEmptyFormData(), id: `nav-${Date.now()}` },
      );
      setShowModal(true);
    },
    [categories],
  );

  const handleSaveItem = useCallback(() => {
    const newItem = createNavigationItem(formData);
    if (editingItem) {
      updateItem(editingItem.id, newItem);
    } else {
      setItems((prev) => [...prev, newItem]);
    }
    setShowModal(false);
  }, [editingItem, formData, updateItem, setItems]);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.id) {
      deleteItem(deleteConfirm.id);
      setDeleteConfirm({ isOpen: false, id: null });
    }
  }, [deleteConfirm.id, deleteItem]);

  if (isLoading) {
    return <PageLoading />;
  }

  if (isError) {
    return <NavigationError error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Navigation Management"
          description="Manage your website navigation menu and dropdowns"
        />
        <Button
          onClick={() => saveNavigation(items)}
          disabled={isSaving}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </Button>
      </div>

      <NavigationList
        items={items}
        onReorder={handleDragEnd}
        onEdit={openModal}
        onDelete={(id) => setDeleteConfirm({ isOpen: true, id })}
        onAdd={() => openModal()}
      />

      <NavigationItemForm
        isOpen={showModal}
        editingItem={editingItem}
        formData={formData}
        categories={categories}
        onFormDataChange={(data) =>
          setFormData((prev) => ({ ...prev, ...data }))
        }
        onSave={handleSaveItem}
        onClose={() => setShowModal(false)}
      />

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Navigation Item"
        message="Are you sure you want to delete this navigation item?"
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null })}
      />
    </div>
  );
}

export default function NavigationPage() {
  return (
    <DashboardLayout title="Navigation Management">
      <ErrorBoundary>
        <NavigationContent />
      </ErrorBoundary>
    </DashboardLayout>
  );
}
