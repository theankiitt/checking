"use client";

import { useState } from "react";
import {
  Plus,
  Upload,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  X,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { manrope } from "@/lib/fonts";
import { useSliders, useImageUpload, type SliderImage, type FormData } from "@/features/sliders/hooks";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function SliderCard({
  slider,
  index,
  totalSliders,
  onEdit,
  onDelete,
  onToggle,
  onReorder,
  baseUrl,
  isDeleting,
  isToggling,
}: {
  slider: SliderImage;
  index: number;
  totalSliders: number;
  onEdit: (slider: SliderImage) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, isActive: boolean) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
  baseUrl: string;
  isDeleting: boolean;
  isToggling: boolean;
}) {
  const imageSrc = slider.imageUrl.startsWith("http")
    ? slider.imageUrl
    : `${baseUrl}${slider.imageUrl}`;

  return (
    <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 bg-gray-100">
        {slider.imageUrl ? (
          <img
            src={imageSrc}
            alt={`Slider ${slider.order}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}

        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              slider.isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {slider.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="absolute top-2 left-2">
          <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium">
            #{slider.order}
          </span>
        </div>
      </div>

      <div className="p-4">
        {slider.internalLink && (
          <p className="text-blue-600 text-sm mb-3 truncate">
            Link: {slider.internalLink}
          </p>
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => onReorder(slider.id, "up")}
              disabled={index === 0}
              className="p-1 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => onReorder(slider.id, "down")}
              disabled={index === totalSliders - 1}
              className="p-1 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex space-x-2">
            {slider.internalLink && (
              <a
                href={slider.internalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-600 rounded bg-gray-200"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={() => onToggle(slider.id, slider.isActive)}
              disabled={isToggling}
              className={`p-1 rounded disabled:opacity-50 ${
                slider.isActive ? "text-green-600" : "text-gray-400"
              }`}
            >
              {isToggling ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : slider.isActive ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => onEdit(slider)}
              className="p-1 text-blue-600 rounded"
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(slider.id)}
              disabled={isDeleting}
              className="p-1 text-red-600 rounded disabled:opacity-50"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderModal({
  isOpen,
  onClose,
  onSubmit,
  editingSlider,
  formData,
  onFormChange,
  onImageUpload,
  uploading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingSlider: SliderImage | null;
  formData: FormData;
  onFormChange: (data: FormData) => void;
  onImageUpload: (file: File) => Promise<string>;
  uploading: boolean;
}) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await onImageUpload(file);
        onFormChange({ ...formData, imageUrl: url });
      } catch {
        // Error handled in onImageUpload
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/20 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400"
        >
          <X className="w-6 h-6" />
        </button>

        <h2
          className={`text-xl font-bold mb-4 text-black ${manrope.className}`}
        >
          {editingSlider ? "Edit Slider" : "Add New Slider"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium text-black mb-1 ${manrope.className}`}
            >
              Image *
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              <Upload className="w-5 h-5 text-gray-400" />
            </div>
            {formData.imageUrl && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div>
            <label
              className={`block text-sm font-medium text-black mb-1 ${manrope.className}`}
            >
              Internal Link
            </label>
            <input
              type="text"
              value={formData.internalLink}
              onChange={(e) =>
                onFormChange({ ...formData, internalLink: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="/products/category-slug or /foods"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                onFormChange({ ...formData, isActive: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isActive"
              className={`ml-2 block text-sm text-black ${manrope.className}`}
            >
              Active (visible on website)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-gray-700 bg-gray-200 rounded-lg ${manrope.className}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !formData.imageUrl}
              className={`px-4 py-2 bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${manrope.className}`}
            >
              {uploading ? "Uploading..." : editingSlider ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/20 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400"
        >
          <X className="w-6 h-6" />
        </button>
        <h2
          className={`text-xl font-bold mb-4 text-black ${manrope.className}`}
        >
          Delete Slider
        </h2>
        <p className={`text-black mb-6 ${manrope.className}`}>
          Are you sure you want to delete this slider? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-gray-700 bg-gray-200 rounded-lg ${manrope.className}`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 bg-red-600 text-white rounded-lg ${manrope.className}`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-12">
      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3
        className={`text-lg font-medium text-gray-900 mb-2 ${manrope.className}`}
      >
        No sliders found
      </h3>
      <p className={`text-gray-600 mb-4 ${manrope.className}`}>
        Get started by creating your first slider
      </p>
      <button
        onClick={onAdd}
        className={`bg-orange-600 text-white px-4 py-2 rounded-lg ${manrope.className}`}
      >
        Add New Slider
      </button>
    </div>
  );
}

export default function SlidersPage() {
  const { sliders, loading, error, isDeleting, isToggling, createSlider, updateSlider, deleteSlider, toggleSlider, reorderSliders } = useSliders();
  const { uploadImage, uploading } = useImageUpload();

  const [showModal, setShowModal] = useState(false);
  const [editingSlider, setEditingSlider] = useState<SliderImage | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sliderToDelete, setSliderToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    imageUrl: "",
    internalLink: "",
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = editingSlider
      ? await updateSlider(editingSlider.id, formData)
      : await createSlider(formData);

    if (success) {
      toast.success(editingSlider ? "Slider updated" : "Slider created");
      closeModal();
    } else {
      toast.error("Failed to save slider");
    }
  };

  const handleDelete = async () => {
    if (!sliderToDelete) return;
    const success = await deleteSlider(sliderToDelete);
    if (success) {
      toast.success("Slider deleted");
      setShowDeleteModal(false);
      setSliderToDelete(null);
    } else {
      toast.error("Failed to delete slider");
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    const success = await toggleSlider(id, isActive);
    if (success) {
      toast.success("Slider status updated");
    } else {
      toast.error("Failed to update slider");
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const currentIndex = sliders.findIndex((s) => s.id === id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= sliders.length) return;

    const newSliders = [...sliders];
    [newSliders[currentIndex], newSliders[newIndex]] = [
      newSliders[newIndex],
      newSliders[currentIndex],
    ];

    newSliders.forEach((slider, index) => {
      slider.order = index + 1;
    });

    const success = await reorderSliders(newSliders);
    if (success) {
      toast.success("Slider order updated");
    } else {
      toast.error("Failed to update order");
    }
  };

  const openEditModal = (slider: SliderImage) => {
    setEditingSlider(slider);
    setFormData({
      imageUrl: slider.imageUrl,
      internalLink: slider.internalLink,
      isActive: slider.isActive,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSlider(null);
    setFormData({ imageUrl: "", internalLink: "", isActive: true });
  };

  const openAddModal = () => {
    setFormData({ imageUrl: "", internalLink: "", isActive: true });
    setEditingSlider(null);
    setShowModal(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 bg-white rounded-md shadow-md h-[80vh]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className={`text-2xl font-bold text-gray-900 ${manrope.className}`}
            >
              Slider Management
            </h1>
            <p className="text-gray-600">
              Manage your website slider images and content
            </p>
          </div>
          <button
            onClick={openAddModal}
            className={`bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 ${manrope.className}`}
          >
            <Plus className="w-5 h-5" />
            <span>Add New Slider</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {sliders.length === 0 ? (
          <EmptyState onAdd={openAddModal} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sliders.map((slider, index) => (
              <SliderCard
                key={slider.id}
                slider={slider}
                index={index}
                totalSliders={sliders.length}
                onEdit={openEditModal}
                onDelete={(id) => {
                  setSliderToDelete(id);
                  setShowDeleteModal(true);
                }}
                onToggle={handleToggle}
                onReorder={handleReorder}
                baseUrl={API_BASE_URL}
                isDeleting={isDeleting(slider.id)}
                isToggling={isToggling(slider.id)}
              />
            ))}
          </div>
        )}

        <SliderModal
          isOpen={showModal}
          onClose={closeModal}
          onSubmit={handleSubmit}
          editingSlider={editingSlider}
          formData={formData}
          onFormChange={setFormData}
          onImageUpload={uploadImage}
          uploading={uploading}
        />

        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSliderToDelete(null);
          }}
          onConfirm={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}
