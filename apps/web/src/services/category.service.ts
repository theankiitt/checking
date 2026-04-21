import { apiClient } from "@/lib/api/client";
import { ApiError, logError } from "@/lib/error-handler";
import type { Category } from "@/types";

function normalizeImageUrl(imageUrl?: string): string | undefined {
  if (!imageUrl) return undefined;
  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("/uploads/")) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}${imageUrl}`;
  }
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads${imageUrl}`;
}

export async function getCategories(params?: {
  limit?: number;
  isActive?: boolean;
  parentId?: string;
}): Promise<Category[]> {
  try {
    const data = await apiClient.get<{
      success: boolean;
      data: { categories: Category[] };
    }>("/api/v1/categories", params);

    if (!data.success || !Array.isArray(data.data?.categories)) {
      return [];
    }

    return data.data.categories.map((category: Category) => ({
      ...category,
      image: category.image ? normalizeImageUrl(category.image) : undefined,
    }));
  } catch (error) {
    const apiError = error instanceof ApiError ? error : new ApiError("Failed to fetch categories", 0, error);
    logError(apiError, { params });
    return [];
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const data = await apiClient.get<{
      success: boolean;
      data: { category: Category };
    }>(`/api/v1/categories/${id}`);

    if (!data.success || !data.data?.category) return null;

    return {
      ...data.data.category,
      image: data.data.category.image
        ? normalizeImageUrl(data.data.category.image)
        : undefined,
    };
  } catch (error) {
    const apiError = error instanceof ApiError ? error : new ApiError("Failed to fetch category", 0, error);
    logError(apiError, { categoryId: id });
    return null;
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  try {
    const data = await apiClient.get<{
      success: boolean;
      data: { category: Category };
    }>(`/api/v1/categories/slug/${slug}`);

    if (!data.success || !data.data?.category) return null;

    return {
      ...data.data.category,
      image: data.data.category.image
        ? normalizeImageUrl(data.data.category.image)
        : undefined,
    };
  } catch (error) {
    const apiError = error instanceof ApiError ? error : new ApiError("Failed to fetch category", 0, error);
    logError(apiError, { slug });
    return null;
  }
}

export async function getFeaturedCategories(
  limit: number = 10,
): Promise<Category[]> {
  return getCategories({ limit, isActive: true });
}

// Utility function to find category in tree
export function findCategoryInTree(
  categories: Category[],
  targetId: string,
): Category | null {
  for (const category of categories) {
    if (category.id === targetId) {
      return category;
    }
    if (category.children && category.children.length > 0) {
      const found = findCategoryInTree(category.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

// Utility function to get category path
export function getCategoryPath(
  categories: Category[],
  targetId: string,
  path: Category[] = [],
): Category[] | null {
  for (const category of categories) {
    const newPath = [...path, category];
    if (category.id === targetId) {
      return newPath;
    }
    if (category.children && category.children.length > 0) {
      const found = getCategoryPath(
        category.children,
        targetId,
        newPath,
      );
      if (found) return found;
    }
  }
  return null;
}
