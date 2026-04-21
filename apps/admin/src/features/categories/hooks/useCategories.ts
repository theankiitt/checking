"use client";

import { useState, useEffect, useCallback } from "react";
import type { Category, CategoryFormData } from "../types";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type CategoryApiResponse = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  internalLink?: string;
  createdAt: string;
  isActive: boolean;
  parentId?: string;
  children?: CategoryApiResponse[];
  _count?: {
    products?: number;
  };
};

type CategoriesResponse = {
  success: boolean;
  data: {
    categories: CategoryApiResponse[];
  };
  message?: string;
};

type CreateCategoryResponse = {
  success: boolean;
  data: {
    category: CategoryApiResponse;
  };
  message?: string;
  error?: string;
};

type UpdateCategoryResponse = {
  success: boolean;
  data: {
    category: CategoryApiResponse;
  };
  message?: string;
};

type UploadImageResponse = {
  success: boolean;
  data: {
    url: string;
  };
  message?: string;
};

type UseCategoriesReturn = {
  categories: Category[];
  loading: boolean;
  error: string | null;
  isUploading: boolean;
  isDeleting: (id: string) => boolean;
  createCategory: (data: Partial<Category>) => Promise<{ success: boolean; categoryId?: string }>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  uploadImage: (file: File) => Promise<string>;
  fetchCategories: () => Promise<void>;
};

const transformCategory = (apiCategory: CategoryApiResponse, level = 0): Category => ({
  id: apiCategory.id,
  name: apiCategory.name,
  image: apiCategory.image || "/image.png",
  internalLink: apiCategory.internalLink || undefined,
  createdAt: new Date(apiCategory.createdAt).toISOString().split("T")[0],
  status: apiCategory.isActive ? "active" : "inactive",
  parentId: apiCategory.parentId || undefined,
  level,
  hasChildren: !!(apiCategory.children && apiCategory.children.length > 0),
  totalQuantity: apiCategory._count?.products || 0,
  availableUnits: apiCategory._count?.products || 0,
  subCategories: apiCategory.children?.map((child) => transformCategory(child, level + 1)) || [],
});

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const isDeleting = useCallback((id: string) => deletingIds.has(id), [deletingIds]);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data: CategoriesResponse = await response.json();

      if (data.success) {
        const transformed = data.data.categories.map((cat) => transformCategory(cat, 0));
        setCategories(transformed);
      } else {
        throw new Error(data.message || "Failed to fetch");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch";
      setError(message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_BASE_URL}/api/v1/upload/category`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Upload failed with status ${response.status}`);
      }

      const data: UploadImageResponse = await response.json();
      
      if (data.success) {
        return data.data.url;
      }
      throw new Error(data.message || "Upload failed");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      throw new Error(message);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const createCategory = useCallback(
    async (categoryData: Partial<Category>): Promise<{ success: boolean; categoryId?: string }> => {
      try {
        const payload: Record<string, unknown> = {
          name: categoryData.name,
          image: categoryData.image || null,
          internalLink: categoryData.internalLink || null,
          isActive: categoryData.status === "active",
          parentId: categoryData.parentId || null,
        };

        if (categoryData.disclaimer) payload.disclaimer = categoryData.disclaimer;
        if (categoryData.additionalDetails) payload.additionalDetails = categoryData.additionalDetails;

        const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
        }

        const data: CreateCategoryResponse = await response.json();

        if (data.success) {
          await fetchCategories();
          toast.success("Category created successfully!");
          return { success: true, categoryId: data.data.category.id };
        }
        throw new Error(data.error || data.message || "Failed to create");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        toast.error(message);
        return { success: false };
      }
    },
    [fetchCategories],
  );

  const updateCategory = useCallback(
    async (id: string, categoryData: Partial<Category>): Promise<boolean> => {
      try {
        const payload = {
          name: categoryData.name,
          image: categoryData.image || null,
          internalLink: categoryData.internalLink || null,
          isActive: categoryData.status === "active",
          parentId: categoryData.parentId || null,
          ...(categoryData.disclaimer && { disclaimer: categoryData.disclaimer }),
          ...(categoryData.additionalDetails && { additionalDetails: categoryData.additionalDetails }),
          ...(categoryData.faqs && { faqs: categoryData.faqs }),
        };

        const response = await fetch(`${API_BASE_URL}/api/v1/categories/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data: UpdateCategoryResponse = await response.json();

        if (data.success) {
          await fetchCategories();
          toast.success("Category updated successfully!");
          return true;
        }
        throw new Error(data.message || "Failed to update");
      } catch {
        toast.error("Failed to update category");
        return false;
      }
    },
    [fetchCategories],
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setDeletingIds((prev) => new Set(prev).add(id));

        const response = await fetch(`${API_BASE_URL}/api/v1/categories/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `Failed to delete (status: ${response.status})`);
        }

        const data = await response.json();

        if (data.success) {
          setCategories((prev) => prev.filter((c) => c.id !== id));
          toast.success("Category deleted successfully!");
          return true;
        }
        throw new Error(data.message || "Failed to delete");
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to delete";
        
        if (errorMsg.toLowerCase().includes("existing products") || 
            errorMsg.toLowerCase().includes("product")) {
          toast.error("Cannot delete: This category has products. Remove or reassign products first.");
        } else if (errorMsg.toLowerCase().includes("unauthorized") || 
                   errorMsg.toLowerCase().includes("401")) {
          toast.error("You must be logged in to delete categories");
        } else if (errorMsg.toLowerCase().includes("404")) {
          toast.error("Category not found");
        } else {
          toast.error(`Failed to delete: ${errorMsg}`);
        }
        return false;
      } finally {
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [],
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
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
  };
};

export const getFullImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("/uploads/")) return `${API_BASE_URL}${imagePath}`;
  return `${API_BASE_URL}/uploads${imagePath}`;
};