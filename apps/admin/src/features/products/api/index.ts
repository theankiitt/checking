import { apiClient } from "@/shared/api/client";
import { Product } from "@/shared/types";

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getProducts(
  params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: string;
  } = {},
): Promise<ProductsResponse> {
  return apiClient.get<ProductsResponse>("/products", {
    page: params.page,
    limit: params.limit,
    category: params.category,
    search: params.search,
    isActive: params.isActive,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });
}

export async function getProduct(productId: string): Promise<Product> {
  const response = await apiClient.get<{ product: Product }>(
    `/products/${productId}`,
  );
  return response.product;
}

export async function createProduct(data: unknown): Promise<Product> {
  const response = await apiClient.post<{ product: Product }>(
    "/products",
    data,
  );
  return response.product;
}

export async function updateProduct(
  id: string,
  data: unknown,
): Promise<Product> {
  const response = await apiClient.patch<{ product: Product }>(
    `/products/${id}`,
    data,
  );
  return response.product;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}
