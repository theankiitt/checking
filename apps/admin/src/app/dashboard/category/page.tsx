"use client";

import { useState } from "react";
import { Search, Plus, Grid3X3, List, X, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import {
  useCategories,
  getFullImageUrl,
  type Category,
  type CategoryFormData,
} from "@/features/categories";
import { CategoryCard, CategoryModal } from "@/features/categories/components";
import { manrope } from "@/lib/fonts";

type ViewMode = "grid" | "list";

export default function CategoryPage() {
  const {
    categories,
    loading,
    error,
    isUploading,
    isDeleting,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadImage,
    fetchCategories,
  } = useCategories();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ id: string; name: string } | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredCategories = categories.filter((category) => {
    if (category.parentId) return false;
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const subCategoryMatches = category.subCategories?.some((subCat) =>
      subCat.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    return matchesSearch || subCategoryMatches;
  });

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteItem({ id, name });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    const success = await deleteCategory(deleteItem.id);
    if (success) {
      setShowDeleteModal(false);
      setDeleteItem(null);
    }
  };

  const handleImagePreview = (imageUrl: string) => {
    setPreviewImage(getFullImageUrl(imageUrl));
    setShowImagePreview(true);
  };

  const handleAddSub = (category: Category) => {
    setEditingCategory({
      ...category,
      isSubCategory: true,
      parentId: category.id,
      _isAddingSub: true,
    } as Category);
    setShowModal(true);
  };

  const handleSubmit = async (data: CategoryFormData, imageFile?: File) => {
    setIsSubmitting(true);
    try {
      let finalImage: string | null = data.image;

      if (editingCategory && !imageFile) {
        finalImage = editingCategory.image;
      }

      if (imageFile) {
        try {
          finalImage = await uploadImage(imageFile);
        } catch (uploadError) {
          toast.error("Failed to upload image. Please try again.");
          return;
        }
      }

      if (finalImage === "/image.png" || finalImage === "") {
        finalImage = editingCategory?.image && editingCategory.image !== "/image.png"
          ? editingCategory.image
          : null;
      }

      const categoryData = {
        ...data,
        image: finalImage || undefined,
      };

      let success;
      const isAddingSub = (editingCategory as any)?._isAddingSub;

      if (editingCategory && !isAddingSub) {
        success = await updateCategory(editingCategory.id, categoryData);
      } else {
        const result = await createCategory(categoryData);
        success = result.success;
      }

      if (success) {
        setShowModal(false);
        setEditingCategory(null);
      }
    } catch (error) {
      toast.error("Failed to save category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Category Management" showBackButton>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4" />
            <p className="text-gray-600 text-sm">Loading categories...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Category Management" showBackButton>
      <div className="h-full flex flex-col tracking-tight">
        {/* Header */}
        <motion.div
          className="flex-shrink-0 p-6 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className={`text-3xl font-extrabold text-black mb-1 tracking-tight ${manrope.className}`}>Categories</h1>
              <p className="text-lg text-gray-500">
                {filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"} found
              </p>
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm text-black bg-gray-50 focus:bg-white transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  title="Grid view"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2.5 rounded-lg transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 font-medium shrink-0"
              >
                <Plus className="w-5 h-5" />
                <span>Add Category</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            className="flex-shrink-0 bg-white rounded-xl border border-red-200 p-8 mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-center">
           
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load</h3>
              <p className="text-gray-600 mb-4 text-sm">{error}</p>
              <button
                onClick={fetchCategories}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!error && paginatedCategories.length === 0 && (
          <motion.div
            className="flex-shrink-0 bg-white h-[60vh] rounded-xl border border-gray-200 p-8 mb-4 justify-center items-center flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
             
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "No Results Found" : "No Categories Yet"}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                {searchTerm
                  ? `No categories match "${searchTerm}". Try a different search.`
                  : "Create your first category to get started."}
              </p>
            </div>
          </motion.div>
        )}

        {/* Categories Grid/List */}
        {!error && paginatedCategories.length > 0 && (
          <motion.div
            className={`flex-1 bg-white rounded-xl border border-gray-200 p-6 overflow-y-auto ${
              viewMode === "grid"
                ? "grid grid-cols-2 md:grid-cols-3 gap-4"
                : "space-y-3"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {paginatedCategories.map((category, index) => (
              <div key={category.id}>
                <CategoryCard
                  category={category}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAddSub={handleAddSub}
                  onImagePreview={handleImagePreview}
                  isDeleting={isDeleting}
                />
              </div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="flex-shrink-0 flex items-center justify-center gap-1 mt-4 bg-white rounded-xl border border-gray-200 p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    currentPage === page
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSubmit}
        editingCategory={editingCategory}
        isLoading={isSubmitting}
        categories={categories}
        isUploading={isUploading}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <Trash className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Category</h3>
                <p className="text-gray-600 text-sm">
                  Are you sure you want to delete <strong>"{deleteItem?.name}"</strong>? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteItem(null);
                  }}
                  className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {showImagePreview && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImagePreview(false)}
          >
            <motion.img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onError={(e) => {
                e.currentTarget.src = "/image.png";
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
