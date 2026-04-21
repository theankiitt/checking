import { apiClient } from "@/shared/api/client";
import { Category } from "@/shared/types";

export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<{ categories: Category[] }>(
    "/categories",
  );
  return response.categories;
}

export async function getCategory(categoryId: string): Promise<Category> {
  const response = await apiClient.get<{ category: Category }>(
    `/categories/${categoryId}`,
  );
  return response.category;
}

export async function createCategory(data: unknown): Promise<Category> {
  const response = await apiClient.post<{ category: Category }>(
    "/categories",
    data,
  );
  return response.category;
}

export async function updateCategory(
  id: string,
  data: unknown,
): Promise<Category> {
  const response = await apiClient.patch<{ category: Category }>(
    `/categories/${id}`,
    data,
  );
  return response.category;
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}
