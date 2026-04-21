"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import {
  useBanners as useTopBanners,
  useCreateBanner as useCreateTopBanner,
  useUpdateBanner as useUpdateTopBanner,
  useDeleteBanner as useDeleteTopBanner,
  useToggleBanner as useToggleTopBanner,
  Banner,
} from "@/hooks/useTopBanners";
import {
  BannerList,
  BannerForm,
  DeleteConfirmModal,
} from "@/features/banners/components";
import { Plus } from "lucide-react";
import { CreateBannerInput, UpdateBannerInput } from "@/features/banners/api";

export default function TopBannerPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data: banners = [], isLoading } = useTopBanners();
  const createBanner = useCreateTopBanner();
  const updateBanner = useUpdateTopBanner();
  const deleteBanner = useDeleteTopBanner();
  const toggleBanner = useToggleTopBanner();

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setConfirmDelete(id);
  };

  const confirmDeleteBanner = () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete);
    deleteBanner.mutate(confirmDelete, {
      onSettled: () => {
        setDeletingId(null);
        setConfirmDelete(null);
      },
    });
  };

  const handleToggleStatus = (id: string) => {
    setTogglingId(id);
    toggleBanner.mutate(id, {
      onSettled: () => setTogglingId(null),
    });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBanner(null);
  };

  const handleNewBanner = () => {
    setEditingBanner(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: CreateBannerInput | UpdateBannerInput) => {
    if (editingBanner) {
      updateBanner.mutate(
        { id: editingBanner.id, data },
        { onSuccess: () => handleCloseForm() },
      );
    } else {
      createBanner.mutate(data as CreateBannerInput, {
        onSuccess: () => handleCloseForm(),
      });
    }
  };

  const isSubmitting = createBanner.isPending || updateBanner.isPending;

  return (
    <DashboardLayout title="Top Banner Management" showBackButton={true}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Top Banner Management
            </h1>
            <p className="text-gray-600">
              Manage promotional banners that appear at the top of your website
            </p>
          </div>
          <button
            onClick={handleNewBanner}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Banner
          </button>
        </div>

        <BannerList
          banners={banners}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={handleToggleStatus}
          onAddNew={handleNewBanner}
          togglingId={togglingId}
          deletingId={deletingId}
        />

        <AnimatePresence>
          {isFormOpen && (
            <BannerForm
              banner={editingBanner}
              isSubmitting={isSubmitting}
              onSubmit={handleFormSubmit}
              onClose={handleCloseForm}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          <DeleteConfirmModal
            isOpen={!!confirmDelete}
            isDeleting={deletingId !== null}
            onConfirm={confirmDeleteBanner}
            onCancel={() => setConfirmDelete(null)}
          />
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
