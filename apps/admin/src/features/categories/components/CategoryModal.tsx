"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Upload, Loader2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import type { Category, CategoryFormData } from "../types";
import { getFullImageUrl } from "../hooks/useCategories";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData, imageFile?: File) => Promise<void>;
  editingCategory: Category | null;
  isLoading: boolean;
  categories: Category[];
  isUploading: boolean;
}

export function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
  isLoading,
  categories,
  isUploading,
}: CategoryModalProps) {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parentSearchTerm, setParentSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
      image: "",
      internalLink: "",
      status: "active",
      parentId: "",
      isSubCategory: false,
    },
  });

  const watchedIsSub = watch("isSubCategory");
  const watchedImage = watch("image");

  const flattenedParents = useMemo(() => {
    const parents: Category[] = [];
    categories.forEach((cat) => {
      parents.push({ ...cat, level: 0 });
      if (cat.subCategories) {
        cat.subCategories.forEach((sub) => {
          parents.push({ ...sub, level: 1 });
          if (sub.subCategories) {
            sub.subCategories.forEach((nested) => {
              parents.push({ ...nested, level: 2 });
            });
          }
        });
      }
    });
    return parents;
  }, [categories]);

  const filteredParents = useMemo(() => {
    if (!parentSearchTerm) return flattenedParents;
    return flattenedParents.filter((p) =>
      p.name.toLowerCase().includes(parentSearchTerm.toLowerCase()),
    );
  }, [flattenedParents, parentSearchTerm]);

  // Populate form when editing a category
  useEffect(() => {
    if (editingCategory) {
      reset({
        name: editingCategory.name || "",
        image: editingCategory.image || "",
        internalLink: editingCategory.internalLink || "",
        status: editingCategory.status || "active",
        parentId: editingCategory.parentId || "",
        isSubCategory: !!editingCategory.parentId || editingCategory.isSubCategory || false,
      });
      setImagePreview("");
      setSelectedFile(null);
    } else {
      reset({
        name: "",
        image: "",
        internalLink: "",
        status: "active",
        parentId: "",
        isSubCategory: false,
      });
      setImagePreview("");
      setSelectedFile(null);
    }
  }, [editingCategory, reset]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error("Image size must be less than 100MB");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setValue("image", url);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit((data) => onSubmit(data, selectedFile || undefined))}
            className="p-4 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                placeholder="Enter category name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image *
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {(watchedImage || imagePreview) && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                    <img
                      src={imagePreview || (watchedImage?.startsWith("http") ? watchedImage : getFullImageUrl(watchedImage || ""))}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/image.png";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setSelectedFile(null);
                        setValue("image", "");
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-black"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("isSubCategory")}
                  type="checkbox"
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  This is a sub-category
                </span>
              </label>
            </div>

            {watchedIsSub && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search parent categories..."
                    value={parentSearchTerm}
                    onChange={(e) => setParentSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-black"
                  />
                </div>
                <div className="mt-2 max-h-40 overflow-y-auto border rounded-lg">
                  {filteredParents.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        {...register("parentId")}
                        type="radio"
                        value={cat.id}
                        className="w-4 h-4 text-orange-600"
                      />
                      <span style={{ paddingLeft: (cat.level ?? 0) * 12 }}>
                        {(cat.level ?? 0) > 0 && "↳ "}
                        {cat.name}
                      </span>
                    </label>
                  ))}
                  {filteredParents.length === 0 && (
                    <p className="p-2 text-gray-500 text-sm">No categories found</p>
                  )}
                </div>
              </div>
            )}

            {!watchedIsSub && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Internal Link *
                </label>
                <input
                  {...register("internalLink", {
                    required: !watchedIsSub ? "Internal link is required" : false,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                  placeholder="/products/category-slug"
                />
                {errors.internalLink && (
                  <p className="text-red-500 text-sm mt-1">{errors.internalLink.message}</p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isUploading}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {(isLoading || isUploading) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingCategory ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}